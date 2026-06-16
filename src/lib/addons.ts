import type { ProductKind } from './catalog'

/**
 * Optional paid extras offered inside the plate/holder builder.
 *
 * Each add-on maps to a real Shopify product by `handle` so that its price is
 * charged through native Shopify checkout. The merchant sets the final price in
 * Shopify; the builder reads it back via the Storefront API.
 *
 * If a Shopify product for a handle does not exist yet, the toggle still renders
 * (using `fallbackPrice` for display) and the customer's choice is recorded as a
 * line attribute on the main item so the order still captures the request. The
 * moment the matching Shopify product is created, the add-on becomes a real,
 * separately-charged cart line automatically — no code change needed.
 *
 * To activate paid add-ons, create these products in Shopify admin (any
 * collection) with these exact handles:
 *   - `sticky-pads`          → Sticky pads (e.g. £2.50)
 *   - `uk-badge`             → UK badge (price as required)
 *   - `3d-gel-uk-badge`      → 3D gel UK badge (price as required)
 */
export interface AddonDefinition {
  key: string
  /** Shopify product handle used to resolve the variant + live price. */
  handle: string
  label: string
  description: string
  /** Product kinds this add-on is offered on. */
  scope: ProductKind[]
  /** Display price used only until the Shopify product exists. */
  fallbackPrice?: string
}

export const productAddons: AddonDefinition[] = [
  {
    key: 'sticky-pads',
    handle: 'sticky-pads',
    label: 'Sticky pads',
    description: 'Pre-applied heavy-duty sticky pads for fitting without drilling.',
    scope: ['plate', 'holder'],
    fallbackPrice: '2.50',
  },
  {
    key: 'uk-badge',
    handle: 'uk-badge',
    label: 'UK badge',
    description: 'Add a UK country identifier badge to your plates.',
    scope: ['plate'],
  },
  {
    key: '3d-gel-uk-badge',
    handle: '3d-gel-uk-badge',
    label: '3D gel UK badge',
    description: 'Domed 3D gel UK country identifier badge.',
    scope: ['plate'],
  },
]

export function addonsForKind(kind: ProductKind) {
  return productAddons.filter((addon) => addon.scope.includes(kind))
}
