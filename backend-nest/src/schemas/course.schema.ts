import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CourseDocument = Course & Document

export interface Duration { hours: number; minutes: number }
export interface Chapter { id?: string; name: string; topic: string; duration: Duration; totalMinutes: number; videoUrl: string }
export interface Lecture { id?: string; title: string; duration: Duration; totalMinutes: number; chapters: Chapter[] }
export interface QuizQuestion { id?: string; question: string; options: string[]; correctIndex: number }
export interface Quiz { enabled: boolean; passingScore: number; questions: QuizQuestion[] }
export interface CourseRating { userId: string; rating: number; comment: string; updatedAt: Date | null }

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true }) name: string
  @Prop({ required: true }) teacher: string
  @Prop({ default: null }) image: string | null
  @Prop({ default: 'beginner' }) level: string
  @Prop({ type: [Object], default: [] }) ratings: CourseRating[]
  @Prop({ default: 0 }) avgRating: number
  @Prop({ default: 0 }) totalRatings: number
  @Prop({ default: null }) overview: string | null
  @Prop({ type: Object, default: { hours: 0, minutes: 0 } }) totalDuration: Duration
  @Prop({ default: 0 }) totalLectures: number
  @Prop({ type: [Object], default: [] }) lectures: Lecture[]
  @Prop({ default: 'regular' }) courseType: string
  @Prop({ type: Object, default: { enabled: false, passingScore: 70, questions: [] } }) quiz: Quiz
}

export const CourseSchema = SchemaFactory.createForClass(Course)

function computeDurations(doc: any) {
  if (!Array.isArray(doc.lectures)) { doc.lectures = []; return }
  let courseTotalMinutes = 0
  doc.lectures = doc.lectures.map((lecture: any) => {
    lecture.duration = lecture.duration || { hours: 0, minutes: 0 }
    lecture.chapters = Array.isArray(lecture.chapters) ? lecture.chapters : []
    let chaptersSum = 0
    lecture.chapters = lecture.chapters.map((ch: any) => {
      ch.duration = ch.duration || { hours: 0, minutes: 0 }
      const chTotal = Math.max(0, (Number(ch.duration.hours) || 0) * 60 + (Number(ch.duration.minutes) || 0))
      ch.totalMinutes = chTotal
      ch.name = ch.name || ''; ch.topic = ch.topic || ''; ch.videoUrl = ch.videoUrl || ''
      chaptersSum += chTotal
      return ch
    })
    const lecTotal = lecture.chapters.length > 0 ? chaptersSum : Math.max(0, (Number(lecture.duration.hours) || 0) * 60 + (Number(lecture.duration.minutes) || 0))
    lecture.totalMinutes = lecTotal
    lecture.duration = { hours: Math.floor(lecTotal / 60), minutes: lecTotal % 60 }
    lecture.title = lecture.title || 'Untitled lecture'
    courseTotalMinutes += lecTotal
    return lecture
  })
  doc.totalDuration = { hours: Math.floor(courseTotalMinutes / 60), minutes: courseTotalMinutes % 60 }
  doc.totalLectures = doc.lectures.length
}

CourseSchema.pre('save', function () { computeDurations(this) })
