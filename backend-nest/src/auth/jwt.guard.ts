import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest()
    const header: string = req.headers.authorization || ''
    if (!header.startsWith('Bearer ')) throw new UnauthorizedException('Unauthorized')
    try {
      const payload = this.jwt.verify(header.slice(7))
      req.userId = String(payload.userId || payload.id || payload.sub || '')
      req.userRole = String(payload.role || 'user')
      return true
    } catch {
      throw new UnauthorizedException('Unauthorized')
    }
  }
}
