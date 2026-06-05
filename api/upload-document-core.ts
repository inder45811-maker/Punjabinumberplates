import { v2 as cloudinary } from 'cloudinary'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export interface UploadDocumentPayload {
  fileName?: string
  fileType?: string
  fileData?: string
}

export interface UploadDocumentResult {
  url: string
  publicId: string
}

export class UploadDocumentError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'UploadDocumentError'
    this.status = status
  }
}

function requiredCloudinaryEnv(env: NodeJS.ProcessEnv) {
  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  }
}

export async function uploadDocumentPayload(
  payload: UploadDocumentPayload,
  env: NodeJS.ProcessEnv = process.env
): Promise<UploadDocumentResult> {
  const { fileName, fileType, fileData } = payload

  if (!fileName || !fileType || !fileData) {
    throw new UploadDocumentError(
      400,
      'fileName, fileType and fileData are required'
    )
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    throw new UploadDocumentError(400, 'File must be a PDF, JPG, or PNG')
  }

  const buffer = Buffer.from(fileData, 'base64')
  if (buffer.length > MAX_BYTES) {
    throw new UploadDocumentError(400, 'File must be under 10 MB')
  }

  const { cloudName, apiKey, apiSecret } = requiredCloudinaryEnv(env)
  if (!cloudName || !apiKey || !apiSecret) {
    throw new UploadDocumentError(
      500,
      'Cloudinary document upload is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env, then restart the dev server.'
    )
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })

  const sanitised = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
  const publicId = `pnp-documents/pnp-${Date.now()}-${sanitised}`
  const dataUri = `data:${fileType};base64,${fileData}`

  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: publicId,
    resource_type: 'auto',
  })

  return { url: result.secure_url, publicId: result.public_id }
}
