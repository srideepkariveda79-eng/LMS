import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Course, CourseDocument } from '../schemas/course.schema'
import { QuizResult, QuizResultDocument } from '../schemas/quiz-result.schema'
import { Booking, BookingDocument } from '../schemas/booking.schema'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(QuizResult.name) private quizResultModel: Model<QuizResultDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  private async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const booking = await this.bookingModel.findOne({ clerkUserId: userId, course: courseId })
    return !!booking && booking.orderStatus === 'Confirmed'
  }

  async getQuiz(courseId: string, userId: string) {
    const course = await this.courseModel.findById(courseId)
    if (!course) throw new NotFoundException('Course not found')
    if (!course.quiz?.enabled) return { success: true, quizEnabled: false }

    const enrolled = await this.isEnrolled(userId, courseId)
    if (!enrolled) throw new ForbiddenException('Enrollment required to access quiz')

    const questions = (course.quiz.questions || []).map((q, i) => ({
      id: i, question: q.question, options: q.options,
    }))
    return { success: true, quizEnabled: true, passingScore: course.quiz.passingScore ?? 70, questions }
  }

  async submitQuiz(courseId: string, userId: string, answers: number[]) {
    const course = await this.courseModel.findById(courseId)
    if (!course) throw new NotFoundException('Course not found')
    if (!course.quiz?.enabled) throw new BadRequestException('Quiz not enabled for this course')

    const enrolled = await this.isEnrolled(userId, courseId)
    if (!enrolled) throw new ForbiddenException('Enrollment required')

    const questions = course.quiz.questions || []
    if (!Array.isArray(answers) || answers.length !== questions.length)
      throw new BadRequestException('Invalid answers — must match number of questions')

    let correct = 0
    questions.forEach((q, i) => { if (Number(answers[i]) === Number(q.correctIndex)) correct++ })

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    const passingScore = course.quiz.passingScore ?? 70
    const passed = score >= passingScore
    const certificateId = passed ? `CERT-${uuidv4().slice(0, 8).toUpperCase()}` : null

    const result = await this.quizResultModel.findOneAndUpdate(
      { userId, courseId },
      { score, passed, answers, certificateId, attemptedAt: new Date() },
      { upsert: true, new: true },
    )
    return { success: true, score, passed, passingScore, correct, total: questions.length, certificateId }
  }

  async getQuizResult(courseId: string, userId: string) {
    const result = await this.quizResultModel.findOne({ userId, courseId })
    return { success: true, result: result || null }
  }

  async getUserResults(userId: string) {
    const results = await this.quizResultModel.find({ userId }).sort({ attemptedAt: -1 })
    return { success: true, results }
  }
}
