export type CategorySlug =
  | 'number-plates'
  | 'plate-holders'
  | 'keyrings'
  | 'accessories'
  | 'car-hangings'
  | 'house-plates'

export interface CategoryDefinition {
  slug: CategorySlug
  label: string
  shortLabel: string
  description: string
  collectionHandles: string[]
  seoTitle: string
  seoDescription: string
  /** Local image that overrides the Shopify preview on the category tile. */
  previewImage?: string
}

export const categories = [
  {
    slug: 'number-plates',
    label: 'Number Plates',
    shortLabel: 'Plates',
    description: 'Road legal and show plate styles pulled live from Shopify.',
    collectionHandles: ['road-legal-number-plates', 'showplates'],
    seoTitle: 'Custom 3D Gel & 4D Number Plates | The Number Plate Shop',
    seoDescription:
      'Shop custom road legal and show number plates from The Number Plate Shop with live Shopify prices and secure checkout.',
  },
  {
    slug: 'plate-holders',
    label: 'Luxury Plate Holders & 3D Gel Holders',
    shortLabel: 'Plate Holders',
    description: 'Premium 3D gel plate holders — one for £45 or two for £85.',
    collectionHandles: ['plate-holders'],
    seoTitle: 'Luxury Plate Holders & 3D Gel Holders | The Number Plate Shop',
    seoDescription:
      'Browse luxury plate holders and 3D gel holders with real-time Shopify pricing from The Number Plate Shop.',
    previewImage: '/plate-holders/bhandal-holders.jpg',
  },
  {
    slug: 'keyrings',
    label: 'Keyrings',
    shortLabel: 'Keyrings',
    description: 'Personalised keyrings will appear here as soon as they are live in Shopify.',
    collectionHandles: ['keyrings'],
    seoTitle: 'Custom Number Plate Keyrings | The Number Plate Shop',
    seoDescription:
      'Personalised number plate keyrings from The Number Plate Shop, powered by live Shopify catalogue data.',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    shortLabel: 'Accessories',
    description: 'Badges, decals, and finishing details for custom builds.',
    collectionHandles: ['accessories'],
    seoTitle: 'Number Plate Accessories & Badges | The Number Plate Shop',
    seoDescription:
      'Shop number plate accessories, symbols, badges, and decals from The Number Plate Shop.',
  },
  {
    slug: 'car-hangings',
    label: 'Car Hangings',
    shortLabel: 'Car Hangings',
    description: 'Interior hanging accessories synced from the Shopify catalogue.',
    collectionHandles: ['car-hangings'],
    seoTitle: 'Custom Car Hangings | The Number Plate Shop',
    seoDescription:
      'Browse custom car hangings from The Number Plate Shop with live availability from Shopify.',
  },
  {
    slug: 'house-plates',
    label: 'House Plates',
    shortLabel: 'House Plates',
    description: 'Punjabi house signs and address plates with premium finishes.',
    collectionHandles: ['4d-laser-cut-house-signs'],
    seoTitle: 'Punjabi House Plates & 4D House Signs | The Number Plate Shop',
    seoDescription:
      'Shop Punjabi house plates, Sikh Khanda signs, and 4D laser cut house signs from The Number Plate Shop.',
  },
] satisfies CategoryDefinition[]

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

export function isNumberPlateCategory(slug: string | undefined) {
  return slug === 'number-plates'
}

export type ProductKind = 'plate' | 'holder' | 'house-sign' | 'accessory'

export function productKindFor(product: { title?: string; productType?: string } | null): ProductKind {
  const text = `${product?.title ?? ''} ${product?.productType ?? ''}`.toLowerCase()
  if (/house[\s-]?(sign|plate)/.test(text)) return 'house-sign'
  // Accessories (badges, decals, stickers, keyrings, car hangings, fresheners,
  // phone holders) never use plate registration / plate-use / configuration.
  if (/\b(badges?|decals?|stickers?|key ?rings?|hangings?|fresheners?|symbols?|phones?)\b/.test(text)) {
    return 'accessory'
  }
  // A plate + holder bundle still contains road-legal plates, so it needs a
  // registration — keep it a plate even though "holder" appears in the title.
  if (/\bplates?\b/.test(text) && /(\bbundle\b|\+)/.test(text)) return 'plate'
  if (/\b(holders?|surrounds?)\b/.test(text)) return 'holder'
  if (/\bplates?\b/.test(text)) return 'plate'
  // Default to a simple accessory layout rather than wrongly showing plate
  // options on an unrecognised product.
  return 'accessory'
}

export function readableStyleFromProductTitle(title: string) {
  return title
    .replace(/\broad legal\b/gi, '')
    .replace(/\bnumber plates?\b/gi, '')
    .replace(/\bplates?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}
