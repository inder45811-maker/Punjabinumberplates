# DVLA Document Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the existing document upload UI so files are stored in Cloudinary, linked to the Shopify order as cart attributes, and emailed to the shop owner via Resend — all triggered when the customer clicks "Place Order" in `Checkout.tsx`.

**Architecture:** Two Vercel serverless functions (`api/upload-document.ts`, `api/notify-order.ts`) keep all API keys server-side. `Checkout.tsx`'s `handlePlaceOrder` becomes async: it uploads each `File` object to Cloudinary via the first function, stamps the returned URLs onto the Shopify cart, then calls the second function to email the owner. `Product.tsx` and `PlateHolders.tsx` store their pre-selected files in `CartContext` so Checkout can pre-populate its upload step.

**Tech Stack:** Vite + React 19, TypeScript, Vercel serverless functions (Node.js), Cloudinary Node.js SDK v2, Resend SDK, Shopify Storefront API (existing `storefront()` helper)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `api/upload-document.ts` | Validates + uploads one file to Cloudinary, returns URL |
| Create | `api/notify-order.ts` | Sends HTML email to shop owner via Resend |
| Create | `vercel.json` | SPA routing fallback for Vercel deployment |
| Modify | `package.json` | Add `cloudinary`, `resend`, `@vercel/node` |
| Modify | `.env` | Add 5 new env var keys (values filled by developer) |
| Modify | `src/lib/shopify.ts` | Add `cartAttributesUpdate` mutation wrapper |
| Modify | `src/context/CartContext.tsx` | Add `pendingDocuments: File[]` + setter |
| Modify | `src/pages/Checkout.tsx` | `uploadedFiles: File[]`, `useCart`, async `handlePlaceOrder` |
| Modify | `src/pages/Product.tsx` | Sync `proofOfId`/`proofOfEntitlement` to CartContext |
| Modify | `src/pages/PlateHolders.tsx` | Sync `proofOfId`/`proofOfEntitlement` to CartContext |

---

## Task 1: Setup — Packages, Env Vars, vercel.json

**Files:**
- Modify: `package.json`
- Modify: `.env`
- Create: `vercel.json`

- [ ] **Step 1: Install server-side packages**

```bash
npm install cloudinary resend
npm install --save-dev @vercel/node
```

Expected: packages appear in `package.json` dependencies.

- [ ] **Step 2: Add env var keys to `.env`**

Open `.env` and append these five lines (leave values blank — the developer must fill them from their Cloudinary and Resend dashboards):

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
SHOP_OWNER_EMAIL=
```

> **Note for developer:** Sign up at cloudinary.com for CLOUDINARY_* values. Sign up at resend.com for RESEND_API_KEY. Set SHOP_OWNER_EMAIL to the address that should receive order notifications. Add all five to the Vercel project dashboard under Settings → Environment Variables before deploying.

- [ ] **Step 3: Create `vercel.json`**

Create `vercel.json` at the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This tells Vercel to serve `dist/index.html` for all non-API routes (SPA routing). The `/api` directory is handled automatically before rewrites apply.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds (no new errors — we haven't changed any TS files yet).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env vercel.json
git commit -m "chore: add cloudinary, resend deps and vercel config"
```

---

## Task 2: `api/upload-document.ts`

**Files:**
- Create: `api/upload-document.ts`

This function accepts a single file encoded as base64 JSON, validates it, uploads it to Cloudinary, and returns the secure URL.

- [ ] **Step 1: Create `api/upload-document.ts`**

Create the file `api/upload-document.ts` at the project root (not inside `src/`):

```typescript
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
```

- [ ] **Step 2: Smoke-test the function locally with Vercel CLI**

If you have the Vercel CLI installed (`npm i -g vercel`), run:

```bash
vercel dev
```

Then in a second terminal, with real env vars set, send a test request:

```bash
# Encode a small test file as base64
echo "test pdf content" | base64
# Copy the output (e.g. "dGVzdCBwZGYgY29udGVudAo=")

curl -X POST http://localhost:3000/api/upload-document \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.pdf","fileType":"application/pdf","fileData":"dGVzdCBwZGYgY29udGVudAo="}'
```

Expected response: `{"url":"https://res.cloudinary.com/...","publicId":"pnp-documents/pnp-..."}`

If you get `{"error":"Upload failed"}`, check that `CLOUDINARY_*` vars are set correctly in `.env`.

- [ ] **Step 3: Commit**

```bash
git add api/upload-document.ts
git commit -m "feat: add upload-document Vercel function (Cloudinary)"
```

---

## Task 3: `api/notify-order.ts`

**Files:**
- Create: `api/notify-order.ts`

This function receives order details and document URLs, builds an HTML email, and sends it to the shop owner via Resend.

- [ ] **Step 1: Create `api/notify-order.ts`**

```typescript
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

function buildHtml(payload: OrderPayload): string {
  const docRows = payload.documents
    .map(
      (d) =>
        `<tr>
          <td style="padding:4px 8px;color:#aaa;">${d.label}</td>
          <td style="padding:4px 8px;">
            <a href="${d.url}" style="color:#ffd700;">${d.fileName}</a>
          </td>
        </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<body style="background:#111;color:#f2f3f4;font-family:Inter,system-ui,sans-serif;padding:32px;">
  <h2 style="color:#ffd700;margin:0 0 24px;">
    New PNP Order — ${payload.plateText} — ${payload.orderRef}
  </h2>
  <table style="border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="padding:4px 8px;color:#aaa;">Customer</td><td style="padding:4px 8px;">${payload.customerName}</td></tr>
    <tr><td style="padding:4px 8px;color:#aaa;">Phone</td><td style="padding:4px 8px;">${payload.phone}</td></tr>
    <tr><td style="padding:4px 8px;color:#aaa;">Plate text</td><td style="padding:4px 8px;">${payload.plateText}</td></tr>
    <tr><td style="padding:4px 8px;color:#aaa;">Delivery</td><td style="padding:4px 8px;">${payload.deliveryMethod}</td></tr>
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

  const payload = req.body as OrderPayload

  if (!payload.orderRef || !payload.customerName || !payload.plateText) {
    return res.status(400).json({ error: 'orderRef, customerName and plateText are required' })
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
  } catch (err: any) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
```

- [ ] **Step 2: Smoke-test locally**

With `vercel dev` running:

```bash
curl -X POST http://localhost:3000/api/notify-order \
  -H "Content-Type: application/json" \
  -d '{
    "orderRef": "APX-2026-001",
    "customerName": "Test User",
    "phone": "07700000000",
    "plateText": "PNJB 1",
    "deliveryMethod": "standard",
    "documents": [
      {"label": "Proof of ID", "fileName": "passport.pdf", "url": "https://example.com/doc1.pdf"}
    ]
  }'
```

Expected: `{"success":true}` and an email arrives at `SHOP_OWNER_EMAIL`.

If Resend returns an error about the `from` address, make sure you are using `onboarding@resend.dev` (Resend's sandbox sender) during development.

- [ ] **Step 3: Commit**

```bash
git add api/notify-order.ts
git commit -m "feat: add notify-order Vercel function (Resend email)"
```

---

## Task 4: `cartAttributesUpdate` in `src/lib/shopify.ts`

**Files:**
- Modify: `src/lib/shopify.ts`

Add a wrapper for the Shopify `cartAttributesUpdate` GraphQL mutation. This stamps document URLs onto the cart so they appear on the order in Shopify admin.

- [ ] **Step 1: Append `cartAttributesUpdate` to `src/lib/shopify.ts`**

Add this function at the end of the file (after the existing `getCart` function):

```typescript
export async function cartAttributesUpdate(
  cartId: string,
  attributes: { key: string; value: string }[]
): Promise<Cart> {
  const query = `
    mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
          lines(first: 100) {
            nodes {
              id
              quantity
              merchandise { ... on ProductVariant { id title product { title featuredImage { url } } } }
              attributes { key value }
              cost { totalAmount { amount currencyCode } }
            }
          }
        }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartAttributesUpdate: { cart: Cart; userErrors: { field: string; message: string }[] }
  }>(query, { cartId, attributes })

  if (data.cartAttributesUpdate.userErrors.length) {
    throw new Error(
      data.cartAttributesUpdate.userErrors.map((e) => e.message).join(', ')
    )
  }
  return data.cartAttributesUpdate.cart
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/shopify.ts
git commit -m "feat: add cartAttributesUpdate to Shopify lib"
```

---

## Task 5: `pendingDocuments` in `src/context/CartContext.tsx`

**Files:**
- Modify: `src/context/CartContext.tsx`

Add `pendingDocuments: File[]` to the cart context so `Product.tsx` and `PlateHolders.tsx` can pass pre-selected files through to `Checkout.tsx`.

- [ ] **Step 1: Add `pendingDocuments` to the `CartContextValue` interface**

In `src/context/CartContext.tsx`, find the `CartContextValue` interface (lines 12–23) and add two new lines:

```typescript
interface CartContextValue {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  error: string | null
  openCart: () => void
  closeCart: () => void
  addToCart: (item: CartItem) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  clearError: () => void
  pendingDocuments: File[]
  setPendingDocuments: (files: File[]) => void
}
```

- [ ] **Step 2: Add state inside `CartProvider`**

Find the block of `useState` calls in `CartProvider` (around line 31–34). Add the new state after `error`:

```typescript
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDocuments, setPendingDocuments] = useState<File[]>([])
```

- [ ] **Step 3: Add to the `value` object**

Find the `value` object (around line 130–141) and add the two new fields:

```typescript
  const value: CartContextValue = {
    cart,
    isOpen,
    isLoading,
    error,
    openCart,
    closeCart,
    addToCart,
    removeLine,
    updateQuantity,
    clearError,
    pendingDocuments,
    setPendingDocuments,
  }
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/context/CartContext.tsx
git commit -m "feat: add pendingDocuments to CartContext"
```

---

## Task 6: Wire up `src/pages/Checkout.tsx`

**Files:**
- Modify: `src/pages/Checkout.tsx`

This is the main task. Changes:
1. Add imports for `useCart` and `cartAttributesUpdate`
2. Change `uploadedFiles` state from `string[]` to `File[]`
3. Add `fileToBase64` helper
4. Pre-populate `uploadedFiles` from `CartContext.pendingDocuments` on mount
5. Make `handlePlaceOrder` async — upload files, update cart attributes, send email
6. Fix the file name display in `Step2Details`
7. Add submit error display

- [ ] **Step 1: Add imports at the top of `Checkout.tsx`**

Find the existing import block (lines 1–18). Add two new import lines after the existing ones:

```typescript
import { useCart } from '../context/CartContext'
import { cartAttributesUpdate } from '../lib/shopify'
```

- [ ] **Step 2: Add `useCart` destructuring inside `Checkout()`**

Find the line `const navigate = useNavigate()` (around line 111). Add right after it:

```typescript
  const { cart, pendingDocuments } = useCart()
```

- [ ] **Step 3: Change `uploadedFiles` state type**

Find line 136:
```typescript
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
```

Replace with:
```typescript
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
```

- [ ] **Step 4: Pre-populate from `pendingDocuments` on mount**

Add this `useEffect` immediately after the `uploadedFiles` state declaration. Add `useEffect` to the existing React import at the top of the file first — find `import { useState, useRef, useCallback } from 'react'` and change it to:

```typescript
import { useState, useRef, useCallback, useEffect } from 'react'
```

Then add the effect after the `uploadedFiles` state:

```typescript
  useEffect(() => {
    if (pendingDocuments.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles(pendingDocuments)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
```

- [ ] **Step 5: Update `handleFileUpload` to store `File` objects**

Find `handleFileUpload` (around line 297):
```typescript
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files).map((f) => f.name))
```

Change `map((f) => f.name)` — replace the full `setUploadedFiles` line:
```typescript
      setUploadedFiles(Array.from(e.target.files))
```

- [ ] **Step 6: Add `fileToBase64` helper**

Add this function at module level — outside the `Checkout()` function, just above it (near the `getConfigPrice` helper around line 93):

```typescript
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

- [ ] **Step 7: Replace `handlePlaceOrder` with the async version**

Find and replace the entire `handlePlaceOrder` function (lines 284–295):

```typescript
  /* -- Submit order -- */
  const handlePlaceOrder = async () => {
    if (!step3Valid()) return
    setIsSubmitting(true)

    try {
      // 1. Upload each file to Cloudinary
      const uploadResults = await Promise.all(
        uploadedFiles.map(async (file) => {
          const base64 = await fileToBase64(file)
          const res = await fetch('/api/upload-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, fileType: file.type, fileData: base64 }),
          })
          if (!res.ok) {
            const { error } = await res.json()
            throw new Error(error || 'Upload failed')
          }
          return (await res.json()) as { url: string; publicId: string }
        })
      )

      // 2. Stamp URLs onto the Shopify cart (non-blocking on failure)
      if (cart?.id && uploadResults.length > 0) {
        const attrs = uploadResults.map((r, i) => ({
          key: `document_${i + 1}_url`,
          value: r.url,
        }))
        try {
          await cartAttributesUpdate(cart.id, attrs)
        } catch (err) {
          console.error('Cart attributes update failed (non-critical):', err)
        }
      }

      // 3. Send notification email to shop owner
      const orderRef = `APX-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 999)
      ).padStart(3, '0')}`

      const notifyRes = await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef,
          customerName: customer.fullName,
          phone: customer.phone,
          plateText: registration,
          deliveryMethod,
          documents: uploadResults.map((r, i) => ({
            label: `Document ${i + 1}`,
            fileName: uploadedFiles[i].name,
            url: r.url,
          })),
        }),
      })

      if (!notifyRes.ok) {
        console.error('Notification email failed (non-critical)')
      }

      setOrderNumber(orderRef)
      setStep(4)
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'Upload failed — please check your files and try again.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }
```

- [ ] **Step 8: Add submit error display to `Step3Payment`**

In `Step3Payment`, find the Pay button `<div>` (around line 1797). Add an error message just above it:

```typescript
      {/* Submit error */}
      {errors.submit && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(217, 83, 79, 0.1)',
            border: `1px solid ${C.alertRed}`,
            color: C.alertRed,
            fontSize: '0.875rem',
          }}
        >
          {errors.submit}
        </div>
      )}

      {/* Pay Button */}
      <div ...
```

- [ ] **Step 9: Fix the file name display in `Step2Details`**

In `Step2Details`, find line 1148:
```typescript
                  {uploadedFiles.join(', ')}
```

Replace with:
```typescript
                  {uploadedFiles.map((f) => f.name).join(', ')}
```

Also update the prop type for `uploadedFiles` in `Step2Details` (around line 819):
```typescript
  uploadedFiles: string[]
```
Change to:
```typescript
  uploadedFiles: File[]
```

- [ ] **Step 10: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds with no type errors.

- [ ] **Step 11: Commit**

```bash
git add src/pages/Checkout.tsx
git commit -m "feat: wire up async handlePlaceOrder with Cloudinary upload and Resend notify"
```

---

## Task 7: Sync `Product.tsx` files to CartContext

**Files:**
- Modify: `src/pages/Product.tsx`

When the user attaches Proof of ID or Proof of Entitlement on the product page, save them to `CartContext.pendingDocuments` so they flow through to `Checkout.tsx`.

- [ ] **Step 1: Add `setPendingDocuments` to the existing `useCart` call**

In `Product.tsx`, find the line (around line 112):
```typescript
  const { addToCart, openCart } = useCart()
```

Replace with:
```typescript
  const { addToCart, openCart, setPendingDocuments } = useCart()
```

- [ ] **Step 2: Update the Proof of ID `onChange` handler**

Find the `onChange` for the proofOfId file input (around line 738 of Product.tsx):
```typescript
                        onChange={(e) => setProofOfId(e.target.files?.[0] || null)}
```

Replace with:
```typescript
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setProofOfId(file)
                          setPendingDocuments(
                            [file, proofOfEntitlement].filter((f): f is File => f !== null)
                          )
                        }}
```

- [ ] **Step 3: Update the Proof of Entitlement `onChange` handler**

Find the `onChange` for the proofOfEntitlement file input (around line 796 of Product.tsx):
```typescript
                        onChange={(e) => setProofOfEntitlement(e.target.files?.[0] || null)}
```

Replace with:
```typescript
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setProofOfEntitlement(file)
                          setPendingDocuments(
                            [proofOfId, file].filter((f): f is File => f !== null)
                          )
                        }}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Product.tsx
git commit -m "feat: sync Product.tsx document uploads to CartContext"
```

---

## Task 8: Sync `PlateHolders.tsx` files to CartContext

**Files:**
- Modify: `src/pages/PlateHolders.tsx`

Same pattern as Task 7.

- [ ] **Step 1: Import `useCart` (or add to existing import)**

Find wherever `useCart` is imported in `PlateHolders.tsx`, or add:

```typescript
import { useCart } from '../context/CartContext'
```

Check if it's already imported first with a quick search. If it is, just add `setPendingDocuments` to the destructuring.

- [ ] **Step 2: Destructure `setPendingDocuments` from `useCart`**

Add `setPendingDocuments` to the `useCart()` call in `PlateHolders.tsx`:

```typescript
const { ..., setPendingDocuments } = useCart()
```

(Preserve whatever is already destructured.)

- [ ] **Step 3: Update the Proof of ID `onChange` handler**

Find the proofOfId `onChange` in `PlateHolders.tsx` (around line 887):
```typescript
onChange={(e) => setProofOfId(e.target.files?.[0] || null)}
```

Replace with:
```typescript
onChange={(e) => {
  const file = e.target.files?.[0] || null
  setProofOfId(file)
  setPendingDocuments(
    [file, proofOfEntitlement].filter((f): f is File => f !== null)
  )
}}
```

- [ ] **Step 4: Update the Proof of Entitlement `onChange` handler**

Find the proofOfEntitlement `onChange` in `PlateHolders.tsx` (around line 945):
```typescript
onChange={(e) => setProofOfEntitlement(e.target.files?.[0] || null)}
```

Replace with:
```typescript
onChange={(e) => {
  const file = e.target.files?.[0] || null
  setProofOfEntitlement(file)
  setPendingDocuments(
    [proofOfId, file].filter((f): f is File => f !== null)
  )
}}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/pages/PlateHolders.tsx
git commit -m "feat: sync PlateHolders.tsx document uploads to CartContext"
```

---

## Task 9: End-to-End Smoke Test

- [ ] **Step 1: Ensure all env vars are set in `.env`**

Open `.env` and confirm these five have real values (not empty):
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RESEND_API_KEY=re_xxxxxxxxx
SHOP_OWNER_EMAIL=you@yourdomain.com
```

- [ ] **Step 2: Start the dev server with Vercel CLI**

```bash
vercel dev
```

This starts both the Vite frontend and the `/api` functions on one port (default 3000).

- [ ] **Step 3: Navigate to `/checkout` and complete the flow**

1. Go to `http://localhost:3000/checkout`
2. Step 1 — enter a valid UK registration (e.g. `AB12 CDE`), select "Road Legal"
3. Step 2 — fill in customer details; in the document upload section, attach any small PDF or JPG (under 10 MB)
4. Step 3 — fill in dummy card details, accept terms, click PAY
5. Expected: brief loading state → confirmation screen (Step 4)

- [ ] **Step 4: Verify Cloudinary**

Log in to cloudinary.com → Media Library → folder `pnp-documents/`. Confirm the uploaded file appears.

- [ ] **Step 5: Verify email**

Check the inbox for `SHOP_OWNER_EMAIL`. Confirm an email arrived with subject `New PNP Order — AB12 CDE — APX-...` and a clickable document link.

- [ ] **Step 6: Verify Shopify cart attributes (if Shopify is configured)**

If `VITE_SHOPIFY_STORE_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` are set and a cart was created during the flow, log in to Shopify admin → Orders (or Drafts) and confirm `document_1_url` appears as a cart attribute.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: DVLA document upload — Cloudinary storage, Shopify cart attributes, Resend email"
```

---

## Production Checklist (before deploying to Vercel)

- [ ] Add all five new env vars to the Vercel project dashboard (Settings → Environment Variables)
- [ ] Verify your sending domain in the Resend dashboard and update the `from` address in `api/notify-order.ts` from `onboarding@resend.dev` to `orders@yourdomain.com`
- [ ] Run `vercel --prod` or push to the connected Git branch to deploy
