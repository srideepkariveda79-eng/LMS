import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string
  @Prop({ required: true }) password: string
  @Prop({ default: 'user' }) role: string
  @Prop({ default: false }) emailVerified: boolean
  @Prop({ default: null }) emailVerifyToken: string | null
  @Prop({ default: null }) resetPasswordToken: string | null
  @Prop({ default: null }) resetPasswordExpires: Date | null

  comparePassword: (plain: string) => Promise<boolean>
  generateEmailVerifyToken: () => string
  generatePasswordResetToken: () => string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function () {
  if (this.isModified('password') && !(this.password as string).startsWith('$2')) {
    this.password = await bcrypt.hash(this.password as string, 10)
  }
})

UserSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password)
}

UserSchema.methods.generateEmailVerifyToken = function (): string {
  const token = crypto.randomBytes(32).toString('hex')
  this.emailVerifyToken = token
  return token
}

UserSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken = token
  this.resetPasswordExpires = new Date(Date.now() + 3600 * 1000)
  return token
}
