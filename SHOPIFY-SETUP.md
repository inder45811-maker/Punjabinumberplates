# Shopify admin tasks (required to finish pricing & add-ons)

The storefront code is built and deployed. A few things can **only** be set in
Shopify admin because prices and paid extras are charged through native Shopify
checkout — the site reads them back live, so once you make these changes they
appear automatically with no further code work.

## 1. Plate prices — £25 for a pair, £15 for a single

The merchant's rule: **£25 front + rear, £15 for a single plate.**

Current state in Shopify (checked 16 Jun 2026):

- **STANDARD NUMBER PLATES** already has the option
  `AMOUNT OF 2D PRINTED PLATES` → `FRONT AND REAR` / `FRONT ONLY` / `REAR ONLY`,
  but **all three variants are priced £25**. Set `FRONT ONLY` and `REAR ONLY`
  to **£15** (leave `FRONT AND REAR` at £25).
- **3D GEL / 4D GEL / other plate products** only have a single `Default Title`
  variant (one price). To offer the pair/single split, add the same
  **`Amount` option** (Front and rear / Front only / Rear only) to each plate
  product and price the variants £25 / £15 (or per-style equivalent).

The builder shows whichever option Shopify provides and updates the price as the
shopper switches — so as soon as the £15 single variants exist, they work.

## 2. Sticky pads add-on (£2.50)

Create a product so the £2.50 is actually charged:

- **Title:** Sticky pads
- **Handle:** `sticky-pads`  ← must match exactly
- **Price:** £2.50
- Stock: track as you like (or untracked / continue selling).

Offered on **number plates and holders**. Until this product exists, the toggle
still shows (at £2.50) and the choice is saved on the order as a
`_requested_extras` note so nothing is lost — but the customer isn't charged the
£2.50 automatically. Creating the product flips it to a real paid cart line.

## 3. UK badge add-ons (plates only)

Create two products (set whatever price you want — the site shows the Shopify
price):

| Title           | Handle (exact)   |
| --------------- | ---------------- |
| UK badge        | `uk-badge`       |
| 3D gel UK badge | `3d-gel-uk-badge`|

These appear only on number-plate builders. Same fallback behaviour as sticky
pads until the products exist.

## 4. £45 / £85 luxury gel holders (from the previous round — still outstanding)

Create a holders product with two variants: **One — £45**, **Two — £85**, and add
it to the `plate-holders` collection. The storefront renders it photo-first
automatically.

---

### How add-ons are wired (for reference)

Add-on handles live in [`src/lib/addons.ts`](src/lib/addons.ts). To add, rename,
re-price, or change which builders show an add-on, edit that file — `scope` is
`['plate']`, `['holder']`, or both. No other code changes needed.
