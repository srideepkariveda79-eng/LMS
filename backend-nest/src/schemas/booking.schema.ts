import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type BookingDocument = Booking & Document

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, unique: true }) bookingId: string
  @Prop({ required: true }) clerkUserId: string
  @Prop({ default: 'Unknown' }) studentName: string
  @Prop({ required: true }) course: string
  @Prop({ required: true }) courseName: string
  @Prop({ default: '' }) teacherName: string
  @Prop({ default: () => new Date() }) enrolledAt: Date
  @Prop({ default: 'Confirmed' }) orderStatus: string
  @Prop({ default: '' }) notes: string
  @Prop({ type: [String], default: [] }) completedChapters: string[]
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
BookingSchema.index({ clerkUserId: 1, course: 1 })
