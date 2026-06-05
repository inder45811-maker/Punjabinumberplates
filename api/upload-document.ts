import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  uploadDocumentPayload,
  UploadDocumentError,
  type UploadDocumentPayload,
} from './upload-document-core.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = await uploadDocumentPayload((req.body ?? {}) as UploadDocumentPayload)
    return res.status(200).json(result)
  } catch (err: unknown) {
    if (err instanceof UploadDocumentError) {
      if (err.status >= 500) {
        console.error('Document upload configuration error:', err.message)
      }
      return res.status(err.status).json({ error: err.message })
    }
    console.error('Cloudinary upload error:', err)
    return res.status(500).json({ error: 'Upload failed' })
  }
}
