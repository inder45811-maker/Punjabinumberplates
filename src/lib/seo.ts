import { useEffect } from 'react'
import type { MoneyV2, StorefrontImage, StorefrontProduct, StorefrontVariant } from './shopify'

export const SITE_URL = 'https://www.punjabinumberplates.co.uk'
export const SITE_NAME = 'Punjabi Number Plates'

interface SeoInput {
  title: string
  description: string
  path?: string
  image?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.content = content
}

function setCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.rel = 'canonical'
    document.head.appendChild(tag)
  }
  tag.href = href
}

function setJsonLd(jsonLd?: SeoInput['jsonLd']) {
  const id = 'route-json-ld'
  document.getElementById(id)?.remove()
  if (!jsonLd) return

  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd)
  document.head.appendChild(script)
}

export function useSeo({ title, description, path = '/', image, jsonLd }: SeoInput) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path === '/' ? '/' : path}`
    const ogImage = image || `${SITE_URL}/pnp-collection-hero.webp`

    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setCanonical(canonical)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setJsonLd(jsonLd)
  }, [description, image, jsonLd, path, title])
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'GB',
      availableLanguage: ['en'],
    },
    sameAs: ['https://www.instagram.com/punjabinumberplates'],
  }
}

export function productSchema(input: {
  product: StorefrontProduct
  variant: StorefrontVariant | null
  image: StorefrontImage | null
}) {
  const price = input.variant?.price ?? ({ amount: '0', currencyCode: 'GBP' } satisfies MoneyV2)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.product.title,
    description: input.product.description,
    image: input.image?.url ? [input.image.url] : undefined,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: price.amount,
      priceCurrency: price.currencyCode || 'GBP',
      availability: input.variant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/builder/${input.product.handle}`,
    },
  }
}

export function productAlt(product: StorefrontProduct, variantLabel?: string) {
  const label = variantLabel && variantLabel !== 'Default Title' ? `${product.title} ${variantLabel}` : product.title
  return `${label} custom product preview from Punjabi Number Plates`
}
