import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // CORS: allow all origins
  app.enableCors({ origin: '*', credentials: false })

  const uploadsPath = join(process.cwd(), 'uploads')
  if (!existsSync(uploadsPath)) mkdirSync(uploadsPath, { recursive: true })
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' })

  app.setGlobalPrefix('api')

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`🚀 Server running on port ${port}`)
}

bootstrap()
