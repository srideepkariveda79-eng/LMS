import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { Request } from 'express'
import { CourseService } from './course.service'
import { QuizService } from './quiz.service'
import { JwtGuard } from '../auth/jwt.guard'

// Use memory storage — files go to Cloudinary, not disk
const multerMemory = memoryStorage()

type AuthReq = Request & { userId?: string }

@Controller('course')
export class CourseController {
  constructor(
    private courseService: CourseService,
    private quizService: QuizService,
  ) {}

  @Get('public')
  getPublicCourses(@Query('home') home: string, @Query('type') type = 'all', @Query('limit') limit: string, @Req() req: Request) {
    return this.courseService.getPublicCourses(home, type, limit, req.protocol, req.get('host'))
  }

  @Get()
  getCourses(@Req() req: Request) {
    return this.courseService.getCourses(req.protocol, req.get('host'))
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: multerMemory }))
  createCourse(@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.courseService.createCourse(body, file, req.protocol, req.get('host'))
  }

  // ── quiz sub-routes BEFORE /:id ──────────────────────────────────────────

  @Get('quiz/my-results')
  @UseGuards(JwtGuard)
  getUserQuizResults(@Req() req: AuthReq) {
    return this.quizService.getUserResults(req.userId)
  }

  @Get(':courseId/quiz/result')
  @UseGuards(JwtGuard)
  getQuizResult(@Param('courseId') courseId: string, @Req() req: AuthReq) {
    return this.quizService.getQuizResult(courseId, req.userId)
  }

  @Get(':courseId/quiz')
  @UseGuards(JwtGuard)
  getQuiz(@Param('courseId') courseId: string, @Req() req: AuthReq) {
    return this.quizService.getQuiz(courseId, req.userId)
  }

  @Post(':courseId/quiz/submit')
  @UseGuards(JwtGuard)
  submitQuiz(@Param('courseId') courseId: string, @Body('answers') answers: number[], @Req() req: AuthReq) {
    return this.quizService.submitQuiz(courseId, req.userId, answers)
  }

  @Patch(':id/quiz')
  updateCourseQuiz(@Param('id') id: string, @Body('quiz') quiz: any) {
    return this.courseService.updateCourseQuiz(id, quiz)
  }

  @Post(':courseId/rate')
  @UseGuards(JwtGuard)
  rateCourse(@Param('courseId') courseId: string, @Body() body: { rating: number; comment?: string }, @Req() req: AuthReq) {
    return this.courseService.rateCourse(courseId, req.userId, Number(body.rating), body.comment || '')
  }

  @Get(':courseId/rating')
  @UseGuards(JwtGuard)
  getMyRating(@Param('courseId') courseId: string, @Req() req: AuthReq) {
    return this.courseService.getMyRating(courseId, req.userId)
  }

  // ── generic /:id LAST ────────────────────────────────────────────────────

  @Get(':id')
  getCourseById(@Param('id') id: string, @Req() req: Request) {
    return this.courseService.getCourseById(id, req.protocol, req.get('host'))
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage: multerMemory }))
  updateCourse(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.courseService.updateCourse(id, body, file, req.protocol, req.get('host'))
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id)
  }
}
