import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import * as https from 'https'

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name)
  private readonly from = { name: 'Arohak Learning Portal', email: 'arohak.lms.auth@gmail.com' }

  onModuleInit() {
    if (!process.env.BREVO_API_KEY) {
      this.logger.warn('⚠️  BREVO_API_KEY not set. Emails will not be sent.')
    } else {
      this.logger.log('✅ Brevo HTTP API configured')
    }
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    const body = JSON.stringify({
      sender: this.from,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    })

    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(body),
        },
      }, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve()
          } else {
            reject(new Error(`Brevo API error ${res.statusCode}: ${data}`))
          }
        })
      })
      req.on('error', reject)
      req.write(body)
      req.end()
    })
  }

  async sendVerificationEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    await this.send(to, 'Confirm your email — Arohak LMS', `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto;padding:40px 32px;background:#fff;border-radius:16px;border:1px solid #e2e8f0">
        <h2 style="color:#1e293b;text-align:center">Confirm your email</h2>
        <p style="color:#64748b;text-align:center">Thanks for signing up! Click below to activate your account. Expires in <strong>24 hours</strong>.</p>
        <div style="text-align:center;margin:28px 0">
          <a href="${url}" style="padding:14px 36px;background:#dc2626;color:#fff;border-radius:10px;text-decoration:none;font-weight:700">Activate Account</a>
        </div>
        <p style="color:#64748b;font-size:11px;text-align:center">Or copy: <a href="${url}" style="color:#dc2626">${url}</a></p>
      </div>`)
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    await this.send(to, 'Reset your password — Arohak LMS', `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto;padding:40px 32px;background:#fff;border-radius:16px;border:1px solid #e2e8f0">
        <h2 style="color:#1e293b;text-align:center">Password reset request</h2>
        <p style="color:#64748b;text-align:center">Click below to set a new password. Expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:28px 0">
          <a href="${url}" style="padding:14px 36px;background:#dc2626;color:#fff;border-radius:10px;text-decoration:none;font-weight:700">Set New Password</a>
        </div>
        <p style="color:#64748b;font-size:11px;text-align:center">Or copy: <a href="${url}" style="color:#dc2626">${url}</a></p>
      </div>`)
  }

  async sendAdminPasswordResetEmail(to: string, token: string) {
    const url = `${process.env.ADMIN_URL || 'http://localhost:5174'}/reset-password?token=${token}`
    await this.send(to, 'Admin password reset — Arohak LMS', `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto;padding:40px 32px;background:#0f172a;border-radius:16px;border:1px solid #1e293b">
        <h2 style="color:#f1f5f9;text-align:center">Admin password reset</h2>
        <p style="color:#94a3b8;text-align:center">A reset was requested. Expires in <strong style="color:#e2e8f0">1 hour</strong>.</p>
        <div style="text-align:center;margin:28px 0">
          <a href="${url}" style="padding:14px 36px;background:#dc2626;color:#fff;border-radius:10px;text-decoration:none;font-weight:700">Set New Password</a>
        </div>
        <p style="color:#64748b;font-size:11px;text-align:center">Or copy: <a href="${url}" style="color:#818cf8">${url}</a></p>
      </div>`)
  }
}
