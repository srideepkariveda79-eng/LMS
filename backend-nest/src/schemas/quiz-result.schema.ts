import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type QuizResultDocument = QuizResult & Document

@Schema({ timestamps: true })
export class QuizResult {
  @Prop({ required: true }) userId: string
  @Prop({ required: true }) courseId: string
  @Prop({ required: true }) score: number
  @Prop({ required: true }) passed: boolean
  @Prop({ type: [Number], default: [] }) answers: number[]
  @Prop({ default: null }) certificateId: string | null
  @Prop({ default: () => new Date() }) attemptedAt: Date
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult)
QuizResultSchema.index({ userId: 1, courseId: 1 }, { unique: true })
