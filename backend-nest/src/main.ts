import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { NestExpressApplication } from '@nestjs/platform-express'

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message, err.stack)
})
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason)
})

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
  try {
    if (!existsSync(uploadsPath)) mkdirSync(uploadsPath, { recursive: true })
    app.useStaticAssets(uploadsPath, { prefix: '/uploads' })
  } catch (e) {
    console.warn('⚠️ Could not setup static assets:', e.message)
  }

  app.setGlobalPrefix('api')

  // Health check endpoint for Railway
  const expressApp = app.getHttpAdapter().getInstance()
  expressApp.get('/health', (_req: any, res: any) => res.json({ status: 'ok' }))
  expressApp.get('/', (_req: any, res: any) => res.json({ status: 'ok', service: 'Arohak LMS API' }))

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`🚀 Server running on port ${port}`)
}

bootstrap().catch(err => {
  console.error('❌ Bootstrap failed:', err.message, err.stack)
  process.exit(1)
})