/**
 * Shopify Variant ID Mapping
 * ==========================
 * Fetched from 3b4c31.myshopify.com Storefront API
 *
 * Plate products map by style. Each Shopify product is a single variant
 * (Default Title) — Front/Rear and Road Legal/Show Plate selections are
 * passed as line item attributes instead of variant options.
 */

/* ─── Plate Product Variants ─── */
export const PLATE_VARIANTS: Record<string, string> = {
  '4d-5mm': 'gid://shopify/ProductVariant/55999492555127', // 4D 5MM ROAD LEGAL PLATES — £45
  '4d-gel': 'gid://shopify/ProductVariant/47430180077890', // 4D GEL ROAD LEGAL PLATES — £55
  '3d-gel': 'gid://shopify/ProductVariant/47430166806850', // 3D GEL ROAD LEGAL PLATES — £35
  'ghost':  'gid://shopify/ProductVariant/47430183452994', // GHOST ROAD LEGAL PLATES — £70
}

/* ─── Keyring Product Variants ───
 * NOTE: No keyring products exist in Shopify yet.
 * When added, map the variant IDs here.
 */
export const KEYRING_VARIANTS: Record<string, string> = {
  '4d-5mm': '',
  '4d-gel': '',
  '3d-gel': '',
  'ghost': '',
}

/* ─── Plate Holder Product Variants ───
 * NOTE: No custom plate holder products exist in Shopify yet.
 * When added, map the variant IDs here.
 */
export const HOLDER_VARIANTS: Record<string, string> = {
  '4d-5mm': '',
  '4d-gel': '',
  '3d-gel': '',
  'ghost': '',
}

/* ─── Helper to build line item attributes from selections ─── */
export function buildPlateAttributes(
  reg: string,
  config: string,
  type: string,
  style: string,
  notes: string
) {
  const attrs: { key: string; value: string }[] = []
  if (reg.trim()) attrs.push({ key: 'Registration', value: reg.toUpperCase() })
  if (config) attrs.push({ key: 'Configuration', value: config.replace(/_/g, ' ').toUpperCase() })
  if (type) attrs.push({ key: 'Type', value: type.replace(/_/g, ' ').toUpperCase() })
  if (style) attrs.push({ key: 'Style', value: style.replace(/-/g, ' ').toUpperCase() })
  if (notes.trim()) attrs.push({ key: 'Notes', value: notes })
  return attrs
}

export function buildKeyringAttributes(
  reg: string,
  style: string,
  type: string,
  notes: string
) {
  const attrs: { key: string; value: string }[] = []
  if (reg.trim()) attrs.push({ key: 'Text', value: reg.toUpperCase() })
  if (style) attrs.push({ key: 'Style', value: style.replace(/-/g, ' ').toUpperCase() })
  if (type) attrs.push({ key: 'Type', value: type.replace(/_/g, ' ').toUpperCase() })
  if (notes.trim()) attrs.push({ key: 'Notes', value: notes })
  return attrs
}

export function buildHolderAttributes(
  reg: string,
  style: string,
  type: string,
  quantity: string,
  badge: string,
  sideText: string,
  notes: string
) {
  const attrs: { key: string; value: string }[] = []
  if (reg.trim()) attrs.push({ key: 'Registration', value: reg.toUpperCase() })
  if (style) attrs.push({ key: 'Plate Style', value: style.replace(/-/g, ' ').toUpperCase() })
  if (type) attrs.push({ key: 'Type', value: type.replace(/_/g, ' ').toUpperCase() })
  if (quantity) attrs.push({ key: 'Holder Qty', value: quantity.replace(/_/g, ' ').toUpperCase() })
  if (badge) attrs.push({ key: 'Badge', value: badge.replace(/_/g, ' ').toUpperCase() })
  if (sideText.trim()) attrs.push({ key: 'Side Text', value: sideText.toUpperCase() })
  if (notes.trim()) attrs.push({ key: 'Notes', value: notes })
  return attrs
}
