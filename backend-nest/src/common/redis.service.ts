import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis | null = null
  private readonly logger = new Logger(RedisService.name)

  onModuleInit() {
    const url = process.env.REDIS_URL
    if (!url) {
      this.logger.warn('⚠️  Redis URL not found. Running without cache.')
      return
    }
    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })
    this.client.on('connect', () => this.logger.log('✅ Redis connected'))
    this.client.on('error', (err: Error) => this.logger.error('❌ Redis error:', err.message))
  }

  async get(key: string): Promise<unknown> {
    if (!this.client) return null
    try {
      const data = await this.client.get(key)
      return data ? JSON.parse(data) : null
    } catch { return null }
  }

  async set(key: string, value: unknown, ttl = 3600): Promise<void> {
    if (!this.client) return
    try { await this.client.setex(key, ttl, JSON.stringify(value)) } catch { /* ignore */ }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return
    try { await this.client.del(key) } catch { /* ignore */ }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.client) return
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) await this.client.del(...keys)
    } catch { /* ignore */ }
  }
}
