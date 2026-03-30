import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import { User, UserSchema } from '../schemas/user.schema'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtGuard } from './jwt.guard'
import { AttachUserMiddleware } from './attach-user.middleware'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'changeme_secret',
        signOptions: { expiresIn: process.env.JWT_EXPIRES || '7d' },
      }),
    }),
  ],
  providers: [AuthService, JwtGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachUserMiddleware).forRoutes('*')
  }
}
