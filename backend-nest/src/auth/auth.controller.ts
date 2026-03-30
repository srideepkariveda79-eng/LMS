import { Controller, Post, Get, Body, Query, Req, UseGuards, Patch } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtGuard } from './jwt.guard'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: { name: string; email: string; password: string }) {
    return this.auth.register(body.name, body.email, body.password)
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password)
  }

  @Post('admin/login')
  adminLogin(@Body() body: { email: string; password: string }) {
    return this.auth.adminLogin(body.email, body.password)
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.auth.verifyEmail(token)
  }

  @Post('resend-verification')
  resendVerification(@Body() body: { email: string }) {
    return this.auth.resendVerification(body.email)
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string; isAdmin?: boolean }) {
    return this.auth.forgotPassword(body.email, !!body.isAdmin)
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.auth.resetPassword(body.token, body.password)
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@Req() req: Request & { userId: string }) {
    return this.auth.getMe(req.userId)
  }

  @Patch('profile')
  @UseGuards(JwtGuard)
  updateProfile(@Body() body: { name: string }, @Req() req: Request & { userId: string }) {
    return this.auth.updateProfile(req.userId, body.name)
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  changePassword(@Body() body: { currentPassword: string; newPassword: string }, @Req() req: Request & { userId: string }) {
    return this.auth.changePassword(req.userId, body.currentPassword, body.newPassword)
  }
}
