import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v2 as cloudinary } from 'cloudinary'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { fileName, fileType, fileData } = req.body as {
    fileName?: string
    fileType?: string
    fileData?: string
  }

  if (!fileName || !fileType || !fileData) {
    return res.status(400).json({ error: 'fileName, fileType and fileData are required' })
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    return res.status(400).json({ error: 'File must be a PDF, JPG, or PNG' })
  }

  const buffer = Buffer.from(fileData, 'base64')
  if (buffer.length > MAX_BYTES) {
    return res.status(400).json({ error: 'File must be under 10 MB' })
  }

  const sanitised = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
  const publicId = `pnp-documents/pnp-${Date.now()}-${sanitised}`
  const dataUri = `data:${fileType};base64,${fileData}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, { public_id: publicId })
    return res.status(200).json({ url: result.secure_url, publicId: result.public_id })
  } catch (err: any) {
    console.error('Cloudinary upload error:', err)
    return res.status(500).json({ error: 'Upload failed' })
  }
}
