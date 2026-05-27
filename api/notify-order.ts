import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface DocumentEntry {
  label: string
  fileName: string
  url: string
}

interface OrderPayload {
  orderRef: string
  customerName: string
  phone: string
  plateText: string
  deliveryMethod: string
  documents: DocumentEntry[]
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function buildHtml(payload: OrderPayload): string {
  const phone = esc(payload.phone ?? '')
  const deliveryMethod = esc(payload.deliveryMethod ?? '')

  const docRows = payload.documents
    .map(
      (d) =>
        `<tr>
          <td style="padding:4px 8px;color:#aaa;">${esc(d.label)}</td>
          <td style="padding:4px 8px;">
            <a href="${esc(d.url)}" style="color:#ffd700;">${esc(d.fileName)}</a>
          </td>
        </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<body style="background:#111;color:#f2f3f4;font-family:Inter,system-ui,sans-serif;padding:32px;">
  <h2 style="color:#ffd700;margin:0 0 24px;">
    New PNP Order — ${esc(payload.plateText)} — ${esc(payload.orderRef)}
  </h2>
  <table style="border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="padding:4px 8px;color:#aaa;">Customer</td><td style="padding:4px 8px;">${esc(payload.customerName)}</td></tr>
    <tr><td style="padding:4px 8px;color:#aaa;">Phone</td><td style="padding:4px 8px;">${phone}</td></tr>
    <tr><td style="padding:4px 8px;color:#aaa;">Plate text</td><td style="padding:4px 8px;">${esc(payload.plateText)}</td></tr>
    <tr><td style="padding:4px 8px;color:#aaa;">Delivery</td><td style="padding:4px 8px;">${deliveryMethod}</td></tr>
  </table>
  <h3 style="color:#ffd700;margin:0 0 12px;">Documents</h3>
  <table style="border-collapse:collapse;">
    ${docRows}
  </table>
  <p style="margin-top:32px;color:#555;font-size:0.8rem;">
    Cloudinary links are valid indefinitely. Delete from Cloudinary once processed.
  </p>
</body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  const payload = (req.body ?? {}) as OrderPayload

  if (!payload.orderRef || !payload.customerName || !payload.plateText) {
    return res.status(400).json({ error: 'orderRef, customerName and plateText are required' })
  }

  if (!Array.isArray(payload.documents)) {
    payload.documents = []
  }

  const ownerEmail = process.env.SHOP_OWNER_EMAIL
  if (!ownerEmail) {
    console.error('SHOP_OWNER_EMAIL is not set')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  try {
    await resend.emails.send({
      // Use 'onboarding@resend.dev' during development (no domain verification needed).
      // Switch to 'orders@yourdomain.com' after verifying your domain in Resend dashboard.
      from: 'Punjab Number Plates <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `New PNP Order — ${payload.plateText} — ${payload.orderRef}`,
      html: buildHtml(payload),
    })
    return res.status(200).json({ success: true })
  } catch (err: unknown) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
