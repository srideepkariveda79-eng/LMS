import React, { useEffect, useState } from 'react'
import { listStyles } from '../assets/dummyStyles'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Edit2, Eye, EyeClosed, HelpCircle, Plus, Search, Star, StarHalf, Trash2, Video, X } from 'lucide-react'

const API_BASE = 'http://localhost:4000'

// ── Inline Quiz Editor ──────────────────────────────────────────────────────
const QuizEditor = ({ course, onClose, onSaved }) => {
  const [quiz, setQuiz] = useState(() => ({
    enabled: course.quiz?.enabled ?? false,
    passingScore: course.quiz?.passingScore ?? 70,
    questions: course.quiz?.questions ?? [],
  }))
  const [newQ, setNewQ] = useState({ question: '', options: ['', '', '', ''], correctIndex: 0 })
  const [saving, setSaving] = useState(false)

  const addQuestion = () => {
    if (!newQ.question.trim()) { toast.error('Enter question text'); return }
    if (newQ.options.some(o => !o.trim())) { toast.error('Fill all 4 options'); return }
    if (quiz.questions.length >= 10) { toast.error('Max 10 questions'); return }
    setQuiz(p => ({ ...p, questions: [...p.questions, { ...newQ }] }))
    setNewQ({ question: '', options: ['', '', '', ''], correctIndex: 0 })
  }

  const removeQuestion = (i) => setQuiz(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }))

  const save = async () => {
    if (quiz.enabled && quiz.questions.length < 5) {
      toast.error('Add at least 5 questions before enabling quiz')
      return
    }
    setSaving(true)
    try {
      await axios.patch(`${API_BASE}/api/course/${course.id}/quiz`, { quiz })
      toast.success('Quiz saved!')
      onSaved({ ...course, quiz })
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save quiz')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white border border-red-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-100">
          <h2 className="text-gray-900 font-bold text-lg">Manage Quiz — {course.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Enable toggle + passing score */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={quiz.enabled} onChange={e => setQuiz(p => ({ ...p, enabled: e.target.checked }))}
                className="w-4 h-4 accent-red-600" />
              <span className="text-gray-700 text-sm font-semibold">Enable Quiz</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Passing Score %</span>
              <input type="number" min="1" max="100" value={quiz.passingScore}
                onChange={e => setQuiz(p => ({ ...p, passingScore: Number(e.target.value) }))}
                className="w-20 bg-white border border-red-100 rounded-lg px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500" />
            </label>
          </div>

          {/* Existing questions */}
          {quiz.questions.length > 0 && (
            <div className="space-y-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Questions ({quiz.questions.length}/10)</p>
              {quiz.questions.map((q, i) => (
                <div key={i} className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">{i + 1}. {q.question}</p>
                    <p className="text-gray-500 text-xs mt-1">Correct: {q.options[q.correctIndex]}</p>
                  </div>
                  <button onClick={() => removeQuestion(i)} className="text-red-500 hover:text-red-700 shrink-0"><X size={16} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Add new question */}
          {quiz.questions.length < 10 && (
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 space-y-3">
              <p className="text-gray-700 text-sm font-semibold">Add Question</p>
              <textarea value={newQ.question} onChange={e => setNewQ(p => ({ ...p, question: e.target.value }))}
                placeholder="Question text..." rows={2}
                className="w-full bg-white border border-red-100 rounded-lg px-3 py-2 text-gray-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500" />
              <div className="grid grid-cols-2 gap-2">
                {newQ.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={newQ.correctIndex === oi}
                      onChange={() => setNewQ(p => ({ ...p, correctIndex: oi }))}
                      className="accent-red-600 shrink-0" title="Mark as correct answer" />
                    <input value={opt} onChange={e => {
                      const opts = [...newQ.options]; opts[oi] = e.target.value
                      setNewQ(p => ({ ...p, options: opts }))
                    }} placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      className="flex-1 bg-white border border-red-100 rounded-lg px-2 py-1.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500" />
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">Select the radio button next to the correct answer</p>
              <button onClick={addQuestion} className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">
                <Plus size={14} /> Add Question
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-red-100">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>
    </div>
  )
}
// ───────────────────────────────────────────────────────────────────────────


const ListPage = () => {

const navigate = useNavigate()
const [searchTerm, setSearchTerm] = useState('')
const [expandedCourse, setExpandedCourse] = useState(null)
const [expandedLectures, setExpandedLectures] = useState({})
const [courses, setCourses] = useState([])
const [loading, setLoading] = useState(false)
const [quizEditorCourse, setQuizEditorCourse] = useState(null)

const API_BASE = 'http://localhost:4000'

// build image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
      return imagePath;
    // If the server sends path like "/uploads/..." or "uploads/..."
    if (imagePath.startsWith("/")) return `${API_BASE}${imagePath}`;
    if (imagePath.includes("/uploads/"))
      return `${API_BASE}/${imagePath}`.replace(/\/\/+/g, "/");
    return `${API_BASE}/uploads/${imagePath}`;
  };

  // parse duration into total minutes
  const parseDuration = (v) => {
    if (v == null) return 0;

    // number -> assume minutes
    if (typeof v === "number" && Number.isFinite(v))
      return Math.max(0, Math.floor(v));

    // String -> try "1h 20m" or "80m" or plain number string
    if (typeof v === "string") {
      const s = v.trim();
      // match hours and minutes like "1h 20m" or "1 h 20 m"
      const hMatch = s.match(/(\d+)\s*h/i);
      const mMatch = s.match(/(\d+)\s*m/i);
      let total = 0;
      if (hMatch) total += parseInt(hMatch[1], 10) * 60;
      if (mMatch) total += parseInt(mMatch[1], 10);
      if (total > 0) return total;
      // maybe it's just a plain number in minutes
      const plain = parseInt(s.replace(/[^\d-]/g, ""), 10);
      if (Number.isFinite(plain)) return Math.max(0, plain);
      // ISO-ish fallback: try PT#M / PT#H#M
      const isoHM = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
      if (isoHM) {
        const h = Number(isoHM[1] || 0);
        const m = Number(isoHM[2] || 0);
        return h * 60 + m;
      }
      return 0;
    }

    // Object -> check known fields
    if (typeof v === "object") {
      // nested duration: { duration: { hours, minutes } }
      if (v.duration) return parseDuration(v.duration);

      if ("totalMinutes" in v && Number.isFinite(Number(v.totalMinutes))) {
        return Math.max(0, Math.floor(Number(v.totalMinutes)));
      }
      if ("minutes" in v && "hours" in v) {
        const hrs = Number(v.hours) || 0;
        const mins = Number(v.minutes) || 0;
        return Math.max(0, Math.floor(hrs * 60 + mins));
      }
      if ("hours" in v || "mins" in v || "min" in v) {
        const hrs = Number(v.hours) || 0;
        const mins = Number(v.minutes || v.mins || v.min) || 0;
        return Math.max(0, Math.floor(hrs * 60 + mins));
      }
      if ("minutes" in v) {
        return Math.max(0, Math.floor(Number(v.minutes) || 0));
      }
      // sometimes backend may send { length: 80 } or { durationMin: 80 }
      if ("durationMin" in v && Number.isFinite(Number(v.durationMin))) {
        return Math.max(0, Math.floor(Number(v.durationMin)));
      }
      if ("length" in v && Number.isFinite(Number(v.length))) {
        return Math.max(0, Math.floor(Number(v.length)));
      }
    }

    return 0;
  };

  // Format minutes into consistent string like "1h 20m" or "45m"
  const formatMinutes = (mins) => {
    const m = Math.max(0, Math.floor(Number(mins) || 0));
    const h = Math.floor(m / 60);
    const rem = m % 60;
    if (h === 0) return `${rem}m`;
    if (rem === 0) return `${h}h`;
    return `${h}h ${rem}m`;
  };



   // normalize ID (not strictly required but handy)
  const getId = (c) => (c && (c._id ? c._id : c.id)) || null;

  // Robust fetch that handles variations: array | { items: [...] } | { courses: [...] }
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/course`);
      let raw = res.data;
      if (raw && raw.data) raw = raw.data;

      let arr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.courses)
        ? raw.courses
        : Array.isArray(raw.items)
        ? raw.items
        : [];

      // Defensive nested case
      if (!Array.isArray(arr) && raw.items && Array.isArray(raw.items.items)) {
        arr = raw.items.items;
      }

      if (!Array.isArray(arr)) arr = [];

      const mapped = arr.map((c) => {
        const id = String(c._id || c.id || '');
        const imageUrl = c.image || c.img || c.thumbnail || "";
        const finalImage = getImageUrl(imageUrl);

        // lectures array variations
        const lecturesArr = c.courseLectures || c.lectures || c.contents || [];

        // totalDuration variations -> compute minutes
        const totalDurationRaw =
          c.totalDuration || c.duration || c.totalDurationObj || null;
        const totalDurationMinutes = parseDuration(totalDurationRaw);

        // ensure each lecture/chapter durations normalized too (not altering original shape but helpful)
        const normalizedLectures = Array.isArray(lecturesArr)
          ? lecturesArr.map((lec) => ({
              ...lec,
              _parsedDurationMinutes:
                lec.durationMin ??
                lec.totalMinutes ??
                parseDuration(lec.duration) ??
                0,
              chapters: Array.isArray(lec.chapters)
                ? lec.chapters.map((ch) => ({
                    ...ch,
                    _parsedDurationMinutes:
                      ch.durationMin ??
                      ch.totalMinutes ??
                      parseDuration(ch.duration) ??
                      0,
                  }))
                : [],
            }))
          : [];

        return {
          ...c,
          id,
          name: c.name || c.title || "Untitled Course",
          instructor: c.teacher || c.instructor || "Unknown Instructor",
          image: finalImage,
          rating: typeof c.rating !== "undefined" ? c.rating : 0,
          lectures: Array.isArray(lecturesArr) ? lecturesArr.length : 0,
          courseLectures: normalizedLectures,
          description:
            c.description || c.desc || c.overview || "No description provided.",
          courseType: c.courseType || c.type || "regular",
          totalDurationMinutes,
        };
      });

      setCourses(mapped);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      toast.error("Failed to load courses. Check server or network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


   // filter the course by name, category or course
    const filteredCourses = courses.filter((course) => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return true;
    return (
      (course.name || "").toLowerCase().includes(t) ||
      (course.instructor || "").toLowerCase().includes(t) ||
      (course.category || "").toLowerCase().includes(t)
    );
  });

  const toggleCourseDetails = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    if (expandedCourse === courseId) {
      // collapsing: clear lecture expansions for this course
      setExpandedLectures((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (key.startsWith(`${courseId}-`)) delete newState[key];
        });
        return newState;
      });
    }
  };

  const toggleLectureDetails = (courseId, lectureId) => {
    const key = `${courseId}-${lectureId}`;
    setExpandedLectures((prev) => ({ ...prev, [key]: !prev[key] }));
  };


   // DELETE without auth headers
  const handleRemoveCourse = async (courseId, courseName) => {
    if (
      !window.confirm(`Delete course "${courseName}"? This cannot be undone.`)
    )
      return;

    const prev = [...courses];
    setCourses((c) => c.filter((x) => x.id !== courseId));

    try {
      await axios.delete(`${API_BASE}/api/course/${courseId}`);
      toast.success(`"${courseName}" has been removed successfully!`, {
        duration: 3000,
        style: { background: "#ef4444", color: "white" },
        icon: "🗑️",
      });
    } catch (err) {
      console.error("Delete failed:", err);
      setCourses(prev); // rollback
      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized: server requires authentication to delete.");
      } else {
        toast.error("Failed to delete course. Try again.");
      }
    }
  };

  const StarRating = ({ rating }) => {
    const rounded = Math.round((rating || 0) * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalf = rounded % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className={listStyles.starRating}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={listStyles.starFull} />
        ))}
        {hasHalf && <StarHalf className={listStyles.starHalf} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={listStyles.starEmpty} />
        ))}
      </div>
    );
  };

  return (
    <div className={listStyles.pageContainer}>
        <Toaster position='top-right' />

        {quizEditorCourse && (
          <QuizEditor
            course={quizEditorCourse}
            onClose={() => setQuizEditorCourse(null)}
            onSaved={(updated) => setCourses(prev => prev.map(c => c.id === updated.id ? { ...c, quiz: updated.quiz } : c))}
          />
        )}
       
        <div className={listStyles.contentContainer}>
             <div>
            <div className={listStyles.headerContainer}>
                <h1 className={listStyles.headerTitle}>Course Catalog </h1>
                <p className={listStyles.headerSubtitle}>Manage all your courses</p>
            </div>
        </div>
        <div className={listStyles.searchContainer}>
            <div className={listStyles.searchInputContainer}>
                <Search className={listStyles.searchIcon} />
                <input type="text" placeholder='Search courses by teachers, categories or name' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={listStyles.searchInput} />

            </div>
        </div>
        <div className={listStyles.courseList}>
            {loading && (
                <div className={listStyles.emptyText}>Loading Courses...</div>
            )}

             {!loading &&
            filteredCourses.map((course) => (
              <div key={course.id} className={listStyles.courseCard}>
                <div className={listStyles.courseCardContent}>
                  <div className={listStyles.courseHeader}>
                    <div className={listStyles.courseImageContainer}>
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.name}
                          className={listStyles.courseImage}
                        />
                      ) : (
                        <div className={listStyles.courseImage} />
                      )}
                      <div className={listStyles.courseInfo}>
                        <div className={listStyles.courseTitleRow}>
                          <div className="flex-1 min-w-0">
                            <h3 className={listStyles.courseTitle}>
                              {course.name}
                            </h3>
                            <p className={listStyles.courseInstructor}>
                              {course.instructor}
                            </p>
                          </div>

                          <span
                            className={listStyles.courseBadge(
                              course.courseType
                            )}
                            aria-label={`Course type: ${
                              course.courseType === "top"
                                ? "Top Course"
                                : "Regular Course"
                            }`}
                            title={
                              course.courseType === "top"
                                ? "Top Course"
                                : "Regular Course"
                            }
                          >
                            {course.courseType === "top"
                              ? "Top Course"
                              : "Regular Course"}
                          </span>
                        </div>

                        <div className={listStyles.courseMeta}>
                          <div className={listStyles.metaItem}>
                            <BookOpen className={listStyles.metaIcon} />
                            <span>{course.lectures} lectures</span>
                          </div>
                          <div className={listStyles.metaItem}>
                            <Clock className={listStyles.metaIcon} />
                            <span>
                              {formatMinutes(course.totalDurationMinutes)}
                            </span>
                          </div>
                          <StarRating rating={course.rating} />
                        </div>
                      </div>
                    </div>

                      <div className={listStyles.actionButtons}>
                        <button
                          onClick={() => setQuizEditorCourse(course)}
                          className={listStyles.toggleButton}
                          title="Manage Quiz"
                          aria-label="Manage quiz"
                        >
                          <HelpCircle className={listStyles.actionIcon} />
                        </button>

                        <button
                          onClick={() => navigate(`/editcourse/${course.id}`)}
                          className={listStyles.toggleButton}
                          title="Edit Course"
                          aria-label="Edit course"
                        >
                          <Edit2 className={listStyles.actionIcon} />
                        </button>

                        <button
                          onClick={() => toggleCourseDetails(course.id)}
                          className={listStyles.toggleButton}
                          aria-label={
                            expandedCourse === course.id
                              ? "Hide course details"
                              : "Show course details"
                          }
                        >
                          {expandedCourse === course.id ? (
                            <Eye className={listStyles.actionIcon} />
                          ) : (
                            <EyeClosed className={listStyles.actionIcon} />
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleRemoveCourse(course.id, course.name)
                          }
                          className={listStyles.deleteButton}
                          aria-label={`Remove course: ${course.name}`}
                        >
                          <Trash2 className={listStyles.actionIcon} />
                        </button>
                      </div>
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <div className={listStyles.expandedCourse}>
                    <div className={listStyles.descriptionSection}>
                      <h4 className={listStyles.descriptionTitle}>
                        Course Description
                      </h4>
                      <p className={listStyles.descriptionText}>
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <h4 className={listStyles.descriptionTitle}>
                        Course Content
                      </h4>
                      <div className={listStyles.contentSection}>
                        {(course.courseLectures || []).map((lecture) => (
                          <div
                            key={lecture.id || lecture._id}
                            className={listStyles.lectureCard}
                          >
                            <div className={listStyles.lectureHeader}>
                              <button
                                onClick={() =>
                                  toggleLectureDetails(
                                    course.id,
                                    lecture.id || lecture._id
                                  )
                                }
                                className={listStyles.lectureToggleButton}
                              >
                                <div className={listStyles.lectureInfo}>
                                  <div className="flex-1 min-w-0">
                                    <h5 className={listStyles.lectureTitle}>
                                      {lecture.title}
                                    </h5>
                                    <div className={listStyles.lectureMeta}>
                                      <div className={listStyles.metaItem}>
                                        <Video
                                          className={listStyles.metaIcon}
                                        />
                                        <span>
                                          {(lecture.chapters || []).length}{" "}
                                          chapters
                                        </span>
                                      </div>
                                      <div className={listStyles.metaItem}>
                                        <Clock
                                          className={listStyles.metaIcon}
                                        />
                                        <span>
                                          {formatMinutes(
                                            lecture._parsedDurationMinutes ??
                                              parseDuration(lecture.duration)
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <EyeClosed
                                  className={listStyles.lectureToggleIcon(
                                    expandedLectures[
                                      `${course.id}-${
                                        lecture.id || lecture._id
                                      }`
                                    ]
                                  )}
                                />
                              </button>
                            </div>

                            {expandedLectures[
                              `${course.id}-${lecture.id || lecture._id}`
                            ] && (
                              <div className={listStyles.expandedLecture}>
                                <div className={listStyles.chapterList}>
                                  {(lecture.chapters || []).map((chapter) => (
                                    <div
                                      key={chapter.id || chapter._id}
                                      className={listStyles.chapterCard}
                                    >
                                      <div
                                        className={listStyles.chapterContent}
                                      >
                                        <div
                                          className={listStyles.chapterHeader}
                                        >
                                          <div
                                            className={listStyles.chapterIcon}
                                          >
                                            <Eye
                                              className={
                                                listStyles.chapterIconSvg
                                              }
                                            />
                                          </div>
                                          <div
                                            className={
                                              listStyles.chapterDetails
                                            }
                                          >
                                            <a
                                              href={chapter.videoUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={
                                                listStyles.chapterTitle
                                              }
                                            >
                                              <h6>{chapter.name}</h6>
                                            </a>
                                            <p
                                              className={
                                                listStyles.chapterTopic
                                              }
                                            >
                                              {chapter.topic}
                                            </p>

                                            <div
                                              className={listStyles.chapterMeta}
                                            >
                                              <span
                                                className={
                                                  listStyles.chapterDuration
                                                }
                                              >
                                                <Clock className="w-3 h-3" />
                                                {formatMinutes(
                                                  chapter._parsedDurationMinutes ??
                                                    parseDuration(
                                                      chapter.duration
                                                    )
                                                )}
                                              </span>
                                              <a
                                                href={chapter.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={
                                                  listStyles.chapterVideoLink
                                                }
                                              >
                                                {chapter.videoUrl}
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/*above is UI*/}

            {!loading && filteredCourses.length === 0 && (
                <div className={listStyles.emptyState}>
                        <Search className={listStyles.emptyIcon} />
                        <p className={listStyles.emptyText}>No matching courses</p>
                        <button onClick={() => setSearchTerm('')} className={listStyles.clearButton}>
                            Clear Search
                        </button>
                </div>
            )}

    </div>
        </div>
    </div>
  )
}

export default ListPage