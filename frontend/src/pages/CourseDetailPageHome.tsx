
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  BookOpen,
  ChevronDown,
  CheckCircle,
  Circle,
  X,
  ArrowLeft,
  User,
  Award,
  Target,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import {
  courseDetailStylesH,
  toastStyles,
  animationDelaysH,
  courseDetailCustomStyles,
  quizStyles,
} from "../assets/dummyStyles";
import { useAuth as useAuthContext } from "../context/AuthContext";
import Certificate from "../components/Certificate";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

const fmtMinutes = (mins) => {
  const h = Math.floor((mins || 0) / 60);
  const m = (mins || 0) % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${toastStyles.toast} ${
        type === "error" ? toastStyles.toastError : toastStyles.toastInfo
      }`}
    >
      <div className={toastStyles.toastContent}>
        <span>{message}</span>
        <button onClick={onClose} className={toastStyles.toastClose}>
          <X className={toastStyles.toastCloseIcon} />
        </button>
      </div>
    </div>
  );
};

/* helpers for video URLs */
const toEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const trimmed = String(url).trim();

    // ── YouTube ──────────────────────────────────────────────────────────────
    // Already an embed URL
    if (/youtube\.com\/embed\//.test(trimmed)) return trimmed;
    // youtube.com/watch?v=ID
    const ytWatch = trimmed.match(/[?&]v=([^&#]+)/);
    if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
    // youtu.be/ID
    const ytShort = trimmed.match(/youtu\.be\/([^?&#/]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

    // ── Google Drive ─────────────────────────────────────────────────────────
    // Sharing link: drive.google.com/file/d/FILE_ID/view  (or /edit, /preview)
    const gdrive = trimmed.match(/drive\.google\.com\/file\/d\/([^/?&#]+)/);
    if (gdrive) return `https://drive.google.com/file/d/${gdrive[1]}/preview`;
    // Already a preview URL
    if (/drive\.google\.com\/.*\/preview/.test(trimmed)) return trimmed;
    // Open link: drive.google.com/open?id=FILE_ID
    const gdriveOpen = trimmed.match(/drive\.google\.com\/open\?id=([^&#]+)/);
    if (gdriveOpen) return `https://drive.google.com/file/d/${gdriveOpen[1]}/preview`;

    // ── SharePoint / OneDrive ────────────────────────────────────────────────
    // Already an embed.aspx URL — use as-is (SharePoint handles its own params)
    if (/sharepoint\.com\/.*embed\.aspx/i.test(trimmed)) return trimmed;
    if (/onedrive\.live\.com\/embed/i.test(trimmed)) return trimmed;
    // SharePoint view/sharing link → convert to embed
    const spView = trimmed.match(/(https:\/\/[^/]+\.sharepoint\.com\/.+?)(?:\?|$)/);
    if (spView && /sharepoint\.com/i.test(trimmed)) {
      // Build embed URL from the base path
      return `${spView[1]}?web=1`;
    }
    // OneDrive sharing link (1drv.ms or onedrive.live.com)
    if (/1drv\.ms|onedrive\.live\.com/i.test(trimmed)) {
      return `https://onedrive.live.com/embed?resid=${encodeURIComponent(trimmed)}`;
    }

    // ── Fallback ─────────────────────────────────────────────────────────────
    return trimmed;
  } catch (e) {
    return url;
  }
};

// Autoplay only applies to YouTube; Google Drive and SharePoint ignore the param safely
const appendAutoplay = (embedUrl, autoplay = true) => {
  if (!embedUrl) return "";
  if (!autoplay) return embedUrl;
  // Don't append autoplay to Drive/SharePoint — they don't support it and it can break the URL
  if (/drive\.google\.com|sharepoint\.com|onedrive\.live\.com/i.test(embedUrl)) return embedUrl;
  return embedUrl.includes("?")
    ? `${embedUrl}&autoplay=1`
    : `${embedUrl}?autoplay=1`;
};

// VideoPlayer: handles YouTube, direct video files, and Google Drive links
// Google Drive blocks iframe embedding — Drive links always show an open button
const VideoPlayer = ({ url, title, autoplay, className }: { url: string; title?: string; autoplay?: boolean; className?: string }) => {
  const embedUrl = toEmbedUrl(url)
  const isDrive = /drive\.google\.com/.test(String(url))
  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(embedUrl)
  const finalSrc = appendAutoplay(embedUrl, autoplay)

  // Drive file ID for direct open link
  const driveFileId = isDrive
    ? (String(url).match(/\/file\/d\/([^/?#]+)/) || String(url).match(/[?&]id=([^&#]+)/))?.[1]
    : null
  const driveOpenUrl = driveFileId
    ? `https://drive.google.com/file/d/${driveFileId}/view`
    : url

  if (isDirectVideo) {
    return <video controls src={embedUrl} className={className} />
  }

  if (isDrive) {
    return (
      <div className="relative w-full h-full bg-gray-950 flex flex-col items-center justify-center gap-5 rounded-lg">
        {/* Drive logo */}
        <svg className="w-14 h-14" viewBox="0 0 87.3 78">
          <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
          <path d="M43.65 25L29.9 0c-1.35.8-2.5 1.9-3.3 3.3L1.2 48.5A9.06 9.06 0 000 53h27.5z" fill="#00ac47"/>
          <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z" fill="#ea4335"/>
          <path d="M43.65 25L57.4 0H29.9z" fill="#00832d"/>
          <path d="M59.8 53H87.3L73.55 29.15 57.4 0 43.65 25z" fill="#2684fc"/>
          <path d="M27.5 53l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2L59.8 53z" fill="#ffba00"/>
        </svg>
        <div className="text-center px-4">
          <p className="text-white font-semibold text-base mb-1">{title || 'Google Drive Video'}</p>
          <p className="text-gray-400 text-sm">This video is hosted on Google Drive</p>
        </div>
        <a
          href={driveOpenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition-all text-sm shadow-lg"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Watch on Google Drive
        </a>
      </div>
    )
  }

  return (
    <iframe
      title={title || 'video-player'}
      src={finalSrc}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  )
}

const normalizeCourse = (c) => {
  if (!c) return c;
  const course = { ...c };
  course.lectures = Array.isArray(course.lectures)
    ? course.lectures.map((l) => {
        const lecture = { ...l };
        lecture.durationMin =
          lecture.durationMin ??
          lecture.totalMinutes ??
          (lecture.duration?.hours || 0) * 60 +
            (lecture.duration?.minutes || 0);
        lecture.chapters = Array.isArray(lecture.chapters)
          ? lecture.chapters.map((ch) => {
              const chapter = { ...ch };
              chapter.durationMin =
                chapter.durationMin ??
                chapter.totalMinutes ??
                (chapter.duration?.hours || 0) * 60 +
                  (chapter.duration?.minutes || 0);
              return chapter;
            })
          : [];
        return lecture;
      })
    : [];
  return course;
};

const CourseDetailPageHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = id;

  const { user, getToken } = useAuthContext();
  const isLoggedIn = Boolean(user);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEnrolled, setIsEnrolled] = useState(false); 
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);

  const [toast, setToast] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState(new Set());
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [isTeacherAnimating, setIsTeacherAnimating] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Quiz state
  const [quizAvailable, setQuizAvailable] = useState(false); // true once API confirms quiz exists
  const [quizPassingScore, setQuizPassingScore] = useState(70);
  const [quizData, setQuizData] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);

  const studentNameFromUser = useMemo(() => user?.name || "", [user]);
  const studentEmailFromUser = useMemo(() => user?.email || "", [user]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/course/${courseId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to fetch course ${courseId}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        if (!json || !json.success) {
          throw new Error((json && json.message) || "Failed to load course");
        }
        const normalized = normalizeCourse(json.course);
        setCourse(normalized);
      })
      .catch((err) => {
        console.error("Failed to load course:", err);
        if (mounted) setError(err.message || "Failed to load course");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    let mounted = true;
    if (!course) return;

    const checkEnrollment = async () => {
      try {
        let headers = { "Content-Type": "application/json" };
        let opts = { method: "GET" };
        if (getToken) {
          try {
            const token = getToken();
            if (token) {
              headers.Authorization = `Bearer ${token}`;
              opts = { method: "GET", headers };
            } else {
              opts = { method: "GET", credentials: "include", headers };
            }
          } catch (e) {
            opts = { method: "GET", credentials: "include", headers };
          }
        } else {
          opts = { method: "GET", credentials: "include", headers };
        }

        const q = `${API_BASE}/api/booking/check?courseId=${encodeURIComponent(
          course._id ?? course.id ?? courseId
        )}`;
        const res = await fetch(q, opts);
        const data = await res.json().catch(() => ({}));

        let serverBooking =
          data.booking || data.bookingRecord || data.data || null;
        if (!serverBooking && data.sessionBooking)
          serverBooking = data.sessionBooking;

        const serverSaysEnrolled =
          data.enrolled ||
          data.userEnrolled ||
          data.alreadyBooked ||
          data.bookingExists;

        const bookingPaidOrConfirmed =
          serverBooking &&
          (serverSaysEnrolled ||
            serverBooking.paymentStatus === "Paid" ||
            serverBooking.paymentStatus === "paid" ||
            serverBooking.orderStatus === "Confirmed" ||
            serverBooking.orderStatus === "confirmed" ||
            !!serverBooking.paidAt);

        if (mounted && bookingPaidOrConfirmed) {
          setBookingInfo(serverBooking || null);
          setIsEnrolled(true);
          return;
        }

        if (mounted && serverBooking) {
          setBookingInfo(serverBooking);
          setIsEnrolled(false);
          return;
        }

        if (mounted) {
          setBookingInfo(null);
          setIsEnrolled(false);
        }
      } catch (err) {
        console.debug("booking.check failed:", err);
        // keep previous state (do not flip)
      }
    };

    checkEnrollment();
    return () => (mounted = false);
  }, [course, isLoggedIn, getToken, courseId]);

  useEffect(() => {
    setIsTeacherAnimating(true);
    const timer = setTimeout(() => setIsTeacherAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [course]);

  useEffect(() => setIsPageLoaded(true), []);

  const [selectedContent, setSelectedContent] = useState({
    type: "lecture",
    lectureId: null,
    chapterId: null,
  });

  const selectedLecture = useMemo(() => {
    if (!selectedContent.lectureId || !course) return null;
    return (
      (course.lectures || []).find(
        (l) =>
          String(l.id) === String(selectedContent.lectureId) ||
          String(l._id) === String(selectedContent.lectureId)
      ) || null
    );
  }, [course, selectedContent.lectureId]);

  const selectedChapter = useMemo(() => {
    if (!selectedContent.chapterId || !selectedLecture) return null;
    return (
      (selectedLecture.chapters || []).find(
        (ch) =>
          String(ch.id) === String(selectedContent.chapterId) ||
          String(ch._id) === String(selectedContent.chapterId)
      ) || null
    );
  }, [selectedLecture, selectedContent.chapterId]);

  const currentVideoContent = useMemo(() => {
    if (selectedContent.type === "chapter" && selectedChapter)
      return selectedChapter;
    if (selectedContent.type === "lecture" && selectedLecture)
      return selectedLecture;
    return null;
  }, [selectedContent, selectedLecture, selectedChapter]);

  const totalMinutes = useMemo(
    () =>
      (course?.lectures || []).reduce(
        (sum, l) => sum + (l.durationMin || l.totalMinutes || 0),
        0
      ),
    [course]
  );

  // All courses are free now
  const courseIsFree = true;

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });
  };

  const handleContentSelect = (lectureId, chapterId = null) => {
    if (isLoggedIn && isEnrolled) {
      setSelectedContent({
        type: chapterId ? "chapter" : "lecture",
        lectureId,
        chapterId,
      });
      setExpandedLectures((prev) =>
        prev.has(lectureId) ? new Set(prev) : new Set([...prev, lectureId])
      );
      return;
    }
    if (!isLoggedIn) {
      setToast({
        message: "Please login to access course content",
        type: "error",
      });
      return;
    }
    setToast({
      message: "Please enroll in the course to access content",
      type: "error",
    });
    return;
  };

  const onLectureHeaderClick = (lectureId) => {
    const isOpen = expandedLectures.has(lectureId);
    if (isOpen) {
      setExpandedLectures((prev) => {
        const next = new Set(prev);
        next.delete(lectureId);
        return next;
      });
      if (selectedContent.lectureId === lectureId) {
        setSelectedContent({
          type: "lecture",
          lectureId: null,
          chapterId: null,
        });
      }
      return;
    }
    if (!isEnrolled) {
      if (!isLoggedIn) {
        setToast({ message: "Please login to view chapters", type: "error" });
      } else {
        setToast({ message: "Please enroll to view chapters", type: "error" });
      }
      return;
    }
    setExpandedLectures((prev) => new Set([...prev, lectureId]));
    handleContentSelect(lectureId, null);
  };

  const toggleChapterCompletion = (chapterId, e) => {
    if (e) e.stopPropagation();
    if (!isLoggedIn || !isEnrolled) {
      setToast({
        message: "Please enroll and login to track progress",
        type: "error",
      });
      return;
    }
    setCompletedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  // create or complete booking (enroll)
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to enroll in the course",
        type: "error",
      });
      return;
    }
    if (!course) {
      setToast({ message: "Course not loaded", type: "error" });
      return;
    }

    if (isEnrolled) {
      setToast({
        message: "You are already enrolled in this course.",
        type: "info",
      });
      return;
    }

    setIsEnrolling(true);
    try {
      const studentName = studentNameFromUser || "";
      const email = studentEmailFromUser || "";

      const payload = {
        courseId: course._id ?? course.id ?? courseId,
        courseName: course.name,
        teacherName: course.teacher || "",
        studentName,
        email,
      };

      let headers = { "Content-Type": "application/json" };
      const token = getToken()
      if (token) headers.Authorization = `Bearer ${token}`
      const opts = { method: "POST", headers, body: JSON.stringify(payload) };

      const res = await fetch(`${API_BASE}/api/booking/create`, opts);
      const data = await res.json().catch(() => ({ success: false }));

      if (!res.ok || !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to create booking (${res.status})`;
        const alreadyBooked =
          /already booked|already enrolled|booking exists/i.test(msg) ||
          data.alreadyBooked ||
          data.bookingExists;
        if (alreadyBooked) {
          // Re-run server-side check to get booking state
          setToast({
            message:
              "You already have a booking for this course. Checking status...",
            type: "info",
          });
          try {
            const q = `${API_BASE}/api/booking/check?courseId=${encodeURIComponent(
              payload.courseId
            )}`;
            const checkOpts =
              opts.method === "POST"
                ? { method: "GET", headers: opts.headers }
                : { method: "GET", credentials: "include" };
            const chkRes = await fetch(q, checkOpts);
            const chkData = await chkRes.json().catch(() => ({}));
            if (chkData.booking) setBookingInfo(chkData.booking);
            // if server claims enrolled -> set
            if (
              chkData.enrolled ||
              chkData.userEnrolled ||
              chkData.bookingExists ||
              chkData.alreadyBooked
            ) {
              setIsEnrolled(true);
              setToast({ message: "You're enrolled.", type: "info" });
            } else {
              // if booking exists but unpaid
              if (chkData.booking)
                setToast({
                  message: "Booking found — payment pending.",
                  type: "info",
                });
            }
          } catch (e) {
            console.debug("re-check after alreadyBooked:", e);
          }
          return;
        }
        throw new Error(msg);
      }

      // If checkout is required (Stripe) — redirect the user
      if (data.checkoutUrl) {
        // Keep bookingInfo if server returned booking
        if (data.booking) setBookingInfo(data.booking);
        window.location.href = data.checkoutUrl;
        return;
      }

      // If server returned booking (free course or immediate confirmed)
      if (data.booking) {
        setBookingInfo(data.booking);
        // determine paid/confirmed
        const b = data.booking;
        const paid =
          b.paymentStatus === "Paid" ||
          b.paymentStatus === "paid" ||
          b.orderStatus === "Confirmed" ||
          b.orderStatus === "confirmed" ||
          !!b.paidAt;

        if (paid) {
          setIsEnrolled(true);
          setToast({
            message: "Enrolled successfully (free course).",
            type: "info",
          });
          return;
        }

        // fallback: mark enrolled
        setIsEnrolled(true);
        setToast({ message: "Enrolled.", type: "info" });
        return;
      }

      // if no booking returned but success true — assume enrolled for free courses
      if (data.success) {
        setIsEnrolled(true);
        setToast({ message: "Enrolled successfully.", type: "info" });
      }
    } catch (err) {
      console.error("Enroll error:", err);
      setToast({ message: err.message || "Enrollment failed", type: "error" });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleBackToHome = () => navigate("/");

  // Quiz handlers
  const loadQuiz = async () => {
    if (!isLoggedIn || !isEnrolled) {
      setToast({ message: 'Please enroll to take the quiz', type: 'error' });
      return;
    }
    setQuizLoading(true);
    setQuizError(null);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const cId = course._id ?? courseId;
      const [qRes, rRes] = await Promise.all([
        fetch(`${API_BASE}/api/course/${cId}/quiz`, { headers }),
        fetch(`${API_BASE}/api/course/${cId}/quiz/result`, { headers }),
      ]);
      const qData = await qRes.json().catch(() => ({}));
      const rData = await rRes.json().catch(() => ({}));
      if (qData.quizEnabled && qData.questions) {
        setQuizAvailable(true);
        setQuizPassingScore(qData.passingScore ?? 70);
        setQuizData({ questions: qData.questions, passingScore: qData.passingScore ?? 70 });
        setQuizResult(rData.result || null);
        setQuizOpen(true);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setQuizScore(null);
      } else {
        setQuizError(qData.message || 'Quiz not available for this course.');
      }
    } catch (err) {
      setQuizError('Failed to load quiz.');
    } finally {
      setQuizLoading(false);
    }
  };

  // Auto-load quiz result (not the full quiz) when enrolled, to show previous result banner
  useEffect(() => {
    if (!isEnrolled || !isLoggedIn || !course?._id) return;
    const cId = course._id;
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Check if quiz exists + fetch previous result in parallel
    Promise.all([
      fetch(`${API_BASE}/api/course/${cId}/quiz`, { headers }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/api/course/${cId}/quiz/result`, { headers }).then(r => r.json()).catch(() => ({})),
    ]).then(([qData, rData]) => {
      if (qData.quizEnabled && qData.questions?.length > 0) {
        setQuizAvailable(true);
        setQuizPassingScore(qData.passingScore ?? 70);
      }
      if (rData.result) setQuizResult(rData.result);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnrolled, isLoggedIn, course?._id]);

  const handleQuizSubmit = async () => {
    if (!quizData) return;
    const unanswered = quizData.questions.filter((_, i) => quizAnswers[i] == null);
    if (unanswered.length > 0) {
      setToast({ message: `Please answer all ${quizData.questions.length} questions`, type: 'error' });
      return;
    }
    setQuizSubmitting(true);
    try {
      const token = getToken();
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const answers = quizData.questions.map((_, i) => quizAnswers[i]);
      const res = await fetch(`${API_BASE}/api/course/${course._id ?? courseId}/quiz/submit`, {
        method: 'POST', headers, body: JSON.stringify({ answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setQuizScore(data);
        setQuizSubmitted(true);
        setQuizResult({ score: data.score, passed: data.passed, certificateId: data.certificateId, attemptedAt: new Date() });
      } else {
        setToast({ message: data.message || 'Submission failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to submit quiz', type: 'error' });
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading course...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  if (!course) {
    return (
      <div className={courseDetailStylesH.notFoundContainer}>
        <div className={courseDetailStylesH.notFoundPattern}>
          <div
            className={`${courseDetailStylesH.notFoundBlob} top-10 left-10 bg-red-300`}
          />
          <div
            className={`${courseDetailStylesH.notFoundBlob} top-10 right-10 bg-amber-300 ${animationDelaysH.delay2000}`}
          />
          <div
            className={`${courseDetailStylesH.notFoundBlob} bottom-10 left-20 bg-red-200 ${animationDelaysH.delay400}`}
          ></div>
        </div>
        <div className={courseDetailStylesH.notFoundContent}>
          <h2 className={courseDetailStylesH.notFoundTitle}>
            Course not found
          </h2>
          <p className={courseDetailStylesH.notFoundText}>
            Go back to courses list
          </p>
          <button
            onClick={() => navigate("/courses")}
            className={courseDetailStylesH.notFoundButton}
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={courseDetailStylesH.pageContainer}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={`${courseDetailStylesH.mainContainer} ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className={courseDetailStylesH.backButton}
          >
            <ArrowLeft className={courseDetailStylesH.backButtonIcon} />
            <span className={courseDetailStylesH.backButtonText}>
              Back to Home
            </span>
          </button>

          {/* refresh booking button intentionally removed */}
          <div />
        </div>

        <div className={courseDetailStylesH.headerContainer}>
          <div className={courseDetailStylesH.courseBadge}>
            <BookOpen className={courseDetailStylesH.badgeIcon} />
            <span className={courseDetailStylesH.badgeText}>
              Course
            </span>
          </div>

          <h1 className={courseDetailStylesH.courseTitle}>{course.name}</h1>

          {course.overview && (
            <div className={courseDetailStylesH.overviewContainer}>
              <div className={courseDetailStylesH.overviewCard}>
                <div className={courseDetailStylesH.overviewHeader}>
                  <Target className={courseDetailStylesH.overviewIcon} />
                  <h3 className={courseDetailStylesH.overviewTitle}>
                    Course Overview
                  </h3>
                </div>
                <p className={courseDetailStylesH.overviewText}>
                  {course.overview}
                </p>
              </div>
            </div>
          )}

          <div
            className={`${courseDetailStylesH.statsContainer} ${animationDelaysH.delay300}`}
          >
            <div className={courseDetailStylesH.statItem}>
              <Clock className={courseDetailStylesH.statIcon} />
              <span className={courseDetailStylesH.statText}>
                {fmtMinutes(totalMinutes)}
              </span>
            </div>
            <div className={courseDetailStylesH.statItem}>
              <BookOpen className={courseDetailStylesH.statIcon} />
              <span className={courseDetailStylesH.statText}>
                {(course.lectures || []).length} lectures
              </span>
            </div>

            <div
              className={`${courseDetailStylesH.teacherStat} ${
                isTeacherAnimating ? "scale-110 bg-red-100/50" : ""
              }`}
            >
              <User className={courseDetailStylesH.teacherIcon} />
              <span className={courseDetailStylesH.teacherText}>
                {course.teacher}
              </span>
            </div>
          </div>
        </div>

        <div className={courseDetailStylesH.mainGrid}>
          <div className={courseDetailStylesH.videoSection}>
            <div className={courseDetailStylesH.videoContainer}>
              <div className={courseDetailStylesH.videoWrapper}>
                {currentVideoContent?.videoUrl ? (
                  <VideoPlayer
                    url={currentVideoContent.videoUrl}
                    title={currentVideoContent.title || currentVideoContent.name}
                    autoplay={isLoggedIn && isEnrolled}
                    className={courseDetailStylesH.videoFrame}
                  />
                ) : (
                  <div className={courseDetailStylesH.videoPlaceholder}>
                    <div
                      className={courseDetailStylesH.videoPlaceholderPattern}
                    >
                      <div
                        className={`${courseDetailStylesH.videoPlaceholderBlob} top-1/4 left-1/4 bg-red-500`}
                      />
                      <div
                        className={`${courseDetailStylesH.videoPlaceholderBlob} bottom-1/4 right-1/4 bg-amber-500`}
                      />
                    </div>
                    <div
                      className={courseDetailStylesH.videoPlaceholderContent}
                    >
                      <div className={courseDetailStylesH.videoPlaceholderIcon}>
                        <Play
                          className={
                            courseDetailStylesH.videoPlaceholderPlayIcon
                          }
                        />
                      </div>
                      <p className={courseDetailStylesH.videoPlaceholderText}>
                        Select a lecture or chapter to play video
                      </p>
                      {!isLoggedIn || !isEnrolled ? (
                        <p
                          className={
                            courseDetailStylesH.videoPlaceholderSubtext
                          }
                        >
                          {!isLoggedIn
                            ? "Login required"
                            : "Enrollment required"}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <div className={courseDetailStylesH.videoInfo}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={courseDetailStylesH.videoTitle}>
                      {currentVideoContent?.title ||
                        currentVideoContent?.name ||
                        "Select content to play"}
                    </h3>
                    <p className={courseDetailStylesH.videoDescription}>
                      {selectedContent.type === "chapter"
                        ? `Part of: ${selectedLecture?.title}`
                        : currentVideoContent?.description}
                    </p>
                    {currentVideoContent?.durationMin && (
                      <div className={courseDetailStylesH.videoMeta}>
                        <div className={courseDetailStylesH.durationBadge}>
                          <Clock className={courseDetailStylesH.durationIcon} />
                          <span>
                            {fmtMinutes(currentVideoContent.durationMin)}
                          </span>
                        </div>
                        {selectedContent.type === "chapter" && (
                          <span className={courseDetailStylesH.chapterBadge}>
                            Chapter
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isLoggedIn && isEnrolled && selectedContent.chapterId && (
                  <div className={courseDetailStylesH.completionSection}>
                    <button
                      onClick={() =>
                        toggleChapterCompletion(selectedContent.chapterId)
                      }
                      className={`${courseDetailStylesH.completionButton} ${
                        completedChapters.has(selectedContent.chapterId)
                          ? courseDetailStylesH.completionButtonCompleted
                          : courseDetailStylesH.completionButtonIncomplete
                      }`}
                    >
                      {completedChapters.has(selectedContent.chapterId) ? (
                        <>
                          <CheckCircle
                            className={courseDetailStylesH.completionIcon}
                          />
                          Chapter Completed
                        </>
                      ) : (
                        <>
                          <Circle
                            className={courseDetailStylesH.completionIcon}
                          />
                          Mark as Complete
                        </>
                      )}
                    </button>
                    <p className={courseDetailStylesH.completionText}>
                      {completedChapters.has(selectedContent.chapterId)
                        ? "Great job! You've completed this chapter."
                        : "Click to mark this chapter as completed."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className={courseDetailStylesH.sidebar}>
            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay200}`}
            >
              <div className={courseDetailStylesH.contentHeader}>
                <h4 className={courseDetailStylesH.contentTitle}>
                  Course Content
                </h4>
                {courseIsFree && (
                  <div className={courseDetailStylesH.freeAccessBadge}>
                    <Sparkles className={courseDetailStylesH.freeAccessIcon} />
                    Free Access
                  </div>
                )}
              </div>

              <div className={courseDetailStylesH.contentList}>
                {(course.lectures || []).map((lecture, index) => (
                  <div
                    key={lecture.id ?? lecture._id ?? index}
                    className={courseDetailStylesH.lectureItem}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`${courseDetailStylesH.lectureHeader} ${
                        expandedLectures.has(lecture.id ?? lecture._id)
                          ? courseDetailStylesH.lectureHeaderExpanded
                          : courseDetailStylesH.lectureHeaderNormal
                      }`}
                      onClick={() =>
                        onLectureHeaderClick(lecture.id ?? lecture._id)
                      }
                    >
                      <div className={courseDetailStylesH.lectureContent}>
                        <div className={courseDetailStylesH.lectureLeft}>
                          <div
                            className={`${courseDetailStylesH.lectureChevron} ${
                              expandedLectures.has(lecture.id ?? lecture._id)
                                ? courseDetailStylesH.lectureChevronExpanded
                                : courseDetailStylesH.lectureChevronNormal
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                          <div className={courseDetailStylesH.lectureInfo}>
                            <div className={courseDetailStylesH.lectureTitle}>
                              {lecture.title}
                            </div>
                            <div className={courseDetailStylesH.lectureMeta}>
                              <div
                                className={courseDetailStylesH.lectureDuration}
                              >
                                <Clock
                                  className={
                                    courseDetailStylesH.lectureDurationIcon
                                  }
                                />
                                {fmtMinutes(lecture.durationMin)}
                              </div>
                              <span
                                className={
                                  courseDetailStylesH.lectureChaptersCount
                                }
                              >
                                {lecture.chapters?.length || 0} chapters
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedLectures.has(lecture.id ?? lecture._id) && (
                      <div className={courseDetailStylesH.chaptersList}>
                        {(lecture.chapters || []).map((chapter) => {
                          const chapId = chapter.id ?? chapter._id;
                          const isCompleted = completedChapters.has(chapId);
                          const isSelected =
                            String(selectedContent.chapterId) ===
                              String(chapId) &&
                            String(selectedContent.lectureId) ===
                              String(lecture.id ?? lecture._id);
                          return (
                            <div
                              key={chapId}
                              className={`${courseDetailStylesH.chapterItem} ${
                                isSelected
                                  ? courseDetailStylesH.chapterItemSelected
                                  : courseDetailStylesH.chapterItemNormal
                              }`}
                              onClick={() =>
                                handleContentSelect(
                                  lecture.id ?? lecture._id,
                                  chapId
                                )
                              }
                            >
                              <div
                                className={courseDetailStylesH.chapterContent}
                              >
                                <div
                                  className={courseDetailStylesH.chapterLeft}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleChapterCompletion(chapId, e);
                                    }}
                                    className={`${
                                      courseDetailStylesH.chapterCompletionButton
                                    } ${
                                      isCompleted
                                        ? courseDetailStylesH.chapterCompletionCompleted
                                        : courseDetailStylesH.chapterCompletionNormal
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : (
                                      <Circle className="w-5 h-5" />
                                    )}
                                  </button>
                                  <div
                                    className={courseDetailStylesH.chapterInfo}
                                  >
                                    <div
                                      className={`${
                                        courseDetailStylesH.chapterName
                                      } ${
                                        isSelected
                                          ? courseDetailStylesH.chapterNameSelected
                                          : courseDetailStylesH.chapterNameNormal
                                      }`}
                                    >
                                      {chapter.name}
                                    </div>
                                    <div
                                      className={
                                        courseDetailStylesH.chapterTopic
                                      }
                                    >
                                      {chapter.topic}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={
                                      courseDetailStylesH.chapterDuration
                                    }
                                  >
                                    {fmtMinutes(chapter.durationMin)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay200}`}
            >
              <div className={courseDetailStylesH.pricingHeader}>
                <h5 className={courseDetailStylesH.pricingTitle}>Enrollment</h5>
              </div>
              <div className={courseDetailStylesH.pricingAmount}>
                <div className={courseDetailStylesH.pricingCurrent}>
                  Free
                </div>
              </div>
              <p className={courseDetailStylesH.pricingDescription}>
                Free access · Learn anytime (enroll to unlock)
              </p>

              <div className="mt-6">
                {isEnrolled ? (
                  <button
                    disabled
                    className={courseDetailStylesH.enrollButtonEnrolled}
                  >
                    <CheckCircle
                      className={courseDetailStylesH.enrollButtonIcon}
                    />
                    Enrolled
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling || !isLoggedIn}
                    className={courseDetailStylesH.enrollButton}
                  >
                    {isEnrolling ? "Enrolling..." : isLoggedIn ? "Enroll for Free" : "Login to Enroll"}
                  </button>
                )}
              </div>
            </div>

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay400}`}
            >
              <div className={courseDetailStylesH.progressHeader}>
                <Award className={courseDetailStylesH.progressIcon} />
                <h5 className={courseDetailStylesH.progressTitle}>
                  Your Progress
                </h5>
              </div>
              <div className={courseDetailStylesH.progressSection}>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Course Completion</span>
                    <span className="font-semibold text-red-600">
                      {Math.round(
                        (completedChapters.size /
                          (course.lectures?.flatMap((l) => l.chapters || [])
                            .length || 1)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className={courseDetailStylesH.progressBarContainer}>
                    <div
                      className={courseDetailStylesH.progressBar}
                      style={{
                        width: `${
                          (completedChapters.size /
                            (course.lectures?.flatMap((l) => l.chapters || [])
                              .length || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className={courseDetailStylesH.progressStats}>
                  <div className={courseDetailStylesH.progressStat}>
                    <div className={courseDetailStylesH.progressStatValue}>
                      {fmtMinutes(totalMinutes)}
                    </div>
                    <div className={courseDetailStylesH.progressStatLabel}>
                      Total Duration
                    </div>
                  </div>
                  <div className={courseDetailStylesH.progressStat}>
                    <div className={courseDetailStylesH.progressStatValue}>
                      {completedChapters.size}
                    </div>
                    <div className={courseDetailStylesH.progressStatLabel}>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Quiz Section — shown when enrolled and quiz is available */}
        {isEnrolled && quizAvailable && (
          <div className={quizStyles.section}>
            <div className={quizStyles.header}>
              <div className={quizStyles.headerLeft}>
                <div className={quizStyles.headerIcon}>
                  <HelpCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className={quizStyles.headerTitle}>Course Quiz</p>
                  <p className={quizStyles.headerSubtitle}>
                    Pass with {quizPassingScore}% to earn your certificate
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {quizResult && (
                  <button onClick={() => setShowCertificate(true)} className={quizStyles.retakeBtn}>
                    {quizResult.passed ? 'View Certificate' : `Last: ${quizResult.score}%`}
                  </button>
                )}
                <button
                  onClick={loadQuiz}
                  disabled={quizLoading}
                  className={quizStyles.takeQuizBtn}
                >
                  {quizLoading ? 'Loading...' : quizResult ? 'Retake Quiz' : 'Take Quiz'}
                </button>
              </div>
            </div>

            {/* Previous result banner */}
            {quizResult && !quizOpen && (
              <div className={quizStyles.resultBanner(quizResult.passed)}>
                <Award size={18} className={quizStyles.resultBannerIcon(quizResult.passed)} />
                <span className={quizStyles.resultBannerText(quizResult.passed)}>
                  {quizResult.passed ? 'Passed' : 'Not passed yet'} — Score: {quizResult.score}%
                </span>
                <span className={quizStyles.resultBannerSub}>
                  {quizResult.attemptedAt ? new Date(quizResult.attemptedAt).toLocaleDateString() : ''}
                </span>
              </div>
            )}

            {/* Quiz body */}
            {quizOpen && quizData && (
              <div className={quizStyles.body}>
                {!quizSubmitted ? (
                  <>
                    {quizData.questions.map((q, qi) => (
                      <div key={String(q._id ?? qi)} className={quizStyles.questionCard}>
                        <p className={quizStyles.questionNumber}>Question {qi + 1} of {quizData.questions.length}</p>
                        <p className={quizStyles.questionText}>{q.question}</p>
                        <div className={quizStyles.optionsList}>
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              type="button"
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                              className={quizStyles.optionBtn(quizAnswers[qi] === oi, false, false, false)}
                            >
                              {String.fromCharCode(65 + oi)}. {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleQuizSubmit}
                      disabled={quizSubmitting || Object.keys(quizAnswers).length < quizData.questions.length}
                      className={quizStyles.submitBtn}
                    >
                      {quizSubmitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  </>
                ) : quizScore && (
                  <div className={quizStyles.scoreCard}>
                    <div className={quizStyles.scoreCircle(quizScore.passed)}>
                      <div>
                        <div className={quizStyles.scoreValue(quizScore.passed)}>{quizScore.score}%</div>
                        <div className={quizStyles.scoreLabel}>{quizScore.correct}/{quizScore.total} correct</div>
                      </div>
                    </div>
                    <p className={quizStyles.scoreStatus(quizScore.passed)}>
                      {quizScore.passed ? 'Congratulations! You passed!' : 'Not quite there yet'}
                    </p>
                    <p className={quizStyles.scoreMessage}>
                      {quizScore.passed
                        ? `You scored ${quizScore.score}% — above the ${quizScore.passingScore}% passing threshold.`
                        : `You need ${quizScore.passingScore}% to pass. Keep studying and try again!`}
                    </p>
                    {quizScore.passed && (
                      <button onClick={() => setShowCertificate(true)} className={quizStyles.viewCertBtn}>
                        <Award size={16} /> View Certificate
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certificate modal */}
      {showCertificate && quizResult?.passed && (
        <Certificate
          userName={studentNameFromUser}
          courseName={course?.name}
          score={quizResult.score}
          certificateId={quizResult.certificateId}
          date={quizResult.attemptedAt}
          instructorName={course?.teacher}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <style jsx>{courseDetailCustomStyles}</style>
    </div>
  );
};

export default CourseDetailPageHome;
