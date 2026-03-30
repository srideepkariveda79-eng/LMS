import 'reflect-metadata'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { CourseModule } from './course/course.module'
import { BookingModule } from './booking/booking.module'
import { CommonModule } from './common/common.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/lms'),
    CommonModule,
    AuthModule,
    CourseModule,
    BookingModule,
  ],
})
export class AppModule {}
