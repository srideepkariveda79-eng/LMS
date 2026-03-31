import React, { useState } from 'react'
import { addPageStyles, quizAdminStyles } from '../assets/dummyStyles'
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast'
import { BookOpenText, ChevronDown, ChevronUp, Clock, HelpCircle, Image as ImageIcon, ListOrdered, PenLine, Plus, Star, Upload, UserPen, Video, X, Award } from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'

// formatDuration accepts either {hours, minutes} or (hours, minutes)
const formatDuration = (a, b) => {
  let hours = 0;
  let minutes = 0;
  if (typeof a === "object" && a !== null) {
    hours = Number(a.hours) || 0;
    minutes = Number(a.minutes) || 0;
  } else {
    hours = Number(a) || 0;
    minutes = Number(b) || 0;
  }
  const totalMinutes = Math.max(0, Math.floor(hours * 60 + minutes));
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

//it calculates the total course and lectures duration

const computeCourseTotals = (lectures = []) => {
  const cloned = (Array.isArray(lectures) ? lectures : []).map((lecture) => {
    const lec = {
      ...lecture,
      duration: {
        hours: Number(lecture?.duration?.hours) || 0,
        minutes: Number(lecture?.duration?.minutes) || 0,
      },
      chapters: Array.isArray(lecture?.chapters) ? [...lecture.chapters] : [],
    };

    // compute chapter totals and sum
    let chaptersMinutes = 0;
    lec.chapters = lec.chapters.map((ch) => {
      const chHours = Number(ch?.duration?.hours) || 0;
      const chMins = Number(ch?.duration?.minutes) || 0;
      const chTotal = Math.max(0, chHours * 60 + chMins);
      chaptersMinutes += chTotal;
      return {
        ...ch,
        duration: { hours: chHours, minutes: chMins },
        totalMinutes: chTotal,
      };
    });

    // rule: chapters override lecture.duration when present
    let lectureTotalMinutes = 0;
    if (lec.chapters.length > 0) {
      lectureTotalMinutes = chaptersMinutes;
    } else {
      lectureTotalMinutes = Math.max(
        0,
        (Number(lec.duration.hours) || 0) * 60 +
          (Number(lec.duration.minutes) || 0)
      );
    }

    // normalize lecture.duration from computed total
    const lh = Math.floor(lectureTotalMinutes / 60);
    const lm = lectureTotalMinutes % 60;

    return {
      ...lec,
      totalMinutes: lectureTotalMinutes,
      duration: { hours: lh, minutes: lm },
    };
  });

  const courseTotalMinutes = cloned.reduce(
    (s, l) => s + (Number(l.totalMinutes) || 0),
    0
  );

  return {
    lectures: cloned,
    totalLectures: cloned.length,
    totalDuration: {
      hours: Math.floor(courseTotalMinutes / 60),
      minutes: courseTotalMinutes % 60,
    },
  };
};

const AddPage = () => {
      const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
    image: null,
    level: "beginner",
    rating: 0,
    overview: "",
    totalDuration: { hours: "", minutes: "" },
    totalLectures: "",
    lectures: [],
    courseType: "regular",
  });

  const [currentLecture, setCurrentLecture] = useState({
    title: "",
    duration: { hours: "", minutes: "" },
    chapters: [],
  });

  const [currentChapter, setCurrentChapter] = useState({
    name: "",
    topic: "",
    duration: { hours: "", minutes: "" },
    videoUrl: "",
  });

  const [showLectureForm, setShowLectureForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [expandedLectures, setExpandedLectures] = useState([]);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);

  // Quiz state
  const [quiz, setQuiz] = useState({ enabled: false, passingScore: 70, questions: [] });
  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctIndex: 0 });

//to toggle the lectures
  const toggleLecture = (index) =>
    setExpandedLectures((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("totalDuration.")) {
      const durationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        totalDuration: { ...prev.totalDuration, [durationField]: value },
      }));
    } else if (name === "totalLectures") {
      setFormData((prev) => ({ ...prev, totalLectures: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCourseTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, courseType: type }));
    toast.success(
      type === "top"
        ? "Course set as Top Course!"
        : "Course set as Regular Course!"
    );
  };

  //for image handling
    const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({
        ...prev,
        image: { file, preview: ev.target.result },
      }));
      toast.success("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleRatingChange = (rating) =>
    setFormData((prev) => ({ ...prev, rating })); // to change the rating

  //to change the lectures
    const handleLectureChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("duration.")) {
      const durationField = name.split(".")[1];
      setCurrentLecture((prev) => ({
        ...prev,
        duration: { ...prev.duration, [durationField]: value },
      }));
    } else {
      setCurrentLecture((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("duration.")) {
      const durationField = name.split(".")[1];
      setCurrentChapter((prev) => ({
        ...prev,
        duration: { ...prev.duration, [durationField]: value },
      }));
    } else {
      setCurrentChapter((prev) => ({ ...prev, [name]: value }));
    }
  };

  // to calculate total minutes, duration + lectures count
  const calculateTotalMinutes = (hours, minutes) =>
    (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

  const calculateTotalCourseDuration = () => {
    const { totalDuration } = computeCourseTotals(formData.lectures);
    return formatDuration(totalDuration);
  };

  const calculateTotalLectures = () => formData.lectures.length;

  const formatTotalDuration = () => formatDuration(formData.totalDuration);

 // validate each form field
  const validateForm = () => {
    if (!formData.name?.trim()) {
      toast.error("Please enter course name");
      return false;
    }
    if (!formData.teacher?.trim()) {
      toast.error("Please enter instructor name");
      return false;
    }
    if (!formData.image?.file) {
      toast.error("Please upload a course image");
      return false;
    }
    if (!formData.overview?.trim()) {
      toast.error("Please enter course overview");
      return false;
    }
    if (formData.lectures.length === 0 && (!formData.totalLectures || Number(formData.totalLectures) <= 0)) {
      toast.error("Please enter valid total lectures count");
      return false;
    }
    if (!formData.totalDuration.hours && !formData.totalDuration.minutes && formData.lectures.length === 0) {
      toast.error("Please enter total duration or add lectures");
      return false;
    }
    if (formData.lectures.length === 0) {
      toast.error("Please add at least one lecture");
      return false;
    }
    for (let i = 0; i < formData.lectures.length; i++) {
      const lecture = formData.lectures[i];
      if (!lecture.title?.trim()) {
        toast.error(`Lecture ${i + 1} has no title`);
        return false;
      }
      // if lecture has no chapters, ensure lecture.duration is provided
      if (
        (lecture.chapters?.length || 0) === 0 &&
        !lecture.duration.hours &&
        !lecture.duration.minutes
      ) {
        toast.error(`Lecture ${i + 1} has no duration`);
        return false;
      }
    }
    // quiz validation
    if (quiz.enabled && quiz.questions.length < 5) {
      toast.error("Quiz is enabled — add at least 5 questions (or disable quiz)");
      return false;
    }
    return true;
  };


//Add lecture
  const addLecture = () => {
    if (!currentLecture.title?.trim()) {
      toast.error("Please enter lecture title");
      return;
    }

    // If lecture has no chapters, require duration
    const hasChapters =
      Array.isArray(currentLecture.chapters) &&
      currentLecture.chapters.length > 0;
    if (
      !hasChapters &&
      !currentLecture.duration.hours &&
      !currentLecture.duration.minutes
    ) {
      toast.error(
        "Please enter lecture duration or add chapters with durations"
      );
      return;
    }

    const lecture = {
      id: `lecture-${Date.now()}`,
      title: currentLecture.title.trim(),
      duration: {
        hours: Number(currentLecture.duration.hours) || 0,
        minutes: Number(currentLecture.duration.minutes) || 0,
      },
      chapters: (currentLecture.chapters || []).map((ch) => ({ ...ch })),
    };

    const newLectures = [...formData.lectures, lecture];
    const computed = computeCourseTotals(newLectures);

    setFormData((prev) => ({
      ...prev,
      lectures: computed.lectures,
      totalDuration: computed.totalDuration,
      totalLectures: computed.totalLectures,
    }));

    setCurrentLecture({
      title: "",
      duration: { hours: "", minutes: "" },
      chapters: [],
    });
    setShowLectureForm(false);
    setExpandedLectures((prev) => [...prev, (formData.lectures || []).length]);
    toast.success("Lecture added successfully!");
  };

// Add chapter: to existing lecture or to current lecture draft
  const addChapter = () => {
    if (!currentChapter.name?.trim()) {
      toast.error("Please enter chapter name");
      return;
    }
    if (!currentChapter.topic?.trim()) {
      toast.error("Please enter chapter topic");
      return;
    }
    if (!currentChapter.duration.hours && !currentChapter.duration.minutes) {
      toast.error("Please enter chapter duration");
      return;
    }
    if (!currentChapter.videoUrl?.trim()) {
      toast.error("Please enter video URL");
      return;
    }

    const chapter = {
      id: `chapter-${Date.now()}`,
      name: currentChapter.name.trim(),
      topic: currentChapter.topic.trim(),
      duration: {
        hours: Number(currentChapter.duration.hours) || 0,
        minutes: Number(currentChapter.duration.minutes) || 0,
      },
      totalMinutes: calculateTotalMinutes(
        currentChapter.duration.hours,
        currentChapter.duration.minutes
      ),
      videoUrl: currentChapter.videoUrl.trim(),
    };

    let newLectures = [...formData.lectures];

    if (
      selectedLectureIndex !== null &&
      typeof selectedLectureIndex === "number"
    ) {
      // add to existing lecture
      if (!newLectures[selectedLectureIndex]) {
        toast.error("Selected lecture not found");
        return;
      }
      newLectures[selectedLectureIndex] = {
        ...newLectures[selectedLectureIndex],
        chapters: [
          ...(newLectures[selectedLectureIndex].chapters || []),
          chapter,
        ],
      };

      const computed = computeCourseTotals(newLectures);
      setFormData((prev) => ({
        ...prev,
        lectures: computed.lectures,
        totalDuration: computed.totalDuration,
        totalLectures: computed.totalLectures,
      }));
      toast.success("Chapter added successfully!");
    } else {
      // add to current lecture draft's chapters
      setCurrentLecture((prev) => ({
        ...prev,
        chapters: [...(prev.chapters || []), chapter],
      }));
      toast.success("Chapter added to current lecture draft!");
    }

    setCurrentChapter({
      name: "",
      topic: "",
      duration: { hours: "", minutes: "" },
      videoUrl: "",
    });
    setShowChapterForm(false);
    setSelectedLectureIndex(null);
  }; // validated and get resetted 


  //add a chapter, remove the lecture or chapter
   const openAddChapter = (lectureIndex = null) => {
    setSelectedLectureIndex(lectureIndex);
    setShowChapterForm(true);
  };

  const removeLecture = (index) => {
    const updated = formData.lectures.filter((_, i) => i !== index);
    const computed = computeCourseTotals(updated);
    setFormData((prev) => ({
      ...prev,
      lectures: computed.lectures,
      totalDuration: computed.totalDuration,
      totalLectures: computed.totalLectures,
    }));
    setExpandedLectures((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
    );
    toast.success("Lecture removed");
  };

  const removeChapter = (lectureIndex, chapterIndex) => {
    const updated = formData.lectures.map((lec, li) => {
      if (li !== lectureIndex) return lec;
      return {
        ...lec,
        chapters: (lec.chapters || []).filter((_, ci) => ci !== chapterIndex),
      };
    });
    const computed = computeCourseTotals(updated);
    setFormData((prev) => ({
      ...prev,
      lectures: computed.lectures,
      totalDuration: computed.totalDuration,
      totalLectures: computed.totalLectures,
    }));
    toast.success("Chapter removed");
  };

  // Quiz handlers
  const addQuestion = () => {
    if (!newQuestion.question.trim()) { toast.error('Enter question text'); return; }
    if (newQuestion.options.some(o => !o.trim())) { toast.error('Fill all 4 options'); return; }
    if (quiz.questions.length >= 10) { toast.error('Maximum 10 questions allowed'); return; }
    setQuiz(prev => ({ ...prev, questions: [...prev.questions, { ...newQuestion, id: Date.now() }] }));
    setNewQuestion({ question: '', options: ['', '', '', ''], correctIndex: 0 });
    toast.success('Question added');
  };

  const removeQuestion = (idx) => {
    setQuiz(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
  };

  // Submit
  const submitToBackend = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const computed = computeCourseTotals(formData.lectures);
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("teacher", formData.teacher);
      fd.append("level", formData.level);
      fd.append("rating", String(formData.rating || 0));
      fd.append("overview", formData.overview);      fd.append(
        "totalLectures",
        String(formData.totalLectures || computed.totalLectures || 0)
      );
      fd.append("courseType", formData.courseType);
      fd.append("totalDuration", JSON.stringify(computed.totalDuration));
      fd.append("lectures", JSON.stringify(computed.lectures));

      if (quiz.enabled) {
        fd.append("quiz", JSON.stringify(quiz));
      }

      if (formData.image?.file) fd.append("image", formData.image.file);

      const res = await fetch(`${API_BASE}/api/course`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          data?.message || data?.error || "Failed to create course";
        toast.error(message);
        setLoading(false);
        return;
      }

      toast.success("Course created successfully!");
      navigate("/listcourse");
    } catch (err) {
      console.error("submitToBackend error:", err);
      toast.error("Server error while creating course");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitToBackend();
  };

  const StarRating = ({ rating, onRatingChange }) => (
    <div className={addPageStyles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={addPageStyles.starButton}
        >
          {star <= rating ? (
            <Star className={addPageStyles.starFull} size={28} />
          ) : (
            <Star className={addPageStyles.starEmpty} size={28} />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className={addPageStyles.pageContainer}>
        <Toaster position='top-right' toastOptions={{duration: 3000}} />

        <div className={addPageStyles.contentContainer}>
            <div className={addPageStyles.headerContainer}>
                <div className={addPageStyles.headerGradient}>
                <div className={addPageStyles.headerGlow}> </div>
                <h1 className={addPageStyles.headerTitle}>Create New Course</h1>
            </div>
            <p className={addPageStyles.headerSubtitle}>Create new courses here</p>
        </div>

        {/* form */}

             <form onSubmit={handleSubmit} className={addPageStyles.form}>
          {/* Course Type */}
          <div
            className={`${addPageStyles.card} ${addPageStyles.courseTypeCard}`}
          >
            <div className={addPageStyles.cardHeader}>
              <div className={addPageStyles.cardIconContainer}>
                <BookOpenText className={addPageStyles.cardIcon} size={20} />
              </div>
              <div>
                <h2 className={addPageStyles.cardTitle}>Course Type</h2>
                <p className={addPageStyles.cardSubtitle}>
                  Select the type of course you want to create
                </p>
              </div>
            </div>

            <div className={addPageStyles.courseTypeGrid}>
              <label
                htmlFor="top"
                className={addPageStyles.courseTypeLabel(
                  formData.courseType === "top",
                  "top"
                )}
              >
                <input
                  type="radio"
                  id="top"
                  name="courseType"
                  value="top"
                  checked={formData.courseType === "top"}
                  onChange={() => handleCourseTypeChange("top")}
                  className={`${addPageStyles.courseTypeInput} text-orange-500`}
                />
                <div>
                  <h3 className={addPageStyles.courseTypeText}>Top Course</h3>
                </div>
              </label>

              <label
                htmlFor="regular"
                className={addPageStyles.courseTypeLabel(
                  formData.courseType === "regular",
                  "regular"
                )}
              >
                <input
                  type="radio"
                  id="regular"
                  name="courseType"
                  value="regular"
                  checked={formData.courseType === "regular"}
                  onChange={() => handleCourseTypeChange("regular")}
                  className={`${addPageStyles.courseTypeInput} text-red-500`}
                />
                <div>
                  <h3 className={addPageStyles.courseTypeText}>
                    Regular Course
                  </h3>
                </div>
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div
            className={`${addPageStyles.card} ${addPageStyles.courseInfoCard}`}
          >
            <div className={addPageStyles.cardHeader}>
              <div className={addPageStyles.cardIconContainer}>
                <BookOpenText className={addPageStyles.cardIcon} size={20} />
              </div>
              <div>
                <h2 className={addPageStyles.cardTitle}>Course Information</h2>
                <p className={addPageStyles.cardSubtitle}>
                  Basic details about your course
                </p>
              </div>
            </div>

            <div className={addPageStyles.formGrid}>
              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}>
                  <PenLine size={16} className={addPageStyles.inputIcon} />{" "}
                  Course Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={addPageStyles.input}
                  placeholder="e.g., React Masterclass"
                  required
                />
              </div>

              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}>
                  <UserPen size={16} className={addPageStyles.inputIcon} />{" "}
                  Instructor Name *
                </label>
                <input
                  type="text"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className={addPageStyles.input}
                  placeholder="e.g., Sophia Miller"
                  required
                />
              </div>

              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}>
                  <Award size={16} className={addPageStyles.inputIcon} />{" "}
                  Course Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className={addPageStyles.select}
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}>
                  <Star size={16} className={addPageStyles.inputIcon} /> Course
                  Rating
                </label>
                <div className="p-2 sm:p-3 bg-white border-2 border-gray-200 rounded-full shadow-sm">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={handleRatingChange}
                  />
                </div>
              </div>

              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}>
                  <Clock size={16} className={addPageStyles.inputIcon} /> Total
                  Duration {formData.lectures.length > 0 ? '(auto)' : '*'}
                </label>
                {formData.lectures.length > 0 ? (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                    {calculateTotalCourseDuration()} — calculated from lectures
                  </div>
                ) : (
                <div className={addPageStyles.durationGrid}>
                  <div>
                    <input
                      type="number"
                      name="totalDuration.hours"
                      value={formData.totalDuration.hours}
                      onChange={handleInputChange}
                      placeholder="Hours"
                      min="0"
                      className={addPageStyles.input}
                    />
                    <span className={addPageStyles.durationHelper}>Hours</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="totalDuration.minutes"
                      value={formData.totalDuration.minutes}
                      onChange={handleInputChange}
                      placeholder="Minutes"
                      min="0"
                      max="59"
                      className={addPageStyles.input}
                    />
                    <span className={addPageStyles.durationHelper}>
                      Minutes
                    </span>
                  </div>
                </div>
                )}
                {formData.lectures.length === 0 && (formData.totalDuration.hours ||
                  formData.totalDuration.minutes) && (
                  <p className={addPageStyles.durationFormatted}>
                    Formatted: {formatTotalDuration()}
                  </p>
                )}
              </div>

              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}>
                  <ListOrdered size={16} className={addPageStyles.inputIcon} />{" "}
                  Total Lectures {formData.lectures.length > 0 ? '(auto)' : '*'}
                </label>
                {formData.lectures.length > 0 ? (
                  <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                    {formData.lectures.length} lecture{formData.lectures.length !== 1 ? 's' : ''} — auto-counted
                  </div>
                ) : (
                <input
                  type="number"
                  name="totalLectures"
                  value={formData.totalLectures}
                  onChange={handleInputChange}
                  min="1"
                  className={addPageStyles.input}
                  placeholder="Enter total number of lectures"
                  required
                />
                )}
              </div>

              <div className={addPageStyles.formFullWidth}>
                <label className={addPageStyles.inputLabel}>
                  <ImageIcon size={16} className={addPageStyles.inputIcon} />{" "}
                  Course Image *
                </label>
                <div className={addPageStyles.uploadContainer}>
                  <label className={addPageStyles.uploadLabel}>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={addPageStyles.uploadInput}
                    />
                    <div className={addPageStyles.uploadBox}>
                      <Upload size={18} className={addPageStyles.uploadIcon} />
                      <span className="font-medium text-center sm:text-left">
                        {formData.image
                          ? "Change Image"
                          : "Upload Course Image"}
                      </span>
                    </div>
                  </label>
                  {formData.image && (
                    <div className={addPageStyles.imagePreview}>
                      <img
                        src={formData.image.preview}
                        alt="Course preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={addPageStyles.formFullWidth}>
                <label className={addPageStyles.inputLabel}>
                  <BookOpenText size={16} className={addPageStyles.inputIcon} />{" "}
                  Course Overview *
                </label>
                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleInputChange}
                  rows="4"
                  className={addPageStyles.textarea}
                  placeholder="Describe what students will learn..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Lectures */}
          <div
            className={`${addPageStyles.card} ${addPageStyles.lecturesCard}`}
          >
            <div className={addPageStyles.lecturesHeader}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={addPageStyles.cardIconContainer}>
                  <Video className={addPageStyles.cardIcon} size={20} />
                </div>
                <div>
                  <h2 className={addPageStyles.cardTitle}>Course Content</h2>
                  {formData.lectures.length > 0 ? (
                    <p className={addPageStyles.cardSubtitle}>
                      {calculateTotalLectures()} lectures •{" "}
                      {calculateTotalCourseDuration()} total duration
                    </p>
                  ) : (
                    <p className={addPageStyles.cardSubtitle}>
                      Add lectures and chapters to structure your course
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLectureForm(true)}
                className={addPageStyles.addLectureButton}
              >
                <Plus size={16} /> Add Lecture
              </button>
            </div>

            <div className={addPageStyles.lecturesList}>
              {formData.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className={addPageStyles.lectureCard}>
                  <div className={addPageStyles.lectureHeader}>
                    <div className={addPageStyles.lectureContent}>
                      <button
                        onClick={() => toggleLecture(lectureIndex)}
                        className={addPageStyles.lectureToggleButton}
                      >
                        {expandedLectures.includes(lectureIndex) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      <div className={addPageStyles.lectureInfo}>
                        <h3 className={addPageStyles.lectureTitle}>
                          {lecture.title}
                        </h3>
                        <p className={addPageStyles.lectureMeta}>
                          <Clock size={14} /> {formatDuration(lecture.duration)}
                          {lecture.chapters?.length > 0 &&
                            ` • ${lecture.chapters.length} chapters`}
                        </p>
                      </div>
                    </div>
                    <div className={addPageStyles.lectureActions}>
                      <button
                        type="button"
                        onClick={() => openAddChapter(lectureIndex)}
                        className={addPageStyles.addChapterButton}
                      >
                        <Plus size={14} /> Add Chapter
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLecture(lectureIndex)}
                        className={addPageStyles.deleteButton}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {expandedLectures.includes(lectureIndex) &&
                    lecture.chapters?.length > 0 && (
                      <div className={addPageStyles.chaptersContainer(true)}>
                        {lecture.chapters.map((chapter, chapterIndex) => (
                          <div
                            key={chapter.id}
                            className={addPageStyles.chapterCard}
                          >
                            <div className={addPageStyles.chapterContent}>
                              <div className={addPageStyles.chapterInfo}>
                                <h4 className={addPageStyles.chapterTitle}>
                                  {chapter.name}
                                </h4>
                                <p className={addPageStyles.chapterTopic}>
                                  {chapter.topic}
                                </p>
                                <div className={addPageStyles.chapterMeta}>
                                  <span
                                    className={addPageStyles.chapterDuration}
                                  >
                                    <Clock size={12} />{" "}
                                    {formatDuration(chapter.duration)}
                                  </span>
                                  <p className={addPageStyles.chapterUrl}>
                                    {chapter.videoUrl}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeChapter(lectureIndex, chapterIndex)
                                }
                                className={addPageStyles.chapterDeleteButton}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Section */}
          <div className={`${addPageStyles.card}`}>
            <div className={quizAdminStyles.sectionHeader}>
              <div className={quizAdminStyles.sectionIconContainer}>
                <HelpCircle className={quizAdminStyles.sectionIcon} size={20} />
              </div>
              <div>
                <h2 className={quizAdminStyles.sectionTitle}>Quiz (Optional)</h2>
                <p className={quizAdminStyles.sectionSubtitle}>Add 5–10 questions for a course quiz</p>
              </div>
            </div>

            {/* Enable toggle */}
            <div className={quizAdminStyles.toggleRow}>
              <span className={quizAdminStyles.toggleLabel}>Enable Quiz</span>
              <button
                type="button"
                onClick={() => setQuiz(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={quizAdminStyles.toggleButton(quiz.enabled)}
              >
                <span className={quizAdminStyles.toggleThumb(quiz.enabled)} />
              </button>
            </div>

            {quiz.enabled && (
              <>
                {/* Passing score */}
                <div className={quizAdminStyles.passingScoreRow}>
                  <span className={quizAdminStyles.passingScoreLabel}>Passing Score</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quiz.passingScore}
                    onChange={e => setQuiz(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                    className={quizAdminStyles.passingScoreInput}
                  />
                  <span className={quizAdminStyles.passingScoreUnit}>%</span>
                </div>

                {/* Existing questions */}
                {quiz.questions.length > 0 && (
                  <div className={quizAdminStyles.questionsList}>
                    {quiz.questions.map((q, idx) => (
                      <div key={q.id || idx} className={quizAdminStyles.questionCard}>
                        <div className={quizAdminStyles.questionHeader}>
                          <span className={quizAdminStyles.questionText}>Q{idx + 1}. {q.question}</span>
                          <button type="button" onClick={() => removeQuestion(idx)} className={quizAdminStyles.questionDeleteBtn}>
                            <X size={14} />
                          </button>
                        </div>
                        <div className={quizAdminStyles.questionOptions}>
                          {q.options.map((opt, oi) => (
                            <span key={oi} className={quizAdminStyles.questionOption(oi === q.correctIndex)}>
                              {String.fromCharCode(65 + oi)}. {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add question form */}
                {quiz.questions.length < 10 && (
                  <div className={quizAdminStyles.addQuestionForm}>
                    <p className={quizAdminStyles.addQuestionTitle}>Add Question ({quiz.questions.length}/10)</p>
                    <input
                      type="text"
                      placeholder="Question text *"
                      value={newQuestion.question}
                      onChange={e => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      className={quizAdminStyles.questionInput}
                    />
                    <div className={quizAdminStyles.optionsGrid}>
                      {newQuestion.options.map((opt, oi) => (
                        <div key={oi} className={quizAdminStyles.optionRow}>
                          <span className={quizAdminStyles.optionLabel}>{String.fromCharCode(65 + oi)}.</span>
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            value={opt}
                            onChange={e => {
                              const opts = [...newQuestion.options];
                              opts[oi] = e.target.value;
                              setNewQuestion(prev => ({ ...prev, options: opts }));
                            }}
                            className={quizAdminStyles.optionInput}
                          />
                        </div>
                      ))}
                    </div>
                    <div className={quizAdminStyles.correctAnswerRow}>
                      <span className={quizAdminStyles.correctAnswerLabel}>Correct Answer</span>
                      <select
                        value={newQuestion.correctIndex}
                        onChange={e => setNewQuestion(prev => ({ ...prev, correctIndex: Number(e.target.value) }))}
                        className={quizAdminStyles.correctAnswerSelect}
                      >
                        {['A', 'B', 'C', 'D'].map((l, i) => (
                          <option key={i} value={i}>Option {l}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={addQuestion} className={quizAdminStyles.addQuestionBtn}>
                      <Plus size={14} /> Add Question
                    </button>
                  </div>
                )}

                {quiz.questions.length < 5 && quiz.questions.length > 0 && (
                  <p className={quizAdminStyles.limitNote}>Add at least 5 questions to enable quiz on submit.</p>
                )}
              </>
            )}
          </div>

          {/* Submit */}
          <div className={addPageStyles.submitContainer}>
            <button
              type="submit"
              className={`${addPageStyles.submitButton} relative overflow-hidden group`}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading
                ? "Creating..."
                : `Create ${
                    formData.courseType === "top" ? "Top" : "Regular"
                  } Course`}
            </button>
          </div>
        </form>
                
             {/* for adding lectures */}  
             {showLectureForm && (
                <div className={addPageStyles.modalOverlay}>
                    <div className={addPageStyles.modal}>
                        <div className={addPageStyles.modalHeader}>
                            <div className={addPageStyles.modalIconContainer('bg-sky-300')}>
                                <Video className='text-white size={20}' />
                            </div>
                            <h3 className={addPageStyles.modalTitle}>Add new lecture</h3>
                        </div>
                        <div className={addPageStyles.modalContent}>
                            <div>
                                <label className={addPageStyles.inputLabel}>
                                    Lecture Title *
                                </label>
                                <input type="text" name='title' value={currentLecture.title} onChange={handleLectureChange} placeholder='ex: Introduction to MERN' className={addPageStyles.input} />

                            </div>

                                {currentLecture.chapters.length > 0 ? (
                                  <div>
                                    <label className={addPageStyles.inputLabel}>Duration (auto-calculated from chapters)</label>
                                    <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                                      {(() => {
                                        const totalMins = currentLecture.chapters.reduce((sum, ch) => sum + (Number(ch.duration?.hours) || 0) * 60 + (Number(ch.duration?.minutes) || 0), 0);
                                        return formatDuration(Math.floor(totalMins / 60), totalMins % 60);
                                      })()} — from {currentLecture.chapters.length} chapter{currentLecture.chapters.length !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                ) : (
                                <div>
                                    <label className={addPageStyles.inputLabel}>Duration *</label>
                                    <div className={addPageStyles.durationGrid}>
                                        <div>
                                            <input type="number" name='duration.hours' value={currentLecture.duration.hours} onChange={handleLectureChange} placeholder='Hours' min='0' className={addPageStyles.input} />
                                                <span className={addPageStyles.durationHelper}>Hours</span>                                       
                                        </div>

                                         <div>
                                            <input type="number" name='duration.minutes' value={currentLecture.duration.minutes} onChange={handleLectureChange} placeholder='Minutes' min='0' max='59' className={addPageStyles.input} />
                                                <span className={addPageStyles.durationHelper}>Minutes</span>                                       
                                        </div>

                                    </div>
                                </div>
                                )}


                                    {currentLecture.chapters.length > 0 && (
                                        <div>
                                            <label className={addPageStyles.inputLabel}>
                                                Chapters in this lecture
                                            </label>
                                            <div className={addPageStyles.chaptersList}>
                                                {currentLecture.chapters.map((chapter) => (
                                                    <div key={chapter.id} className={addPageStyles.chapterPreview}>
                                                            <div className={addPageStyles.chapterPreviewTitle}>{chapter.name}</div>

                                                            <div className={addPageStyles.chapterPreviewDuration}>
                                                                {formatDuration(chapter.duration)}
                                                            </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                        <div className={addPageStyles.modalActions}>
                                            <button type='button' onClick={() => openAddChapter()} className={`${addPageStyles.modalButton} ${addPageStyles.modalButtonPrimary}`}>
                                                <Plus size={14} /> Add Chapter
                                            </button>
                                        </div>
                                        <div className='flex gap-2 sm:gap-3 pt-2'>
                                            <button type='button' onClick={addLecture}
                                            className={`${addPageStyles.modalButton} ${addPageStyles.modalButtonPrimary}`}
                                            >
                                                Add lecture
                                            </button>
                                            <button type='button' onClick={() => setShowLectureForm(false)}
                                            className={`${addPageStyles.modalButton} ${addPageStyles.modalButtonSecondary}`}
                                            >
                                                Cancel
                                            </button>
                                        </div>


                        </div>
                    </div>
                </div>
             )}  

             
     {/* Chapter Modal */}
   {showChapterForm && (
          <div className={addPageStyles.modalOverlay}>
            <div className={addPageStyles.modal}>
              <div className={addPageStyles.modalHeader}>
                <div
                  className={addPageStyles.modalIconContainer("bg-green-100")}
                >
                  <Plus className="text-green-600" size={20} />
                </div>
                <h3 className={addPageStyles.modalTitle}>
                  {selectedLectureIndex !== null
                    ? "Add Chapter to Lecture"
                    : "Add Chapter to Current Lecture"}
                </h3>
              </div>
              <div className={addPageStyles.modalContent}>
                <div>
                  <label className={addPageStyles.inputLabel}>
                    Chapter Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentChapter.name}
                    onChange={handleChapterChange}
                    placeholder="e.g., Course Introduction"
                    className={addPageStyles.textarea}
                  />
                </div>

                <div>
                  <label className={addPageStyles.inputLabel}>Topic *</label>
                  <input
                    type="text"
                    name="topic"
                    value={currentChapter.topic}
                    onChange={handleChapterChange}
                    placeholder="e.g., What we'll build"
                    className={addPageStyles.textarea}
                  />
                </div>

                <div>
                  <label className={addPageStyles.inputLabel}>Duration *</label>
                  <div className={addPageStyles.durationGrid}>
                    <div>
                      <input
                        type="number"
                        name="duration.hours"
                        value={currentChapter.duration.hours}
                        onChange={handleChapterChange}
                        placeholder="Hours"
                        min="0"
                        className={addPageStyles.textarea}
                      />
                      <span className={addPageStyles.durationHelper}>
                        Hours
                      </span>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="duration.minutes"
                        value={currentChapter.duration.minutes}
                        onChange={handleChapterChange}
                        placeholder="Minutes"
                        min="0"
                        max="59"
                        className={addPageStyles.textarea}
                      />
                      <span className={addPageStyles.durationHelper}>
                        Minutes
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={addPageStyles.inputLabel}>
                    Video URL *
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={currentChapter.videoUrl}
                    onChange={handleChapterChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className={addPageStyles.textarea}
                  />
                </div>

                <div className={addPageStyles.modalActions}>
                  <button
                    type="button"
                    onClick={addChapter}
                    className={`${addPageStyles.modalButtonCompact} ${addPageStyles.modalButtonCompactPrimary}`}
                  >
                    Add Chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChapterForm(false);
                      setSelectedLectureIndex(null);
                    }}
                    className={`${addPageStyles.modalButtonCompact} ${addPageStyles.modalButtonCompactSecondary}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} 

     </div>
    </div>
  )
}

export default AddPage