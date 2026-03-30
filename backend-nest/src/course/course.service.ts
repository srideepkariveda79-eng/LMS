import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Course, CourseDocument, QuizQuestion } from '../schemas/course.schema'
import { CloudinaryService } from '../common/cloudinary.service'
import { RedisService } from '../common/redis.service'

const toNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === 'number') return v
  if (typeof v === 'string' && v.trim() === '') return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const parseJSONSafe = (maybe: unknown): any => {
  if (!maybe) return null
  if (typeof maybe === 'object') return maybe
  try { return JSON.parse(maybe as string) } catch { return null }
}

const makeImageAbsolute = (rawImage: string, _protocol: string, _host: string): string => {
  if (!rawImage) return ''
  // Cloudinary URLs are already absolute https://...
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) return rawImage
  // Legacy local path fallback
  return rawImage
}

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private redis: RedisService,
    private cloudinary: CloudinaryService,
  ) {}

  private async invalidateCourseCache(id?: string) {
    await this.redis.delPattern('public_courses:*')
    await this.redis.delPattern('all_courses:*')
    if (id) await this.redis.delPattern(`course:${id}:*`)
  }
  async getPublicCourses(home: string, type: string, limit: string, protocol: string, host: string) {
    const cacheKey = `public_courses:${home}:${type}:${limit}:${host}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return cached

    const filter: any = {}
    if (home === 'true' || type === 'top') filter.courseType = 'top'
    else if (type === 'regular') filter.courseType = 'regular'
    let query = this.courseModel.find(filter).sort({ createdAt: -1 })
    if (home === 'true') query = query.limit(Number(limit || 8))
    else if (limit) query = query.limit(Number(limit))
    const courses = await query
    const result = { success: true, items: courses.map(c => ({ ...c.toObject(), id: c._id, image: makeImageAbsolute(c.image || '', protocol, host) })) }
    await this.redis.set(cacheKey, result, 300) // 5 min cache
    return result
  }

  async getCourses(protocol: string, host: string) {
    const cacheKey = `all_courses:${host}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return cached

    const courses = await this.courseModel.find().sort({ createdAt: -1 })
    const result = { success: true, courses: courses.map(c => ({ ...c.toObject(), id: c._id, image: makeImageAbsolute(c.image || '', protocol, host) })) }
    await this.redis.set(cacheKey, result, 300)
    return result
  }

  async getCourseById(id: string, protocol: string, host: string) {
    const cacheKey = `course:${id}:${host}`
    const cached = await this.redis.get(cacheKey)
    if (cached) return cached

    const course = await this.courseModel.findById(id)
    if (!course) throw new NotFoundException('Not found')
    const result = { success: true, course: { ...course.toObject(), id: course._id, image: makeImageAbsolute(course.image || '', protocol, host) } }
    await this.redis.set(cacheKey, result, 300)
    return result
  }

  async createCourse(body: any, file: Express.Multer.File | undefined, protocol: string, host: string) {
    // Upload image to Cloudinary if provided
    let imagePath: string | null = body.image || null
    if (file) imagePath = await this.cloudinary.uploadImage(file)
    let lectures = parseJSONSafe(body.lectures) ?? body.lectures ?? []
    if (!Array.isArray(lectures)) lectures = []

    lectures = lectures.map((lec: any) => {
      const lecture = { ...lec }
      lecture.duration = lecture.duration || {}
      lecture.duration.hours = toNumber(lecture.duration.hours)
      lecture.duration.minutes = toNumber(lecture.duration.minutes)
      lecture.chapters = (Array.isArray(lecture.chapters) ? lecture.chapters : []).map((ch: any) => ({
        ...ch,
        duration: { hours: toNumber(ch.duration?.hours), minutes: toNumber(ch.duration?.minutes) },
        totalMinutes: toNumber(ch.totalMinutes, 0),
        videoUrl: ch.videoUrl || '', name: ch.name || '', topic: ch.topic || '',
      }))
      return { ...lecture, title: lecture.title || 'Untitled lecture', totalMinutes: toNumber(lecture.totalMinutes, 0) }
    })

    let quiz = { enabled: false, passingScore: 70, questions: [] as QuizQuestion[] }
    const rawQuiz = parseJSONSafe(body.quiz)
    if (rawQuiz?.enabled) {
      const questions = (Array.isArray(rawQuiz.questions) ? rawQuiz.questions : [])
        .map((q: any) => ({ question: String(q.question || ''), options: Array.isArray(q.options) ? q.options.map(String) : ['', '', '', ''], correctIndex: toNumber(q.correctIndex, 0) }))
        .filter((q: any) => q.question.trim())
      quiz = { enabled: true, passingScore: toNumber(rawQuiz.passingScore, 70), questions }
    }

    const course = new this.courseModel({
      name: body.name || '', teacher: body.teacher || '', image: imagePath,
      level: body.level || 'beginner', overview: body.overview || body.description || null,
      totalDuration: parseJSONSafe(body.totalDuration) ?? { hours: toNumber(body['totalDuration.hours']), minutes: toNumber(body['totalDuration.minutes']) },
      totalLectures: toNumber(body.totalLectures, lectures.length),
      lectures, courseType: body.courseType || 'regular', quiz,
    })
    await course.save()
    await this.invalidateCourseCache()
    return { success: true, course: { ...course.toObject(), id: course._id, image: makeImageAbsolute(course.image || '', protocol, host) } }
  }

  async updateCourse(id: string, body: any, file: Express.Multer.File | undefined, protocol: string, host: string) {
    const course = await this.courseModel.findById(id)
    if (!course) throw new NotFoundException('Course not found')

    if (file) {
      try {
        if (course.image) await this.cloudinary.deleteImage(course.image)
      } catch { /* ignore */ }
      course.image = await this.cloudinary.uploadImage(file)
    }

    if (body.name) course.name = body.name
    if (body.teacher) course.teacher = body.teacher
    if (body.level) course.level = body.level
    if (body.overview !== undefined) course.overview = body.overview
    if (body.courseType) course.courseType = body.courseType

    const rawLectures = parseJSONSafe(body.lectures)
    if (Array.isArray(rawLectures)) {
      course.lectures = rawLectures.map((lec: any) => {
        const lecture = { ...lec }
        lecture.duration = lecture.duration || {}
        lecture.duration.hours = toNumber(lecture.duration.hours)
        lecture.duration.minutes = toNumber(lecture.duration.minutes)
        lecture.chapters = (Array.isArray(lecture.chapters) ? lecture.chapters : []).map((ch: any) => ({
          ...ch, duration: { hours: toNumber(ch.duration?.hours), minutes: toNumber(ch.duration?.minutes) },
          totalMinutes: toNumber(ch.totalMinutes, 0), videoUrl: ch.videoUrl || '', name: ch.name || '', topic: ch.topic || '',
        }))
        return { ...lecture, title: lecture.title || 'Untitled lecture', totalMinutes: toNumber(lecture.totalMinutes, 0) }
      })
    }

    await course.save()
    await this.invalidateCourseCache(id)
    return { success: true, course: { ...course.toObject(), id: course._id, image: makeImageAbsolute(course.image || '', protocol, host) } }
  }

  async deleteCourse(id: string) {
    const course = await this.courseModel.findById(id)
    if (!course) throw new NotFoundException('Not found')
    try {
      if (course.image) await this.cloudinary.deleteImage(course.image)
    } catch { /* ignore */ }
    await course.deleteOne()
    await this.invalidateCourseCache(id)
    return { success: true, message: 'Course deleted' }
  }

  async rateCourse(courseId: string, userId: string, rating: number, comment: string) {
    const course = await this.courseModel.findById(courseId)
    if (!course) throw new NotFoundException('Course not found')

    const ratings = course.ratings || []
    const idx = ratings.findIndex(r => r.userId === userId)
    if (idx >= 0) {
      ratings[idx].rating = rating
      if (comment?.trim()) ratings[idx].comment = comment.trim()
      ratings[idx].updatedAt = new Date()
    } else {
      ratings.push({ userId, rating, comment: comment?.trim() || '', updatedAt: null })
    }

    course.ratings = ratings
    const total = ratings.length
    const sum = ratings.reduce((s, r) => s + (Number(r.rating) || 0), 0)
    course.totalRatings = total
    course.avgRating = total === 0 ? 0 : Number((sum / total).toFixed(2))
    await course.save()
    await this.invalidateCourseCache(courseId)
    return { success: true, avgRating: course.avgRating, totalRatings: course.totalRatings, myRating: { userId, rating } }
  }

  async getMyRating(courseId: string, userId: string) {
    const course = await this.courseModel.findById(courseId)
    if (!course) throw new NotFoundException('Course not found')
    const my = (course.ratings || []).find(r => r.userId === userId) || null
    return { success: true, myRating: my ? { rating: my.rating, comment: my.comment } : null }
  }

  async updateCourseQuiz(id: string, quiz: any) {
    if (!quiz) throw new NotFoundException('quiz payload required')
    const course = await this.courseModel.findById(id)
    if (!course) throw new NotFoundException('Course not found')
    const questions = (Array.isArray(quiz.questions) ? quiz.questions : [])
      .map((q: any) => ({ question: String(q.question || ''), options: Array.isArray(q.options) ? q.options.map(String) : ['', '', '', ''], correctIndex: toNumber(q.correctIndex, 0) }))
      .filter((q: any) => q.question.trim())
    course.quiz = { enabled: !!quiz.enabled, passingScore: toNumber(quiz.passingScore, 70), questions }
    await course.save()
    await this.invalidateCourseCache(id)
    return { success: true, quiz: course.quiz }
  }
}
