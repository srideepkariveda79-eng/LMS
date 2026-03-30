import React, { useEffect, useState } from 'react'
import { addPageStyles } from '../assets/dummyStyles'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'
import {
  BookOpenText, ChevronDown, ChevronUp, Clock, Image as ImageIcon,
  ListOrdered, PenLine, Plus, Star, Upload, UserPen, Video, X, Award, Trash2
} from 'lucide-react'

const API_BASE = 'http://localhost:4000'

const formatDuration = (a, b) => {
  let hours = 0, minutes = 0
  if (typeof a === 'object' && a !== null) { hours = Number(a.hours) || 0; minutes = Number(a.minutes) || 0 }
  else { hours = Number(a) || 0; minutes = Number(b) || 0 }
  const total = Math.max(0, Math.floor(hours * 60 + minutes))
  const h = Math.floor(total / 60), m = total % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

const computeCourseTotals = (lectures = []) => {
  const cloned = (Array.isArray(lectures) ? lectures : []).map((lecture) => {
    const lec = { ...lecture, duration: { hours: Number(lecture?.duration?.hours) || 0, minutes: Number(lecture?.duration?.minutes) || 0 }, chapters: Array.isArray(lecture?.chapters) ? [...lecture.chapters] : [] }
    let chaptersMinutes = 0
    lec.chapters = lec.chapters.map((ch) => {
      const chH = Number(ch?.duration?.hours) || 0, chM = Number(ch?.duration?.minutes) || 0
      const chTotal = Math.max(0, chH * 60 + chM)
      chaptersMinutes += chTotal
      return { ...ch, duration: { hours: chH, minutes: chM }, totalMinutes: chTotal }
    })
    const lecTotal = lec.chapters.length > 0 ? chaptersMinutes : Math.max(0, lec.duration.hours * 60 + lec.duration.minutes)
    return { ...lec, totalMinutes: lecTotal, duration: { hours: Math.floor(lecTotal / 60), minutes: lecTotal % 60 } }
  })
  const courseTotalMinutes = cloned.reduce((s, l) => s + (Number(l.totalMinutes) || 0), 0)
  return { lectures: cloned, totalLectures: cloned.length, totalDuration: { hours: Math.floor(courseTotalMinutes / 60), minutes: courseTotalMinutes % 60 } }
}

const EditCoursePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [formData, setFormData] = useState({
    name: '', teacher: '', image: null, existingImage: '', level: 'beginner',
    overview: '', courseType: 'regular', lectures: [], totalDuration: { hours: 0, minutes: 0 }, totalLectures: 0,
  })

  const [currentLecture, setCurrentLecture] = useState({ title: '', duration: { hours: '', minutes: '' }, chapters: [] })
  const [currentChapter, setCurrentChapter] = useState({ name: '', topic: '', duration: { hours: '', minutes: '' }, videoUrl: '' })
  const [showLectureForm, setShowLectureForm] = useState(false)
  const [showChapterForm, setShowChapterForm] = useState(false)
  const [expandedLectures, setExpandedLectures] = useState([])
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null)

  // editing an existing chapter inline
  const [editingChapter, setEditingChapter] = useState(null) // { lectureIndex, chapterIndex }
  const [editChapterData, setEditChapterData] = useState({ name: '', topic: '', duration: { hours: '', minutes: '' }, videoUrl: '' })

  // Load existing course
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/course/${id}`)
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Failed to load')
        const c = data.course
        const computed = computeCourseTotals(c.lectures || [])
        setFormData({
          name: c.name || '',
          teacher: c.teacher || '',
          image: null,
          existingImage: c.image || '',
          level: c.level || 'beginner',
          overview: c.overview || '',
          courseType: c.courseType || 'regular',
          lectures: computed.lectures,
          totalDuration: computed.totalDuration,
          totalLectures: computed.totalLectures,
        })
        setExpandedLectures([])
      } catch (err) {
        toast.error(err.message || 'Failed to load course')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please upload a valid image file'); return }
    const reader = new FileReader()
    reader.onload = (ev) => { setFormData(prev => ({ ...prev, image: { file, preview: ev.target.result } })); toast.success('Image updated!') }
    reader.readAsDataURL(file)
  }

  const toggleLecture = (index) =>
    setExpandedLectures(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])

  const handleLectureChange = (e) => {
    const { name, value } = e.target
    if (name.includes('duration.')) {
      const f = name.split('.')[1]
      setCurrentLecture(prev => ({ ...prev, duration: { ...prev.duration, [f]: value } }))
    } else {
      setCurrentLecture(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleChapterChange = (e) => {
    const { name, value } = e.target
    if (name.includes('duration.')) {
      const f = name.split('.')[1]
      setCurrentChapter(prev => ({ ...prev, duration: { ...prev.duration, [f]: value } }))
    } else {
      setCurrentChapter(prev => ({ ...prev, [name]: value }))
    }
  }

  const addLecture = () => {
    if (!currentLecture.title?.trim()) { toast.error('Please enter lecture title'); return }
    const hasChapters = currentLecture.chapters?.length > 0
    if (!hasChapters && !currentLecture.duration.hours && !currentLecture.duration.minutes) {
      toast.error('Please enter lecture duration or add chapters'); return
    }
    const lecture = {
      id: `lecture-${Date.now()}`,
      title: currentLecture.title.trim(),
      duration: { hours: Number(currentLecture.duration.hours) || 0, minutes: Number(currentLecture.duration.minutes) || 0 },
      chapters: (currentLecture.chapters || []).map(ch => ({ ...ch })),
    }
    const newLectures = [...formData.lectures, lecture]
    const computed = computeCourseTotals(newLectures)
    setFormData(prev => ({ ...prev, lectures: computed.lectures, totalDuration: computed.totalDuration, totalLectures: computed.totalLectures }))
    setCurrentLecture({ title: '', duration: { hours: '', minutes: '' }, chapters: [] })
    setShowLectureForm(false)
    setExpandedLectures(prev => [...prev, formData.lectures.length])
    toast.success('Lecture added!')
  }

  const addChapter = () => {
    if (!currentChapter.name?.trim()) { toast.error('Please enter chapter name'); return }
    if (!currentChapter.topic?.trim()) { toast.error('Please enter chapter topic'); return }
    if (!currentChapter.duration.hours && !currentChapter.duration.minutes) { toast.error('Please enter chapter duration'); return }
    if (!currentChapter.videoUrl?.trim()) { toast.error('Please enter video URL'); return }
    const chapter = {
      id: `chapter-${Date.now()}`,
      name: currentChapter.name.trim(), topic: currentChapter.topic.trim(),
      duration: { hours: Number(currentChapter.duration.hours) || 0, minutes: Number(currentChapter.duration.minutes) || 0 },
      totalMinutes: (Number(currentChapter.duration.hours) || 0) * 60 + (Number(currentChapter.duration.minutes) || 0),
      videoUrl: currentChapter.videoUrl.trim(),
    }
    let newLectures = [...formData.lectures]
    if (selectedLectureIndex !== null) {
      newLectures[selectedLectureIndex] = { ...newLectures[selectedLectureIndex], chapters: [...(newLectures[selectedLectureIndex].chapters || []), chapter] }
      const computed = computeCourseTotals(newLectures)
      setFormData(prev => ({ ...prev, lectures: computed.lectures, totalDuration: computed.totalDuration, totalLectures: computed.totalLectures }))
      toast.success('Chapter added!')
    } else {
      setCurrentLecture(prev => ({ ...prev, chapters: [...(prev.chapters || []), chapter] }))
      toast.success('Chapter added to lecture draft!')
    }
    setCurrentChapter({ name: '', topic: '', duration: { hours: '', minutes: '' }, videoUrl: '' })
    setShowChapterForm(false)
    setSelectedLectureIndex(null)
  }

  const removeLecture = (index) => {
    const updated = formData.lectures.filter((_, i) => i !== index)
    const computed = computeCourseTotals(updated)
    setFormData(prev => ({ ...prev, lectures: computed.lectures, totalDuration: computed.totalDuration, totalLectures: computed.totalLectures }))
    setExpandedLectures(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i))
    toast.success('Lecture removed')
  }

  const removeChapter = (lectureIndex, chapterIndex) => {
    const updated = formData.lectures.map((lec, li) => {
      if (li !== lectureIndex) return lec
      return { ...lec, chapters: (lec.chapters || []).filter((_, ci) => ci !== chapterIndex) }
    })
    const computed = computeCourseTotals(updated)
    setFormData(prev => ({ ...prev, lectures: computed.lectures, totalDuration: computed.totalDuration, totalLectures: computed.totalLectures }))
    toast.success('Chapter removed')
  }

  const startEditChapter = (lectureIndex, chapterIndex) => {
    const ch = formData.lectures[lectureIndex].chapters[chapterIndex]
    setEditingChapter({ lectureIndex, chapterIndex })
    setEditChapterData({ name: ch.name, topic: ch.topic, duration: { hours: ch.duration?.hours ?? 0, minutes: ch.duration?.minutes ?? 0 }, videoUrl: ch.videoUrl || '' })
  }

  const saveEditChapter = () => {
    const { lectureIndex, chapterIndex } = editingChapter
    if (!editChapterData.name?.trim()) { toast.error('Chapter name required'); return }
    if (!editChapterData.videoUrl?.trim()) { toast.error('Video URL required'); return }
    const updated = formData.lectures.map((lec, li) => {
      if (li !== lectureIndex) return lec
      const chapters = lec.chapters.map((ch, ci) => {
        if (ci !== chapterIndex) return ch
        return {
          ...ch, name: editChapterData.name.trim(), topic: editChapterData.topic.trim(),
          duration: { hours: Number(editChapterData.duration.hours) || 0, minutes: Number(editChapterData.duration.minutes) || 0 },
          totalMinutes: (Number(editChapterData.duration.hours) || 0) * 60 + (Number(editChapterData.duration.minutes) || 0),
          videoUrl: editChapterData.videoUrl.trim(),
        }
      })
      return { ...lec, chapters }
    })
    const computed = computeCourseTotals(updated)
    setFormData(prev => ({ ...prev, lectures: computed.lectures, totalDuration: computed.totalDuration, totalLectures: computed.totalLectures }))
    setEditingChapter(null)
    toast.success('Chapter updated!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name?.trim()) { toast.error('Course name required'); return }
    if (!formData.teacher?.trim()) { toast.error('Instructor name required'); return }
    if (formData.lectures.length === 0) { toast.error('Add at least one lecture'); return }

    setLoading(true)
    try {
      const computed = computeCourseTotals(formData.lectures)
      const fd = new FormData()
      fd.append('name', formData.name)
      fd.append('teacher', formData.teacher)
      fd.append('level', formData.level)
      fd.append('overview', formData.overview)
      fd.append('courseType', formData.courseType)
      fd.append('lectures', JSON.stringify(computed.lectures))
      fd.append('totalDuration', JSON.stringify(computed.totalDuration))
      fd.append('totalLectures', String(computed.totalLectures))
      if (formData.image?.file) fd.append('image', formData.image.file)

      const res = await fetch(`${API_BASE}/api/course/${id}`, { method: 'PUT', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) { toast.error(data.message || 'Failed to update course'); return }
      toast.success('Course updated successfully!')
      setTimeout(() => navigate('/listcourse'), 1200)
    } catch (err) {
      toast.error('Server error while updating course')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-10 text-center text-gray-500">Loading course...</div>

  return (
    <div className={addPageStyles.pageContainer}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className={addPageStyles.contentContainer}>
        <div className={addPageStyles.headerContainer}>
          <div className={addPageStyles.headerGradient}>
            <div className={addPageStyles.headerGlow} />
            <h1 className={addPageStyles.headerTitle}>Edit Course</h1>
          </div>
          <p className={addPageStyles.headerSubtitle}>Update course content, lectures and chapters</p>
        </div>

        <form onSubmit={handleSubmit} className={addPageStyles.form}>
          {/* Basic Info */}
          <div className={`${addPageStyles.card} ${addPageStyles.courseInfoCard}`}>
            <div className={addPageStyles.cardHeader}>
              <div className={addPageStyles.cardIconContainer}><BookOpenText className={addPageStyles.cardIcon} size={20} /></div>
              <div><h2 className={addPageStyles.cardTitle}>Course Information</h2></div>
            </div>
            <div className={addPageStyles.formGrid}>
              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}><PenLine size={16} className={addPageStyles.inputIcon} /> Course Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={addPageStyles.input} required />
              </div>
              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}><UserPen size={16} className={addPageStyles.inputIcon} /> Instructor Name *</label>
                <input type="text" name="teacher" value={formData.teacher} onChange={handleInputChange} className={addPageStyles.input} required />
              </div>
              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}><Award size={16} className={addPageStyles.inputIcon} /> Level</label>
                <select name="level" value={formData.level} onChange={handleInputChange} className={addPageStyles.select}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className={addPageStyles.inputContainer}>
                <label className={addPageStyles.inputLabel}><BookOpenText size={16} className={addPageStyles.inputIcon} /> Course Type</label>
                <select name="courseType" value={formData.courseType} onChange={handleInputChange} className={addPageStyles.select}>
                  <option value="regular">Regular</option>
                  <option value="top">Top Course</option>
                </select>
              </div>
              <div className={addPageStyles.formFullWidth}>
                <label className={addPageStyles.inputLabel}><ImageIcon size={16} className={addPageStyles.inputIcon} /> Course Image</label>
                <div className={addPageStyles.uploadContainer}>
                  <label className={addPageStyles.uploadLabel}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className={addPageStyles.uploadInput} />
                    <div className={addPageStyles.uploadBox}>
                      <Upload size={18} className={addPageStyles.uploadIcon} />
                      <span className="font-medium">{formData.image ? 'Change Image' : 'Upload New Image'}</span>
                    </div>
                  </label>
                  {(formData.image?.preview || formData.existingImage) && (
                    <div className={addPageStyles.imagePreview}>
                      <img src={formData.image?.preview || formData.existingImage} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
              <div className={addPageStyles.formFullWidth}>
                <label className={addPageStyles.inputLabel}><BookOpenText size={16} className={addPageStyles.inputIcon} /> Course Overview</label>
                <textarea name="overview" value={formData.overview} onChange={handleInputChange} rows="4" className={addPageStyles.textarea} />
              </div>
            </div>
          </div>

          {/* Lectures */}
          <div className={`${addPageStyles.card} ${addPageStyles.lecturesCard}`}>
            <div className={addPageStyles.lecturesHeader}>
              <div className="flex items-center gap-3">
                <div className={addPageStyles.cardIconContainer}><Video className={addPageStyles.cardIcon} size={20} /></div>
                <div>
                  <h2 className={addPageStyles.cardTitle}>Course Content</h2>
                  <p className={addPageStyles.cardSubtitle}>{formData.lectures.length} lectures · {formatDuration(formData.totalDuration)}</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowLectureForm(true)} className={addPageStyles.addLectureButton}>
                <Plus size={16} /> Add Lecture
              </button>
            </div>

            {/* Add lecture form */}
            {showLectureForm && (
              <div className={addPageStyles.lectureForm}>
                <div className={addPageStyles.lectureFormHeader}>
                  <h3 className={addPageStyles.lectureFormTitle}>New Lecture</h3>
                  <button type="button" onClick={() => setShowLectureForm(false)} className={addPageStyles.closeButton}><X size={16} /></button>
                </div>
                <div className={addPageStyles.formGrid}>
                  <div className={addPageStyles.inputContainer}>
                    <label className={addPageStyles.inputLabel}>Lecture Title *</label>
                    <input type="text" name="title" value={currentLecture.title} onChange={handleLectureChange} className={addPageStyles.input} placeholder="e.g., Introduction" />
                  </div>
                  <div className={addPageStyles.inputContainer}>
                    <label className={addPageStyles.inputLabel}><Clock size={14} className={addPageStyles.inputIcon} /> Duration (if no chapters)</label>
                    <div className={addPageStyles.durationGrid}>
                      <input type="number" name="duration.hours" value={currentLecture.duration.hours} onChange={handleLectureChange} placeholder="Hours" min="0" className={addPageStyles.input} />
                      <input type="number" name="duration.minutes" value={currentLecture.duration.minutes} onChange={handleLectureChange} placeholder="Minutes" min="0" max="59" className={addPageStyles.input} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <button type="button" onClick={addLecture} className={addPageStyles.saveLectureButton}>Save Lecture</button>
                </div>
              </div>
            )}

            {/* Lectures list */}
            <div className={addPageStyles.lecturesList}>
              {formData.lectures.map((lecture, li) => (
                <div key={lecture.id || lecture._id || li} className={addPageStyles.lectureItem}>
                  <div className={addPageStyles.lectureItemHeader}>
                    <button type="button" onClick={() => toggleLecture(li)} className={addPageStyles.lectureToggle}>
                      {expandedLectures.includes(li) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span className={addPageStyles.lectureItemTitle}>{lecture.title}</span>
                      <span className={addPageStyles.lectureItemMeta}>{(lecture.chapters || []).length} chapters · {formatDuration(lecture.duration)}</span>
                    </button>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setSelectedLectureIndex(li); setShowChapterForm(true); if (!expandedLectures.includes(li)) toggleLecture(li) }}
                        className={addPageStyles.addChapterButton} title="Add chapter">
                        <Plus size={14} /> Chapter
                      </button>
                      <button type="button" onClick={() => removeLecture(li)} className={addPageStyles.removeLectureButton} title="Remove lecture">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {expandedLectures.includes(li) && (
                    <div className={addPageStyles.chaptersContainer(true)}>
                      {/* Add chapter form */}
                      {showChapterForm && selectedLectureIndex === li && (
                        <div className={addPageStyles.chapterForm}>
                          <div className={addPageStyles.lectureFormHeader}>
                            <h4 className={addPageStyles.lectureFormTitle}>New Chapter</h4>
                            <button type="button" onClick={() => { setShowChapterForm(false); setSelectedLectureIndex(null) }} className={addPageStyles.closeButton}><X size={14} /></button>
                          </div>
                          <div className={addPageStyles.formGrid}>
                            <div className={addPageStyles.inputContainer}>
                              <label className={addPageStyles.inputLabel}>Chapter Name *</label>
                              <input type="text" name="name" value={currentChapter.name} onChange={handleChapterChange} className={addPageStyles.input} placeholder="e.g., Variables" />
                            </div>
                            <div className={addPageStyles.inputContainer}>
                              <label className={addPageStyles.inputLabel}>Topic</label>
                              <input type="text" name="topic" value={currentChapter.topic} onChange={handleChapterChange} className={addPageStyles.input} placeholder="e.g., Data Types" />
                            </div>
                            <div className={addPageStyles.inputContainer}>
                              <label className={addPageStyles.inputLabel}><Clock size={14} className={addPageStyles.inputIcon} /> Duration *</label>
                              <div className={addPageStyles.durationGrid}>
                                <input type="number" name="duration.hours" value={currentChapter.duration.hours} onChange={handleChapterChange} placeholder="Hours" min="0" className={addPageStyles.input} />
                                <input type="number" name="duration.minutes" value={currentChapter.duration.minutes} onChange={handleChapterChange} placeholder="Minutes" min="0" max="59" className={addPageStyles.input} />
                              </div>
                            </div>
                            <div className={addPageStyles.inputContainer}>
                              <label className={addPageStyles.inputLabel}><Video size={14} className={addPageStyles.inputIcon} /> Video URL *</label>
                              <input type="text" name="videoUrl" value={currentChapter.videoUrl} onChange={handleChapterChange} className={addPageStyles.input} placeholder="YouTube / Drive / SharePoint URL" />
                            </div>
                          </div>
                          <button type="button" onClick={addChapter} className={addPageStyles.saveLectureButton}>Add Chapter</button>
                        </div>
                      )}

                      {/* Chapters list */}
                      {(lecture.chapters || []).map((ch, ci) => (
                        <div key={ch.id || ch._id || ci} className={addPageStyles.chapterItem}>
                          {editingChapter?.lectureIndex === li && editingChapter?.chapterIndex === ci ? (
                            <div className="w-full space-y-2 p-2">
                              <div className={addPageStyles.formGrid}>
                                <div className={addPageStyles.inputContainer}>
                                  <label className={addPageStyles.inputLabel}>Name *</label>
                                  <input type="text" value={editChapterData.name} onChange={e => setEditChapterData(p => ({ ...p, name: e.target.value }))} className={addPageStyles.input} />
                                </div>
                                <div className={addPageStyles.inputContainer}>
                                  <label className={addPageStyles.inputLabel}>Topic</label>
                                  <input type="text" value={editChapterData.topic} onChange={e => setEditChapterData(p => ({ ...p, topic: e.target.value }))} className={addPageStyles.input} />
                                </div>
                                <div className={addPageStyles.inputContainer}>
                                  <label className={addPageStyles.inputLabel}>Duration</label>
                                  <div className={addPageStyles.durationGrid}>
                                    <input type="number" value={editChapterData.duration.hours} onChange={e => setEditChapterData(p => ({ ...p, duration: { ...p.duration, hours: e.target.value } }))} placeholder="Hours" min="0" className={addPageStyles.input} />
                                    <input type="number" value={editChapterData.duration.minutes} onChange={e => setEditChapterData(p => ({ ...p, duration: { ...p.duration, minutes: e.target.value } }))} placeholder="Minutes" min="0" max="59" className={addPageStyles.input} />
                                  </div>
                                </div>
                                <div className={addPageStyles.inputContainer}>
                                  <label className={addPageStyles.inputLabel}>Video URL *</label>
                                  <input type="text" value={editChapterData.videoUrl} onChange={e => setEditChapterData(p => ({ ...p, videoUrl: e.target.value }))} className={addPageStyles.input} />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={saveEditChapter} className={addPageStyles.saveLectureButton}>Save</button>
                                <button type="button" onClick={() => setEditingChapter(null)} className={addPageStyles.closeButton}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className={addPageStyles.chapterInfo}>
                                <span className={addPageStyles.chapterName}>{ch.name}</span>
                                <span className={addPageStyles.chapterTopic}>{ch.topic}</span>
                                <span className={addPageStyles.chapterDuration}><Clock size={12} /> {formatDuration(ch.duration)}</span>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button type="button" onClick={() => startEditChapter(li, ci)} className={addPageStyles.addChapterButton} title="Edit chapter">Edit</button>
                                <button type="button" onClick={() => removeChapter(li, ci)} className={addPageStyles.removeChapterButton} title="Delete chapter"><Trash2 size={14} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {(lecture.chapters || []).length === 0 && (
                        <p className="text-xs text-gray-400 px-3 py-2">No chapters yet. Click "+ Chapter" to add one.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {formData.lectures.length === 0 && (
                <p className={addPageStyles.emptyLectures}>No lectures yet. Click "Add Lecture" to get started.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => navigate('/listcourse')} className="px-6 py-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className={addPageStyles.submitButton}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCoursePage
