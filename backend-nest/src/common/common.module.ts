import { Module, Global } from '@nestjs/common'
import { RedisService } from './redis.service'
import { MailerService } from './mailer.service'
import { CloudinaryService } from './cloudinary.service'

@Global()
@Module({
  providers: [RedisService, MailerService, CloudinaryService],
  exports: [RedisService, MailerService, CloudinaryService],
})
export class CommonModule {}
