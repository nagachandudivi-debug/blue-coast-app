/**
 * CartContext — global shopping cart (lines, quantities, subtotal).
 * Lines persist via saveCartLines() inside state updaters (never clobber storage on mount).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { MenuCategoryId } from '../data/menu'
import type { CartLine } from '../types/cartLine'
import { loadCartLines, saveCartLines } from '../utils/cartStorage'
import { calculateTotals } from '../utils/orderTotals'
import {
  drinkCustomization,
  customizationKey,
  extraCostForCustomization,
  type CartCustomization,
} from './cartTypes'

export type { CartCustomization }
export type { CartLine } from '../types/cartLine'

export type CustomerInfo = {
  name: string
  phone: string
  orderType: 'pickup' | 'dine-in'
}

export type CompletedOrder = {
  orderId: string
  lines: CartLine[]
  customer: CustomerInfo
  subtotal: number
  discount: number
  tipPercent: number
  tipAmount: number
  total: number
  placedAtIso: string
}

type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  cartToast: string | null
  checkoutCustomer: CustomerInfo | null
  completedOrder: CompletedOrder | null
  addToCart: (
    product: {
      id: string
      name: string
      image: string
      category: MenuCategoryId
      price: number
      customizable: boolean
    },
    customization: CartCustomization,
    quantity: number,
  ) => void
  updateLineQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  setCheckoutCustomer: (info: CustomerInfo | null) => void
  /** Returns true only when an order was actually placed (cart had lines and customer). */
  placeOrder: (tipPercent: number) => boolean
  clearCompletedOrder: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

function lineUnitPrice(line: CartLine): number {
  return line.basePrice + line.extrasCharge
}

function formatMoney(n: number): string {
  return n.toFixed(2)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCartLines())
  const [cartToast, setCartToast] = useState<string | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [checkoutCustomer, setCheckoutCustomer] = useState<CustomerInfo | null>(
    null,
  )
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(
    null,
  )

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const showAddedToast = useCallback((productName: string, quantity: number) => {
    const msg =
      quantity > 1
        ? `Added ${quantity}× ${productName} to cart`
        : `Added to cart — ${productName}`
    setCartToast(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setCartToast(null)
      toastTimerRef.current = null
    }, 2800)
  }, [])

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, line) => sum + lineUnitPrice(line) * line.quantity,
        0,
      ),
    [lines],
  )

  const itemCount = useMemo(
    () => lines.reduce((n, line) => n + line.quantity, 0),
    [lines],
  )

  const addToCart = useCallback(
    (
      product: {
        id: string
        name: string
        image: string
        category: MenuCategoryId
        price: number
        customizable: boolean
      },
      customization: CartCustomization,
      quantity: number,
    ) => {
      const resolved = product.customizable
        ? customization
        : drinkCustomization()
      const extras = extraCostForCustomization(resolved)
      const key = customizationKey(resolved)

      setLines((prev) => {
        const idx = prev.findIndex(
          (l) =>
            l.productId === product.id &&
            customizationKey(l.customization) === key,
        )
        let next: CartLine[]
        if (idx !== -1) {
          next = prev.map((l, i) =>
            i === idx ? { ...l, quantity: l.quantity + quantity } : l,
          )
        } else {
          const line: CartLine = {
            lineId: crypto.randomUUID(),
            productId: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            quantity,
            basePrice: product.price,
            customization: resolved,
            extrasCharge: extras,
          }
          next = [...prev, line]
        }
        saveCartLines(next)
        return next
      })

      showAddedToast(product.name, quantity)
    },
    [showAddedToast],
  )

  const updateLineQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) => {
      let next: CartLine[]
      if (quantity < 1) {
        next = prev.filter((l) => l.lineId !== lineId)
      } else {
        next = prev.map((l) =>
          l.lineId === lineId ? { ...l, quantity } : l,
        )
      }
      saveCartLines(next)
      return next
    })
  }, [])

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.lineId !== lineId)
      saveCartLines(next)
      return next
    })
  }, [])

  const placeOrder = useCallback(
    (tipPercent: number): boolean => {
      if (lines.length === 0 || !checkoutCustomer) return false

      const sub = lines.reduce(
        (sum, line) => sum + lineUnitPrice(line) * line.quantity,
        0,
      )
      const subRounded = Number(formatMoney(sub))
      const { discount, tipAmount, total } = calculateTotals(
        subRounded,
        tipPercent,
      )
      const orderId = `OC-${Date.now().toString(36).toUpperCase()}`

      setCompletedOrder({
        orderId,
        lines: lines.map((l) => ({ ...l })),
        customer: { ...checkoutCustomer },
        subtotal: subRounded,
        discount,
        tipPercent,
        tipAmount,
        total,
        placedAtIso: new Date().toISOString(),
      })
      setCheckoutCustomer(null)
      setLines(() => {
        saveCartLines([])
        return []
      })
      return true
    },
    [lines, checkoutCustomer],
  )

  const clearCompletedOrder = useCallback(() => {
    setCompletedOrder(null)
  }, [])

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotal: Number(formatMoney(subtotal)),
      cartToast,
      checkoutCustomer,
      completedOrder,
      addToCart,
      updateLineQuantity,
      removeLine,
      setCheckoutCustomer,
      placeOrder,
      clearCompletedOrder,
    }),
    [
      lines,
      itemCount,
      subtotal,
      cartToast,
      checkoutCustomer,
      completedOrder,
      addToCart,
      updateLineQuantity,
      removeLine,
      placeOrder,
      clearCompletedOrder,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export { drinkCustomization } from './cartTypes'
export { defaultCustomization } from './cartTypes'
export const TOPPING_OPTIONS = [
  'Lettuce',
  'Pico de gallo',
  'Sour cream',
  'Corn salsa',
  'Jalapeños',
  'Cilantro',
] as const
