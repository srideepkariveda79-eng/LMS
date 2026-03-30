import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Booking, BookingDocument } from '../schemas/booking.schema'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class BookingService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  private genBookingId() { return `BK-${uuidv4()}` }

  async getBookings(search: string, limitRaw: string, pageRaw: string) {
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50))
    const page = Math.max(1, parseInt(pageRaw, 10) || 1)
    const skip = (page - 1) * limit

    const filter: any = {}
    if (search) {
      const re = new RegExp(search, 'i')
      filter.$or = [{ bookingId: re }, { courseName: re }, { teacherName: re }, { studentName: re }]
    }

    const items = await this.bookingModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
    return { success: true, bookings: items, meta: { page, limit, count: items.length } }
  }

  async checkBooking(userId: string | undefined, courseId: string) {
    if (!userId) return { success: true, enrolled: false, booking: null }
    if (!courseId) throw new BadRequestException('courseId required')
    const booking = await this.bookingModel.findOne({ course: courseId, clerkUserId: userId }).sort({ createdAt: -1 })
    return { success: true, enrolled: !!booking && booking.orderStatus === 'Confirmed', booking }
  }

  async createBooking(userId: string, body: any) {
    if (!userId) throw new UnauthorizedException('Authentication required')
    const { courseId, courseName, teacherName = '', notes = '', studentName, email } = body
    if (!courseId || !courseName) throw new BadRequestException('courseId and courseName required')

    const existing = await this.bookingModel.findOne({ course: courseId, clerkUserId: userId })
    if (existing) return { success: true, booking: existing, alreadyEnrolled: true }

    const resolvedStudentName = (studentName && String(studentName).trim()) ||
      (email && String(email).trim()) || `User-${String(userId).slice(0, 8)}`

    const booking = new this.bookingModel({
      bookingId: this.genBookingId(), clerkUserId: userId, studentName: resolvedStudentName,
      course: courseId, courseName, teacherName, notes, orderStatus: 'Confirmed', enrolledAt: new Date(),
    })
    await booking.save()
    return { success: true, booking }
  }

  async getUserBookings(userId: string) {
    if (!userId) throw new UnauthorizedException('Unauthorized')
    const bookings = await this.bookingModel.find({ clerkUserId: userId }).sort({ createdAt: -1 })
    return { success: true, bookings }
  }

  async saveProgress(userId: string, courseId: string, completedChapters: string[]) {
    if (!userId) throw new UnauthorizedException('Unauthorized')
    const booking = await this.bookingModel.findOneAndUpdate(
      { clerkUserId: userId, course: courseId },
      { completedChapters },
      { new: true },
    )
    if (!booking) throw new NotFoundException('Enrollment not found')
    return { success: true, completedChapters: booking.completedChapters }
  }

  async getProgress(userId: string, courseId: string) {
    if (!userId) return { success: true, completedChapters: [] }
    const booking = await this.bookingModel.findOne({ clerkUserId: userId, course: courseId })
    return { success: true, completedChapters: booking?.completedChapters || [] }
  }

  async getStats() {
    const totalBookings = await this.bookingModel.countDocuments()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const bookingsLast7Days = await this.bookingModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } })

    const topCourses = await this.bookingModel.aggregate([
      { $group: { _id: '$courseName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      { $project: { courseName: '$_id', count: 1, _id: 0 } },
    ])

    return { success: true, stats: { totalBookings, bookingsLast7Days, topCourses } }
  }
}
