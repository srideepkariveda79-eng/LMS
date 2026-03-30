import { Injectable, Logger } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name)

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    this.logger.log(`✅ Cloudinary configured (cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`)
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'arohak-lms/courses', resource_type: 'image' },
        (err, result) => {
          if (err || !result) return reject(err || new Error('Upload failed'))
          resolve(result.secure_url)
        },
      )
      const stream = Readable.from(file.buffer)
      stream.pipe(upload)
    })
  }

  async deleteImage(publicIdOrUrl: string): Promise<void> {
    try {
      // Extract public_id from URL if full URL passed
      let publicId = publicIdOrUrl
      if (publicIdOrUrl.includes('cloudinary.com')) {
        const parts = publicIdOrUrl.split('/')
        const uploadIdx = parts.indexOf('upload')
        if (uploadIdx !== -1) {
          // skip version segment (v12345) if present
          const rest = parts.slice(uploadIdx + 1)
          if (/^v\d+$/.test(rest[0])) rest.shift()
          publicId = rest.join('/').replace(/\.[^.]+$/, '')
        }
      }
      await cloudinary.uploader.destroy(publicId)
    } catch (e) {
      this.logger.warn(`Failed to delete Cloudinary image: ${e.message}`)
    }
  }
}
