import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Add CORS headers manually at Express level as a safety net
  app.use((_req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    if (_req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })

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

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err.message, err.stack)
  process.exit(1)
})