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
}

export const categories = [
  {
    slug: 'number-plates',
    label: 'Number Plates',
    shortLabel: 'Plates',
    description: 'Road legal and show plate styles pulled live from Shopify.',
    collectionHandles: ['road-legal-number-plates', 'showplates'],
    seoTitle: 'Custom 3D Gel & 4D Number Plates | Punjabi Number Plates',
    seoDescription:
      'Shop custom road legal and show number plates from Punjabi Number Plates with live Shopify prices and secure checkout.',
  },
  {
    slug: 'plate-holders',
    label: 'Luxury Signature Plate Holders',
    shortLabel: 'Plate Holders',
    description: 'Premium surround and holder options for a sharper finish.',
    collectionHandles: ['plate-holders'],
    seoTitle: 'Premium Plate Holders & Luxury Surrounds | Punjabi Number Plates',
    seoDescription:
      'Browse luxury signature plate holders and surrounds with real-time Shopify pricing from Punjabi Number Plates.',
  },
  {
    slug: 'keyrings',
    label: 'Keyrings',
    shortLabel: 'Keyrings',
    description: 'Personalised keyrings will appear here as soon as they are live in Shopify.',
    collectionHandles: ['keyrings'],
    seoTitle: 'Custom Number Plate Keyrings | Punjabi Number Plates',
    seoDescription:
      'Personalised number plate keyrings from Punjabi Number Plates, powered by live Shopify catalogue data.',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    shortLabel: 'Accessories',
    description: 'Badges, decals, and finishing details for custom builds.',
    collectionHandles: ['accessories'],
    seoTitle: 'Number Plate Accessories & Badges | Punjabi Number Plates',
    seoDescription:
      'Shop number plate accessories, symbols, badges, and decals from Punjabi Number Plates.',
  },
  {
    slug: 'car-hangings',
    label: 'Car Hangings',
    shortLabel: 'Car Hangings',
    description: 'Interior hanging accessories synced from the Shopify catalogue.',
    collectionHandles: ['car-hangings'],
    seoTitle: 'Custom Car Hangings | Punjabi Number Plates',
    seoDescription:
      'Browse custom car hangings from Punjabi Number Plates with live availability from Shopify.',
  },
  {
    slug: 'house-plates',
    label: 'House Plates',
    shortLabel: 'House Plates',
    description: 'Punjabi house signs and address plates with premium finishes.',
    collectionHandles: ['4d-laser-cut-house-signs'],
    seoTitle: 'Punjabi House Plates & 4D House Signs | Punjabi Number Plates',
    seoDescription:
      'Shop Punjabi house plates, Sikh Khanda signs, and 4D laser cut house signs from Punjabi Number Plates.',
  },
] satisfies CategoryDefinition[]

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]))

export function isNumberPlateCategory(slug: string | undefined) {
  return slug === 'number-plates'
}

export function readableStyleFromProductTitle(title: string) {
  return title
    .replace(/\broad legal\b/gi, '')
    .replace(/\bnumber plates?\b/gi, '')
    .replace(/\bplates?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}
