import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Booking, BookingSchema } from '../schemas/booking.schema'
import { BookingService } from './booking.service'
import { BookingController } from './booking.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    AuthModule,
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
