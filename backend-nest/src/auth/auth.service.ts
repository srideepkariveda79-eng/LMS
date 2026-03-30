import { Injectable, BadRequestException, ConflictException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { User, UserDocument } from '../schemas/user.schema'
import { MailerService } from '../common/mailer.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private mailer: MailerService,
  ) {}

  private signToken(userId: string, role: string) {
    return this.jwt.sign({ userId, role })
  }

  async register(name: string, email: string, password: string) {
    if (!name?.trim() || !email?.trim() || !password)
      throw new BadRequestException('Name, email and password are required')
    if (password.length < 6)
      throw new BadRequestException('Password must be at least 6 characters')

    const existing = await this.userModel.findOne({ email: email.toLowerCase().trim() })
    if (existing) throw new ConflictException('Email already registered')

    const user = new this.userModel({ name: name.trim(), email: email.toLowerCase().trim(), password, role: 'user' })
    const verifyToken = user.generateEmailVerifyToken()
    await user.save()
    try { await this.mailer.sendVerificationEmail(user.email, verifyToken) } catch (e) { console.error('Verification email failed:', e) }
    return { success: true, message: 'Registered! Please check your email to verify your account.' }
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('Email and password required')
    const user = await this.userModel.findOne({ email: email.toLowerCase().trim() })
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const match = await user.comparePassword(password)
    if (!match) throw new UnauthorizedException('Invalid credentials')
    if (!user.emailVerified)
      throw new ForbiddenException({ message: 'Please verify your email before logging in.', needsVerification: true, email: user.email })
    const token = this.signToken(user._id.toString(), user.role)
    return { success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
  }

  async adminLogin(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('Email and password required')
    const user = await this.userModel.findOne({ email: email.toLowerCase().trim() })
    if (!user || user.role !== 'admin') throw new UnauthorizedException('Invalid admin credentials')
    const match = await user.comparePassword(password)
    if (!match) throw new UnauthorizedException('Invalid admin credentials')
    const token = this.signToken(user._id.toString(), user.role)
    return { success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('name email role emailVerified createdAt')
    if (!user) throw new NotFoundException('User not found')
    return { success: true, user }
  }

  async verifyEmail(token: string) {
    if (!token) throw new BadRequestException('Token required')
    const user = await this.userModel.findOne({ emailVerifyToken: token })
    if (!user) throw new BadRequestException('Invalid or expired verification link')
    user.emailVerified = true
    user.emailVerifyToken = null
    await user.save()
    const jwtToken = this.signToken(user._id.toString(), user.role)
    return { success: true, message: 'Email verified!', token: jwtToken }
  }

  async resendVerification(email: string) {
    const user = await this.userModel.findOne({ email: email?.toLowerCase().trim() })
    if (!user || user.emailVerified)
      return { success: true, message: 'If that email exists and is unverified, a link has been sent.' }
    const token = user.generateEmailVerifyToken()
    await user.save()
    try { await this.mailer.sendVerificationEmail(user.email, token) } catch (e) { console.error('Resend email failed:', e) }
    return { success: true, message: 'Verification email sent.' }
  }

  async forgotPassword(email: string, isAdmin: boolean) {
    const user = await this.userModel.findOne({ email: email?.toLowerCase().trim() })
    if (!user) return { success: true, message: 'If that email exists, a reset link has been sent.' }
    const token = user.generatePasswordResetToken()
    await user.save()
    try {
      if (user.role === 'admin') await this.mailer.sendAdminPasswordResetEmail(user.email, token)
      else await this.mailer.sendPasswordResetEmail(user.email, token)
    } catch (e) { console.error('Reset email failed:', e) }
    return { success: true, message: 'If that email exists, a reset link has been sent.' }
  }

  async updateProfile(userId: string, name: string) {
    if (!name?.trim()) throw new BadRequestException('Name is required')
    const user = await this.userModel.findByIdAndUpdate(userId, { name: name.trim() }, { new: true }).select('name email role')
    if (!user) throw new NotFoundException('User not found')
    return { success: true, user }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) throw new BadRequestException('Both passwords required')
    if (newPassword.length < 6) throw new BadRequestException('New password must be at least 6 characters')
    const user = await this.userModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')
    const match = await user.comparePassword(currentPassword)
    if (!match) throw new BadRequestException('Current password is incorrect')
    user.password = newPassword
    await user.save()
    return { success: true, message: 'Password changed successfully.' }
  }

  async resetPassword(token: string, password: string) {
    if (!token || !password) throw new BadRequestException('Token and password required')
    if (password.length < 6) throw new BadRequestException('Password must be at least 6 characters')
    const user = await this.userModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } })
    if (!user) throw new BadRequestException('Invalid or expired reset link')
    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()
    return { success: true, message: 'Password reset successfully.' }
  }
}
