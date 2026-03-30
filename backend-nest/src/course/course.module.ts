import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Course, CourseSchema } from '../schemas/course.schema'
import { QuizResult, QuizResultSchema } from '../schemas/quiz-result.schema'
import { Booking, BookingSchema } from '../schemas/booking.schema'
import { CourseService } from './course.service'
import { QuizService } from './quiz.service'
import { CourseController } from './course.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: QuizResult.name, schema: QuizResultSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
    AuthModule,
  ],
  providers: [CourseService, QuizService],
  controllers: [CourseController],
})
export class CourseModule {}
