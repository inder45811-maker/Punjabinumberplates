/**
 * Shopify Storefront API GraphQL client.
 *
 * Required env vars:
 *   VITE_SHOPIFY_STORE_DOMAIN
 *
 * Optional env vars:
 *   VITE_SHOPIFY_STOREFRONT_TOKEN
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_VERSION = '2026-04'
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
