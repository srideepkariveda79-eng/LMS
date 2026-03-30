import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  use(req: Request & { userId?: string; userRole?: string }, _res: Response, next: NextFunction) {
    const header = req.headers.authorization || ''
    if (header.startsWith('Bearer ')) {
      try {
        const payload = this.jwt.verify(header.slice(7))
        req.userId = String(payload.userId || payload.id || payload.sub || '')
        req.userRole = String(payload.role || 'user')
      } catch { /* ignore */ }
    }
    next()
  }
}
