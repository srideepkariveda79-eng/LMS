import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean) as string[]

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })

  // ensure uploads folder exists before serving
  const uploadsPath = join(process.cwd(), 'uploads')
  if (!existsSync(uploadsPath)) mkdirSync(uploadsPath, { recursive: true })
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' })

  app.setGlobalPrefix('api')

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`🚀 Server is running on port ${port}`)
}

bootstrap()
