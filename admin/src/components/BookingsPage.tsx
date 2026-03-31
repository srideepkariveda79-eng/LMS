import React, { useEffect, useRef, useState } from 'react'
import { bookingsStyles } from '../assets/dummyStyles'
import { BookOpen, GraduationCap, Search, User } from 'lucide-react';


const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

const BookingsPage = () => {


  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page] = useState(1); // expose later for pagination
  const limit = 200;

  // debounce timer and abort controller
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchBookings = async (search = "") => {
    setLoading(true);
    setError(null);

    // abort previous
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      q.set("limit", String(limit));
      q.set("page", String(page));

      const res = await fetch(`${API_BASE}/api/booking?${q.toString()}`, {
        method: "GET",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.message || `Request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      if (data && data.success) {
        const normalized = (data.bookings || []).map((b, idx) => ({
          id: b._id || b.bookingId || String(idx),
          studentName: b.studentName || b.userName || "Unknown student",
          courseName: b.courseName || "Untitled course",
          teacherName: b.teacherName || "Unknown teacher",
          enrolledDate: b.enrolledAt
            ? new Date(b.enrolledAt).toISOString().split("T")[0]
            : b.createdAt
            ? new Date(b.createdAt).toISOString().split("T")[0]
            : "",
          raw: b,
        }));

        setBookings(normalized);
      } else {
        setBookings([]);
        setError(data?.message || "No data");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // aborted — ignore
      } else {
        console.error("fetchBookings error:", err);
        setError(err.message || "Failed to fetch bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings('')
        return () => {
            if(abortRef.current) abortRef.current.abort()
        }
    
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            fetchBookings(searchTerm.trim())
        }, 300)
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
  }, [searchTerm])

  return (
    <div className={bookingsStyles.pageContainer}>
        <div className={bookingsStyles.contentContainer}>
            <div className={bookingsStyles.headerContainer}>
                <h1 className={bookingsStyles.headerTitle}>Course Bookings</h1>
                <p className={bookingsStyles.headerSubtitle}>All enrolled learners</p>      
            </div>

            {/* Search */}
            <div className={bookingsStyles.searchContainer}>
                <div className={bookingsStyles.searchInputContainer}>
                    <Search className={bookingsStyles.searchIcon} />
                    <input type="text" placeholder='Search by learner, course or teacher' 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={bookingsStyles.searchInput} />

                </div>
            </div>

            <div style={{
                minHeight: 36
            }}>
                {loading && (
                    <div className={bookingsStyles.loadingState}>
                            <p>Loading enrolled data... </p>
                    </div>
                )}
                {!loading && error && (
                    <div className={bookingsStyles.errorState}>
                            <p>Error: {error}</p>
                    </div>
                )}
            </div>

            {/* booking grid*/}
            <div className={bookingsStyles.bookingsGrid}>
                {!loading &&
                 bookings.map((booking) => (
                    <div key={booking.id} className={bookingsStyles.bookingCard}>
                        <div className={bookingsStyles.studentSection}>
                            <div className={bookingsStyles.studentIconContainer}>
                                <User className={bookingsStyles.studentIcon} />
                            </div>

                            <div className={bookingsStyles.studentInfo}>
                                <h3 className={bookingsStyles.studentName}>
                                    {booking.studentName}
                                </h3>
                                <p className={bookingsStyles.purchaseDate}>
                                    Enrolled on {booking.enrolledDate || '-'}
                                </p>
                            </div>

                        </div>

                        {/*course details*/}
                        <div className={bookingsStyles.courseDetails}>
                            <div className={bookingsStyles.detailItem}>
                                <BookOpen className={bookingsStyles.detailIcon} />
                                <span className={bookingsStyles.detailLabel}>
                                    Course:
                                </span>
                                <span className={bookingsStyles.detailValue}>{booking.courseName}</span>
                            </div>

                            <div className={bookingsStyles.detailItem}>
                                <GraduationCap className={bookingsStyles.detailIcon} />
                                <span className={bookingsStyles.detailLabel}>
                                    Teacher:
                                </span>
                                <span className={bookingsStyles.detailValue}>{booking.teacherName}</span>
                            </div>

                        </div>

                        <div className={bookingsStyles.statusContainer}>
                            <span className={bookingsStyles.statusBadge}>Enrolled</span>
                        </div>

                    </div>
                 ))
                }
            </div>

                {/*no result */ }
                {!loading && bookings.length === 0 && !error && (
                    <div className={bookingsStyles.emptyState}>
                            <div className={bookingsStyles.emptyContainer}>
                                <Search className={bookingsStyles.emptyIcon} />
                                <h3 className={bookingsStyles.emptyTitle}>No bookings found</h3>
                                <p className={bookingsStyles.emptyText}>Try new search terms</p>
                            </div>
                    </div>
                )}

        </div>
    </div>
  )
}

export default BookingsPage