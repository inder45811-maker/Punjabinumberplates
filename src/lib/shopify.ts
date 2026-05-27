/**
 * Shopify Storefront API GraphQL client
 * Uses the Storefront API to manage carts, line items, and checkout.
 *
 * Required env vars:
 *   VITE_SHOPIFY_STORE_DOMAIN
 *   VITE_SHOPIFY_STOREFRONT_TOKEN
 */

const DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN
const API_URL = `https://${DOMAIN}/api/2024-04/graphql.json`

/* ─── GraphQL fetch helper ─── */
async function storefront<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
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

  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors.map((e: any) => e.message).join(', '))
  }
  return json.data as T
}

/* ─── Types ─── */
export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      featuredImage?: { url: string }
    }
  }
  attributes: { key: string; value: string }[]
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

/* ─── Cart operations ─── */

export async function createCart(lines: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[]): Promise<Cart> {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
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
  const data = await storefront<{ cartCreate: { cart: Cart; userErrors: any[] } }>(query, {
    input: { lines },
  })

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartCreate.cart
}

export async function addCartLines(cartId: string, lines: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[]): Promise<Cart> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
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
  const data = await storefront<{ cartLinesAdd: { cart: Cart; userErrors: any[] } }>(query, {
    cartId,
    lines,
  })

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartLinesAdd.cart
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
  const data = await storefront<{ cartLinesRemove: { cart: Cart; userErrors: any[] } }>(query, {
    cartId,
    lineIds,
  })

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartLinesRemove.cart
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
  const data = await storefront<{ cartLinesUpdate: { cart: Cart; userErrors: any[] } }>(query, {
    cartId,
    lines,
  })

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartLinesUpdate.cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
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
    }
  `
  const data = await storefront<{ cart: Cart | null }>(query, { cartId })
  return data.cart
}

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
