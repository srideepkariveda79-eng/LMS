import React, { useEffect, useState } from 'react'
import { myCoursesStyles, myCoursesCustomStyles } from '../assets/dummyStyles'
import { useNavigate } from 'react-router-dom'
import { Play, Star, User, BookOpen, Award, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../hooks/useWishlist'

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'


const MyCourses = () => {

    const navigate = useNavigate()
    const { isSignedIn, getToken } = useAuth()
    const { toggle: toggleWishlist, isWishlisted } = useWishlist()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toastMsg, setToastMsg] = useState(null)
    const [progressMap, setProgressMap] = useState<Record<string, number>>({})

    const showToast = (msg) => {
        setToastMsg(msg)
        setTimeout(() => setToastMsg(null), 3000)
    }

    const [userRatings, setUserRatings] = useState(() => {
        try {
            const raw = localStorage.getItem('userCourseRatings')
            return raw ? JSON.parse(raw) : {}
        
        } catch {
            return {}
        }
    })
    const [hoverRatings, setHoverRatings] = useState({})

    useEffect(() => {
        try {
          localStorage.setItem("userCourseRatings", JSON.stringify(userRatings));
        } catch {}
      }, [userRatings]);

      //fetch
      useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchMyCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        // If user isn't signed in, don't call the protected endpoint.
        if (!isSignedIn) {
          if (mounted) {
            setCourses([]);
            setLoading(false);
          }
          return;
        }
        const token = getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const bookingsRes = await fetch(`${API_BASE}/api/booking/my`, {
          method: "GET",
          signal: controller.signal,
          headers,
        });

        // explicit handling for unauthorized
        if (bookingsRes.status === 401) {
          throw new Error(
            "Unauthorized — please sign in to view your bookings."
          );
        }

        if (!bookingsRes.ok) {
          const text = await bookingsRes.text().catch(() => "");
          throw new Error(
            text || `Failed to fetch bookings (${bookingsRes.status})`
          );
        }

        const bookingsJson = await bookingsRes.json();
        if (!bookingsJson || bookingsJson.success === false) {
          throw new Error(
            (bookingsJson && bookingsJson.message) || "Failed to load bookings"
          );
        }
        const bookings = bookingsJson.bookings || [];
        // (the rest of your logic is unchanged — fetch courses for each booking)
        const combined = await Promise.all(
          bookings.map(async (b) => {
            const courseId = b.course ?? b.courseId ?? null;
            if (!courseId) return null;

            try {
              const cToken = getToken();
              const cHeaders = { "Content-Type": "application/json" };
              if (cToken) cHeaders.Authorization = `Bearer ${cToken}`;

              const courseRes = await fetch(
                `${API_BASE}/api/course/${courseId}`,
                {
                  method: "GET",
                  signal: controller.signal,
                  headers: cHeaders,
                }
              );

              if (!courseRes.ok) {
                console.warn(
                  `Course ${courseId} not available (status ${courseRes.status}). Skipping booking.`
                );
                return null;
              }

              const courseJson = await courseRes.json().catch(() => null);
              if (!courseJson || !courseJson.success || !courseJson.course) {
                console.warn(
                  `Course ${courseId} response invalid; skipping booking.`
                );
                return null;
              }

              const courseData = courseJson.course;

              return {
                booking: b,
                course: {
                  ...courseData,
                  image: courseData.image || null,
                  avgRating:
                    typeof courseData.avgRating !== "undefined"
                      ? courseData.avgRating
                      : courseData.rating ?? 0,
                  totalRatings:
                    typeof courseData.totalRatings !== "undefined"
                      ? courseData.totalRatings
                      : courseData.ratingCount ?? 0,
                },
              };
            } catch (err) {
              if (controller.signal.aborted) return null;
              console.warn("Course fetch error for", courseId, err);
              return null;
            }
          })
        );

        if (!mounted) return;
        const valid = combined.filter(Boolean);
        const uiCourses = valid.map(({ booking, course }) => ({
          booking,
          id: course._id ?? course.id ?? booking.course ?? booking.courseId,
          name: course.name ?? booking.courseName ?? "Untitled Course",
          teacher: course.teacher ?? booking.teacherName ?? "",
          image: course.image ?? null,
          avgRating: course.avgRating ?? 0,
          totalRatings: course.totalRatings ?? 0,
          overview: course.overview ?? "",
          lectures: course.lectures ?? [],
          rawCourse: course,
          rawBooking: booking,
        }));
        setCourses(uiCourses);
        // fetch progress for each course
        const progressPromises = uiCourses.map(async (c) => {
          if (!c.id) return null
          try {
            const token = getToken()
            const res = await fetch(`${API_BASE}/api/booking/progress?courseId=${c.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            const completed = (data.completedChapters || []).length
            const total = (c.rawCourse?.lectures || []).reduce((sum: number, l: any) =>
              sum + (Array.isArray(l.chapters) ? l.chapters.length : 1), 0)
            return { id: c.id, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
          } catch { return null }
        })
        const progressResults = await Promise.all(progressPromises)
        const pMap: Record<string, number> = {}
        progressResults.forEach(r => { if (r) pMap[r.id] = r.pct })
        if (mounted) setProgressMap(pMap)
        // fetch user's per-course rating (unchanged)
        if (isSignedIn && uiCourses.length > 0) {
          const ratingPromises = uiCourses.map(async (c) => {
            if (!c.id) return null;
            try {
              const rToken = getToken();
              const rHeaders = { "Content-Type": "application/json" };
              if (rToken) rHeaders.Authorization = `Bearer ${rToken}`;
              const res = await fetch(
                `${API_BASE}/api/course/${c.id}/rating`,
                {
                  method: "GET",
                  headers: rHeaders,
                }
              );
              const data = await res.json().catch(() => null);
              if (res.ok && data && data.success && data.myRating) {
                return { courseId: c.id, myRating: data.myRating.rating };
              }
            } catch (err) {}
            return null;
          });

          const results = await Promise.all(ratingPromises);
          const ratingsMap = {};
          results.forEach((r) => {
            if (r && r.courseId) ratingsMap[r.courseId] = r.myRating;
          });
          if (mounted && Object.keys(ratingsMap).length) {
            setUserRatings((prev) => ({ ...prev, ...ratingsMap }));
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load your courses");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMyCourses();
    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  //to submit rating to server
  // Helper: optimistic submit rating to server
  const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const headers = { "Content-Type": "application/json" };
      const token = getToken()
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ rating: ratingValue }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to rate (${res.status})`;
        throw new Error(msg);
      }

      const avg =
        data.avgRating ?? data.course?.avgRating ?? data.avgRating ?? null;
      const total =
        data.totalRatings ??
        data.course?.ratingCount ??
        data.totalRatings ??
        null;

      if (avg !== null || total !== null) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  avgRating: typeof avg === "number" ? avg : c.avgRating,
                  totalRatings:
                    typeof total === "number" ? total : c.totalRatings,
                }
              : c
          )
        );
      }
      setUserRatings((prev) => ({ ...prev, [courseId]: ratingValue }));
      showToast("Thanks for rating!");
      return { success: true };
    } catch (err) {
      console.error("submitRatingToServer:", err);
      showToast(err.message || "Failed to submit rating");
      return { success: false, error: err };
    }
  };

    const handleSetRating = async (e, courseId, rating) => {
        e.stopPropagation()
        if (!isSignedIn) {
            showToast('Please sign in to rate')
            return
        }
        setUserRatings((prev) => ({
            ...prev,
            [courseId]: rating,
        }))
        await submitRatingToServer(courseId, rating)
    }

    const handleViewCourse = (courseId) => {
        if (!courseId) return;
        navigate(`/course/${courseId}`)
    }

    //for stars

     const renderInteractiveStars = (c) => {
    const userRating = userRatings[c.id] || 0;
    const hover = hoverRatings[c.id] || 0;
    const baseDisplay = userRating || Math.round(c.avgRating || 0);
    const displayRating = hover || baseDisplay;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;
            return (
              <button
                key={i}
                aria-label={`Rate ${idx} stars`}
                onClick={(e) => handleSetRating(e, c.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((s) => ({ ...s, [c.id]: idx }))
                }
                onMouseLeave={() =>
                  setHoverRatings((s) => ({ ...s, [c.id]: 0 }))
                }
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 2,
                  cursor: "pointer",
                }}
              >
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  style={{
                    color: filled ? "#f59e0b" : "#d1d5db",
                  }}
                />
              </button>
            );
          })}
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", marginLeft: 6 }}
        >
          <div style={{ fontWeight: 700, fontSize: 13 }}>
            {(c.avgRating || 0).toFixed(1)}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            ({c.totalRatings || 0})
          </div>
        </div>
      </div>
    );
  };

   if (loading) {
    return (
        <div className={myCoursesStyles.pageContainer}>
            <div className={myCoursesStyles.mainContainer}>
                <h1 className={myCoursesStyles.header}>My Courses</h1>
                <p className={myCoursesStyles.emptyText}>Loading your courses</p>
            </div>
        </div>
    )
   }

   if (error) {
    return (
        <div className={myCoursesStyles.pageContainer}>
            <div className={myCoursesStyles.mainContainer}>
                <h1 className={myCoursesStyles.header}>My Courses</h1>
                <p className={myCoursesStyles.emptyText} style={{ color: 'red',}}>{error}</p>
            </div>
        </div>
    )
   }

   if (!courses || courses.length === 0) {
    return (
        <div className={myCoursesStyles.pageContainer}>
            <div className={myCoursesStyles.mainContainer}>
                <h1 className={myCoursesStyles.header}>My Courses</h1>
                <p className={myCoursesStyles.emptyText}>You haven't purchased/enrolled for any courses</p>
            </div>
        </div>
    )
   }

  return (
    <div className={myCoursesStyles.pageContainer}>
        {toastMsg && (
          <div style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            background: '#1e293b', color: '#fff', padding: '10px 18px',
            borderRadius: 8, fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {toastMsg}
          </div>
        )}
        <div className={myCoursesStyles.mainContainer}>
            <h1 className={myCoursesStyles.header}>My Courses</h1>

            <div className={myCoursesStyles.grid}>
                {courses.map((course, index) => (
                    <div key={course.id ?? index}
                    className={myCoursesStyles.courseCard}
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                    }} role='button' tabIndex={0} onKeyDown={(e) => {
                        if (e.key === 'Enter') handleViewCourse(course.id)
                    }} onClick={() => handleViewCourse(course.id)}
                    >
                        <div className={myCoursesStyles.imageContainer}>
                            <img src={course.image || undefined} alt={course.name} className={myCoursesStyles.courseImage} />
                            {/* wishlist */}
                            <button onClick={e => { e.stopPropagation(); toggleWishlist(course.id) }}
                              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform z-10">
                              <Heart size={14} className={isWishlisted(course.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}/>
                            </button>
                        </div>
                        <div className={myCoursesStyles.courseContent}>
                             <h3 className={myCoursesStyles.courseName}>{course.name}</h3>

                            {/* Progress bar */}
                            {progressMap[course.id] !== undefined && (
                              <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progress</span>
                                  <span className="font-semibold text-red-600">{progressMap[course.id]}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progressMap[course.id]}%` }}/>
                                </div>
                                {progressMap[course.id] === 100 && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
                                    <Award size={11}/> Completed
                                  </div>
                                )}
                              </div>
                            )}

                            <div className={myCoursesStyles.infoContainer}>
                                <div className={myCoursesStyles.ratingContainer}>{renderInteractiveStars(course)}</div>
                            </div>
                                <div className={myCoursesStyles.teacherContainer}>
                                    <User className={myCoursesStyles.teacherIcon} />
                                    <span className={myCoursesStyles.teacherText}>{course.teacher}</span>
                                </div>
                        </div>

                            <button onClick={(e) => {
                                e.stopPropagation()
                                handleViewCourse(course.id)
                            }} className={myCoursesStyles.viewButton}>
                                <Play className={myCoursesStyles.buttonIcon} />
                                <span>View Course</span>
                            </button>

                    </div>
                )

                )}

            </div>

        </div>
        <style jsx>{myCoursesCustomStyles}</style>
    </div>
  )
}

export default MyCourses