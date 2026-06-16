import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { Attribute, Cart } from '../lib/shopify'
import { createCart, addCartLines, removeCartLines, updateCartLines, getCart } from '../lib/shopify'

/* ─── Types ─── */
interface CartItem {
  merchandiseId: string
  quantity: number
  attributes?: Attribute[]
}

export interface PendingDocuments {
  proofOfId: File | null
  proofOfEntitlement: File | null
}

interface CartContextValue {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  error: string | null
  openCart: () => void
  closeCart: () => void
  addToCart: (item: CartItem | CartItem[]) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  clearError: () => void
  pendingDocuments: PendingDocuments
  setPendingDocuments: (documents: PendingDocuments) => void
}

/* ─── Context ─── */
const CartContext = createContext<CartContextValue | undefined>(undefined)

const CART_ID_KEY = 'pnp-cart-id'
const EMPTY_PENDING_DOCUMENTS: PendingDocuments = {
  proofOfId: null,
  proofOfEntitlement: null,
}

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback
}

function normalizedAttributes(attributes: Attribute[] = []) {
  return attributes
    .filter((attribute) => attribute.value)
    .map((attribute) => `${attribute.key.toLowerCase()}=${attribute.value}`)
    .sort()
    .join('|')
}

function lineMatchesItem(line: Cart['lines']['nodes'][number], item: CartItem) {
  return (
    line.merchandise.id === item.merchandiseId &&
    normalizedAttributes(line.attributes) === normalizedAttributes(item.attributes)
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocuments>(EMPTY_PENDING_DOCUMENTS)
  const initialized = useRef(false)

  /* ─── Hydrate cart from localStorage on mount ─── */
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const savedId = localStorage.getItem(CART_ID_KEY)
    if (savedId) {
      setIsLoading(true)
      getCart(savedId)
        .then((c) => {
          if (c) setCart(c)
          else localStorage.removeItem(CART_ID_KEY)
        })
        .catch((err) => {
          console.error('Failed to load cart:', err)
          localStorage.removeItem(CART_ID_KEY)
        })
        .finally(() => setIsLoading(false))
    }
  }, [])

  const persistCart = useCallback((c: Cart) => {
    setCart(c)
    localStorage.setItem(CART_ID_KEY, c.id)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const clearError = useCallback(() => setError(null), [])

  const addToCart = useCallback(
    async (input: CartItem | CartItem[]) => {
      const items = Array.isArray(input) ? input : [input]
      if (items.length === 0) return
      setIsLoading(true)
      setError(null)
      try {
        if (!cart) {
          persistCart(await createCart(items))
        } else if (items.length === 1) {
          // Single custom item: merge into an identical existing line if present.
          const item = items[0]
          const existingLine = cart.lines.nodes.find((line) => lineMatchesItem(line, item))
          const updated = existingLine
            ? await updateCartLines(cart.id, [{ id: existingLine.id, quantity: item.quantity }])
            : await addCartLines(cart.id, [item])
          persistCart(updated)
        } else {
          // Main item plus add-ons: add all lines together in one request.
          persistCart(await addCartLines(cart.id, items))
        }
        setIsOpen(true)
      } catch (err: unknown) {
        setError(errorMessage(err, 'Failed to add item to cart'))
        console.error(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [cart, persistCart]
  )

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart) return
      setIsLoading(true)
      setError(null)
      try {
        const updated = await removeCartLines(cart.id, [lineId])
        persistCart(updated)
      } catch (err: unknown) {
        setError(errorMessage(err, 'Failed to remove item'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [cart, persistCart]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return
      if (quantity < 1) {
        await removeLine(lineId)
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const updated = await updateCartLines(cart.id, [{ id: lineId, quantity }])
        persistCart(updated)
      } catch (err: unknown) {
        setError(errorMessage(err, 'Failed to update quantity'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    },
    [cart, persistCart, removeLine]
  )

  const value: CartContextValue = {
    cart,
    isOpen,
    isLoading,
    error,
    openCart,
    closeCart,
    addToCart,
    removeLine,
    updateQuantity,
    clearError,
    pendingDocuments,
    setPendingDocuments,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
