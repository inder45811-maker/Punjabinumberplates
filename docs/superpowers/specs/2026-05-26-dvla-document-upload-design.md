# DVLA Document Upload — Design Spec

**Date:** 2026-05-26  
**Status:** Approved  
**Scope:** Wire up the existing document upload UI so files are stored in Cloudinary, linked to the Shopify order via cart attributes, and emailed to the shop owner via Resend.

---

## 1. Problem Statement

The site has document upload fields in three places (`Product.tsx`, `PlateHolders.tsx`, `Checkout.tsx`) but none of them transmit data anywhere. Files sit in browser memory and are discarded. UK law requires DVLA compliance documents to be collected and retained.

---

## 2. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Hosting | Vercel | Supports `/api` serverless functions; GitHub Pages cannot |
| File storage | Cloudinary | Free tier (25 GB), user already agreed, zero AWS setup |
| Email service | Resend | 3,000 free emails/month, simple API |
| Upload timing | On submit (Approach B) | Simpler; no orphan uploads |
| Email recipient | Shop owner only | Customer sees confirmation screen; owner reviews docs |

---

## 3. Architecture

```
Customer fills checkout → clicks Place Order
        │
        ▼
[Checkout.tsx handlePlaceOrder()]
        │
        ├─ 1. POST /api/upload-document  (one call per file)
        │       └─► Cloudinary  →  returns { url, publicId }
        │
        ├─ 2. cartAttributesUpdate (Shopify Storefront API)
        │       └─► stamps proof_of_id_url + proof_of_entitlement_url onto the cart
        │
        └─ 3. POST /api/notify-order  (Resend)
                └─► email to SHOP_OWNER_EMAIL with customer details + doc links
```

No API keys touch the browser. Both server functions run in Vercel's Node.js runtime.

---

## 4. Serverless Functions

### `api/upload-document.ts`

- **Method:** `POST`
- **Body:** `application/json` — `{ fileName: string, fileType: string, fileData: string /* base64 */ }`
- **Validation:**
  - Allowed types: `application/pdf`, `image/jpeg`, `image/png`
  - Max size: 10 MB (decoded base64)
- **Action:** Upload to Cloudinary folder `pnp-documents/` with public ID `pnp-{timestamp}-{sanitised-filename}`
- **Response:** `{ url: string, publicId: string }`
- **Error:** `{ error: string }` with appropriate HTTP status

### `api/notify-order.ts`

- **Method:** `POST`
- **Body:** `application/json`
  ```ts
  {
    orderRef: string
    customerName: string
    phone: string
    plateText: string
    deliveryMethod: 'standard' | 'express'
    documents: Array<{ label: string; fileName: string; url: string }>
  }
  ```
- **Action:** Send HTML email via Resend to `SHOP_OWNER_EMAIL`
- **Response:** `{ success: true }`
- **Error:** `{ error: string }` with appropriate HTTP status

---

## 5. Email Format

```
Subject: New PNP Order — {plateText} — {orderRef}

Customer:   {customerName}
Phone:      {phone}
Plate text: {plateText}
Delivery:   {deliveryMethod}

Documents:
  • Proof of ID:          [View file →]  ({fileName})
  • Proof of Entitlement: [View file →]  ({fileName})

Cloudinary links are valid indefinitely. Delete from Cloudinary once processed.
```

Plain HTML — no React Email dependency.

---

## 6. Frontend Changes

### `src/lib/shopify.ts`

Add `cartAttributesUpdate(cartId: string, attributes: { key: string; value: string }[])` — thin wrapper around the existing `storefront()` helper using the `cartAttributesUpdate` Storefront API mutation.

### `src/pages/Checkout.tsx`

- Change `uploadedFiles` state: `string[]` → `File[]`
- Update `handleFileUpload` to store `File` objects (not just names)
- `handlePlaceOrder` becomes `async`:
  1. Call `POST /api/upload-document` for each `File` (sequentially)
  2. Call `cartAttributesUpdate` with the returned URLs (if a Shopify cart ID exists in `CartContext`; skip silently if not — docs are stored regardless)
  3. Call `POST /api/notify-order`
  4. On success: generate order ref, `setStep(4)`
  5. On any failure: show inline error message, keep user on step 3

### `src/context/CartContext.tsx`

Add `pendingDocuments: File[]` and `setPendingDocuments` to the cart context so `Product.tsx` and `PlateHolders.tsx` can store their selected files before the user reaches `Checkout.tsx`. `Checkout.tsx` merges `pendingDocuments` with its own local uploads at submit time.

### `src/pages/Product.tsx` and `src/pages/PlateHolders.tsx`

Change `setProofOfId` / `setProofOfEntitlement` to also write into `CartContext.pendingDocuments` when files are selected. No upload happens at this point.

---

## 7. Environment Variables

| Variable | Used in |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | `api/upload-document.ts` |
| `CLOUDINARY_API_KEY` | `api/upload-document.ts` |
| `CLOUDINARY_API_SECRET` | `api/upload-document.ts` |
| `RESEND_API_KEY` | `api/notify-order.ts` |
| `SHOP_OWNER_EMAIL` | `api/notify-order.ts` |

Add to `.env` (local) and Vercel dashboard (production). The existing `VITE_` prefixed vars remain unchanged.

---

## 8. New Dependencies

| Package | Purpose |
|---|---|
| `cloudinary` | Cloudinary Node.js SDK (server only) |
| `resend` | Resend email SDK (server only) |

No new frontend dependencies.

---

## 9. Error Handling

- File too large or wrong type: API returns 400, frontend shows "File must be a PDF or image under 10 MB"
- Cloudinary upload fails: API returns 500, frontend shows "Upload failed — please try again"
- Resend fails: log the error server-side but do NOT block the order completion (email is a notification, not a gate)
- Shopify cart attributes fail: log + continue (documents are stored in Cloudinary regardless)

---

## 10. Out of Scope

- Customer-facing confirmation email (just shop owner notification for now)
- Shopify webhook after payment (would require Shopify Admin API / app setup)
- Automatic Cloudinary deletion after a retention period
- Document re-upload / replacement after order placed
