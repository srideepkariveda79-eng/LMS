import { Controller, Get, Post, Query, Body, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { BookingService } from './booking.service'
import { JwtGuard } from '../auth/jwt.guard'

type AuthReq = Request & { userId?: string }

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  getBookings(
    @Query('search') search = '',
    @Query('limit') limit = '50',
    @Query('page') page = '1',
  ) {
    return this.bookingService.getBookings(search, limit, page)
  }

  @Get('stats')
  getStats() {
    return this.bookingService.getStats()
  }

  @Post('create')
  @UseGuards(JwtGuard)
  createBooking(@Body() body: any, @Req() req: AuthReq) {
    return this.bookingService.createBooking(req.userId, body)
  }

  @Get('check')
  checkBooking(@Query('courseId') courseId: string, @Req() req: AuthReq) {
    return this.bookingService.checkBooking(req.userId, courseId)
  }

  @Get('my')
  @UseGuards(JwtGuard)
  getUserBookings(@Req() req: AuthReq) {
    return this.bookingService.getUserBookings(req.userId)
  }

  @Post('progress')
  @UseGuards(JwtGuard)
  saveProgress(@Body() body: { courseId: string; completedChapters: string[] }, @Req() req: AuthReq) {
    return this.bookingService.saveProgress(req.userId, body.courseId, body.completedChapters)
  }

  @Get('progress')
  @UseGuards(JwtGuard)
  getProgress(@Query('courseId') courseId: string, @Req() req: AuthReq) {
    return this.bookingService.getProgress(req.userId, courseId)
  }
}
