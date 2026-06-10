/**
 * Shopify Storefront API GraphQL client.
 *
 * Required env vars:
 *   VITE_SHOPIFY_STORE_DOMAIN
 *
 * Optional env vars:
 *   VITE_SHOPIFY_STOREFRONT_TOKEN
 *   VITE_SHOPIFY_API_VERSION
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2026-04'
const API_URL = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`

export interface Attribute {
  key: string
  value: string
}

export interface CartLineInput {
  merchandiseId: string
  quantity: number
  attributes?: Attribute[]
}

export interface CartLineUpdate {
  id: string
  quantity: number
}

export interface BuyerIdentityInput {
  email?: string
  phone?: string
  countryCode?: string
}

export interface MoneyV2 {
  amount: string
  currencyCode: string
}

export interface StorefrontImage {
  url: string
  altText?: string | null
  width?: number | null
  height?: number | null
}

export interface StorefrontSelectedOption {
  name: string
  value: string
}

export interface StorefrontVariant {
  id: string
  title: string
  sku?: string | null
  availableForSale: boolean
  quantityAvailable?: number | null
  selectedOptions: StorefrontSelectedOption[]
  price: MoneyV2
  compareAtPrice?: MoneyV2 | null
  image?: StorefrontImage | null
}

export interface StorefrontProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  availableForSale: boolean
  featuredImage?: StorefrontImage | null
  images: { nodes: StorefrontImage[] }
  options: { name: string; values: string[] }[]
  variants: { nodes: StorefrontVariant[] }
  seo?: { title?: string | null; description?: string | null } | null
}

export interface StorefrontCollection {
  id: string
  title: string
  handle: string
  description: string
  image?: StorefrontImage | null
  seo?: { title?: string | null; description?: string | null } | null
  products: { nodes: StorefrontProduct[] }
}

export interface StorefrontCollectionPreview {
  id: string
  title: string
  handle: string
  image?: StorefrontImage | null
  products: {
    nodes: {
      featuredImage?: StorefrontImage | null
      images: { nodes: StorefrontImage[] }
    }[]
  }
}

interface ShopifyGraphQLError {
  message: string
}

interface ShopifyUserError {
  field?: string[] | string | null
  message: string
}

interface StorefrontResponse<T> {
  data?: T
  errors?: ShopifyGraphQLError[]
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      handle: string
      featuredImage?: { url: string } | null
    }
  }
  attributes: Attribute[]
  cost: {
    totalAmount: { amount: string; currencyCode: string }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: { amount: string; currencyCode: string }
    totalAmount: { amount: string; currencyCode: string }
  }
  lines: { nodes: CartLine[] }
}

const CART_FRAGMENT = `
  fragment CartFields on Cart {
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
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              title
              handle
              featuredImage { url }
            }
          }
        }
        attributes { key value }
        cost { totalAmount { amount currencyCode } }
      }
    }
  }
`

const IMAGE_FIELDS = `
  url
  altText
  width
  height
`

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    featuredImage { ${IMAGE_FIELDS} }
    images(first: 12) {
      nodes { ${IMAGE_FIELDS} }
    }
    options {
      name
      values
    }
    variants(first: 100) {
      nodes {
        id
        title
        sku
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { ${IMAGE_FIELDS} }
      }
    }
    seo { title description }
  }
`

const COLLECTION_FRAGMENT = `
  ${PRODUCT_FRAGMENT}
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    image { ${IMAGE_FIELDS} }
    seo { title description }
    products(first: 50) {
      nodes { ...ProductFields }
    }
  }
`

async function storefront<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!DOMAIN) {
    throw new Error('Shopify Storefront API is not configured')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (TOKEN) {
    headers['X-Shopify-Storefront-Access-Token'] = TOKEN
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status} ${res.statusText}`)
  }

  const json = (await res.json()) as StorefrontResponse<T>
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(', '))
  }
  if (!json.data) {
    throw new Error('Shopify API returned an empty response')
  }
  return json.data
}

function assertNoUserErrors(errors: ShopifyUserError[]) {
  if (errors.length) {
    throw new Error(errors.map((e) => e.message).join(', '))
  }
}

export async function createCart(lines: CartLineInput[]): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartCreate: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { input: { lines } })

  assertNoUserErrors(data.cartCreate.userErrors)
  if (!data.cartCreate.cart) throw new Error('Shopify did not return a cart')
  return data.cartCreate.cart
}

export async function getCollectionByHandle(
  handle: string
): Promise<StorefrontCollection | null> {
  const query = `
    ${COLLECTION_FRAGMENT}
    query getCollectionByHandle($handle: String!) {
      collection(handle: $handle) { ...CollectionFields }
    }
  `
  const data = await storefront<{ collection: StorefrontCollection | null }>(query, {
    handle,
  })
  return data.collection
}

export async function getCollections(): Promise<StorefrontCollection[]> {
  const query = `
    ${COLLECTION_FRAGMENT}
    query getCollections {
      collections(first: 100) {
        nodes { ...CollectionFields }
      }
    }
  `
  const data = await storefront<{ collections: { nodes: StorefrontCollection[] } }>(query)
  return data.collections.nodes
}

export async function getCollectionsByHandles(
  handles: string[]
): Promise<StorefrontCollection[]> {
  if (!handles.length) return []
  const handleSet = new Set(handles)
  const collections = await getCollections()
  return collections.filter((collection) => handleSet.has(collection.handle))
}

export async function getCollectionPreviewsByHandles(
  handles: string[]
): Promise<StorefrontCollectionPreview[]> {
  if (!handles.length) return []
  const query = `
    query getCollectionPreviews {
      collections(first: 100) {
        nodes {
          id
          title
          handle
          image { ${IMAGE_FIELDS} }
          products(first: 1) {
            nodes {
              featuredImage { ${IMAGE_FIELDS} }
              images(first: 1) {
                nodes { ${IMAGE_FIELDS} }
              }
            }
          }
        }
      }
    }
  `
  const data = await storefront<{
    collections: { nodes: StorefrontCollectionPreview[] }
  }>(query)
  const handleSet = new Set(handles)
  return data.collections.nodes.filter((collection) => handleSet.has(collection.handle))
}

export async function getProductsByCollectionHandles(
  handles: string[]
): Promise<StorefrontProduct[]> {
  const collections = await Promise.all(handles.map((handle) => getCollectionByHandle(handle)))
  const seen = new Set<string>()
  return collections.flatMap((collection) => {
    if (!collection) return []
    return collection.products.nodes.filter((product) => {
      if (seen.has(product.id)) return false
      seen.add(product.id)
      return true
    })
  })
}

export async function getProductByHandle(
  handle: string
): Promise<StorefrontProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query getProductByHandle($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
  `
  const data = await storefront<{ product: StorefrontProduct | null }>(query, {
    handle,
  })
  return data.product
}

export function money(value: MoneyV2 | undefined | null) {
  if (!value) return ''
  const amount = Number.parseFloat(value.amount)
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: value.currencyCode || 'GBP',
  }).format(Number.isFinite(amount) ? amount : 0)
}

export function firstAvailableVariant(product: StorefrontProduct) {
  return (
    product.variants.nodes.find((variant) => variant.availableForSale) ??
    product.variants.nodes[0] ??
    null
  )
}

export function variantById(product: StorefrontProduct, variantId?: string | null) {
  if (!variantId) return null
  return product.variants.nodes.find((variant) => variant.id === variantId) ?? null
}

export function variantByOptions(
  product: StorefrontProduct,
  selectedOptions: Record<string, string>
) {
  return (
    product.variants.nodes.find((variant) =>
      variant.selectedOptions.every(
        (option) => selectedOptions[option.name] === option.value
      )
    ) ?? null
  )
}

export function imageUrl(
  image: StorefrontImage | undefined | null,
  options: { width?: number; height?: number; crop?: 'center' | 'top' | 'bottom' } = {}
) {
  if (!image?.url) return ''
  try {
    const url = new URL(image.url)
    if (options.width) url.searchParams.set('width', String(options.width))
    if (options.height) url.searchParams.set('height', String(options.height))
    if (options.crop) url.searchParams.set('crop', options.crop)
    url.searchParams.set('format', 'webp')
    return url.toString()
  } catch {
    return image.url
  }
}

export function productImage(product: StorefrontProduct, variant?: StorefrontVariant | null) {
  return variant?.image ?? product.featuredImage ?? product.images.nodes[0] ?? null
}

export function customLineAttributes(input: {
  registration?: string
  plateStyle?: string
  plateType?: string
  configuration?: string
  signText?: string
  writingColour?: string
  backgroundColour?: string
  notes?: string
  selectedOptions?: StorefrontSelectedOption[]
}) {
  const attrs: Attribute[] = []
  const registration = input.registration?.trim().toUpperCase()
  const signText = input.signText?.trim()
  const writingColour = input.writingColour?.trim()
  const backgroundColour = input.backgroundColour?.trim()
  const notes = input.notes?.trim()

  if (registration) attrs.push({ key: '_registration', value: registration })
  if (input.plateStyle) attrs.push({ key: '_plate_style', value: input.plateStyle })
  if (input.plateType) attrs.push({ key: '_plate_type', value: input.plateType })
  if (input.configuration) attrs.push({ key: '_configuration', value: input.configuration })
  if (signText) attrs.push({ key: '_sign_text', value: signText })
  if (writingColour) attrs.push({ key: '_writing_colour', value: writingColour })
  if (backgroundColour) attrs.push({ key: '_background_colour', value: backgroundColour })
  if (notes) attrs.push({ key: '_customer_notes', value: notes })

  input.selectedOptions?.forEach((option) => {
    if (option.name.toLowerCase() !== 'title') {
      attrs.push({ key: `_${option.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`, value: option.value })
    }
  })

  return attrs
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartLinesAdd: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { cartId, lines })

  assertNoUserErrors(data.cartLinesAdd.userErrors)
  if (!data.cartLinesAdd.cart) throw new Error('Shopify did not return a cart')
  return data.cartLinesAdd.cart
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartLinesRemove: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { cartId, lineIds })

  assertNoUserErrors(data.cartLinesRemove.userErrors)
  if (!data.cartLinesRemove.cart) throw new Error('Shopify did not return a cart')
  return data.cartLinesRemove.cart
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdate[]
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartLinesUpdate: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { cartId, lines })

  assertNoUserErrors(data.cartLinesUpdate.userErrors)
  if (!data.cartLinesUpdate.cart) throw new Error('Shopify did not return a cart')
  return data.cartLinesUpdate.cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    ${CART_FRAGMENT}
    query getCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `
  const data = await storefront<{ cart: Cart | null }>(query, { cartId })
  return data.cart
}

export async function cartAttributesUpdate(
  cartId: string,
  attributes: Attribute[]
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartAttributesUpdate: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { cartId, attributes })

  assertNoUserErrors(data.cartAttributesUpdate.userErrors)
  if (!data.cartAttributesUpdate.cart) throw new Error('Shopify did not return a cart')
  return data.cartAttributesUpdate.cart
}

export async function cartNoteUpdate(
  cartId: string,
  note: string
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartNoteUpdate($cartId: ID!, $note: String!) {
      cartNoteUpdate(cartId: $cartId, note: $note) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartNoteUpdate: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { cartId, note })

  assertNoUserErrors(data.cartNoteUpdate.userErrors)
  if (!data.cartNoteUpdate.cart) throw new Error('Shopify did not return a cart')
  return data.cartNoteUpdate.cart
}

export async function cartBuyerIdentityUpdate(
  cartId: string,
  buyerIdentity: BuyerIdentityInput
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
  `
  const data = await storefront<{
    cartBuyerIdentityUpdate: { cart: Cart | null; userErrors: ShopifyUserError[] }
  }>(query, { cartId, buyerIdentity })

  assertNoUserErrors(data.cartBuyerIdentityUpdate.userErrors)
  if (!data.cartBuyerIdentityUpdate.cart) {
    throw new Error('Shopify did not return a cart')
  }
  return data.cartBuyerIdentityUpdate.cart
}
