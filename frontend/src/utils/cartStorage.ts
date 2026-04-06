import type { CartLine } from '../types/cartLine'

const STORAGE_KEY = 'ola-coast-cart-lines-v1'

const CATEGORY_SLUGS = new Set([
  'burritos',
  'tacos',
  'bowls',
  'drinks',
])

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === 'object'
}

/** Lenient check so saved JSON round-trips reliably after refresh. */
function isCartLine(x: unknown): x is CartLine {
  if (!isRecord(x)) return false

  const lineId = x.lineId
  const productId = x.productId
  const name = x.name
  const image = x.image
  const category = x.category
  const quantity = x.quantity
  const basePrice = x.basePrice
  const extrasCharge = x.extrasCharge
  const customization = x.customization

  if (typeof lineId !== 'string' || lineId.length === 0) return false
  if (typeof productId !== 'string') return false
  if (typeof name !== 'string') return false
  if (typeof image !== 'string') return false
  if (typeof category !== 'string' || !CATEGORY_SLUGS.has(category))
    return false

  const qtyNum =
    typeof quantity === 'number'
      ? quantity
      : typeof quantity === 'string'
        ? Number(quantity)
        : NaN
  if (!Number.isFinite(qtyNum) || qtyNum < 1) return false

  const baseNum =
    typeof basePrice === 'number'
      ? basePrice
      : typeof basePrice === 'string'
        ? Number(basePrice)
        : NaN
  if (!Number.isFinite(baseNum)) return false

  const extraNum =
    typeof extrasCharge === 'number'
      ? extrasCharge
      : typeof extrasCharge === 'string'
        ? Number(extrasCharge)
        : NaN
  if (!Number.isFinite(extraNum)) return false

  if (!isRecord(customization)) return false
  if (typeof customization.protein !== 'string') return false
  if (typeof customization.rice !== 'string') return false
  if (typeof customization.beans !== 'string') return false
  if (!Array.isArray(customization.toppings)) return false
  if (!isRecord(customization.extras)) return false
  if (typeof customization.extras.cheese !== 'boolean') return false
  if (typeof customization.extras.guac !== 'boolean') return false

  return true
}

/** Normalize numbers after JSON parse (e.g. string decimals from some APIs). */
function normalizeLine(raw: CartLine): CartLine {
  return {
    ...raw,
    quantity: Number(raw.quantity),
    basePrice: Number(raw.basePrice),
    extrasCharge: Number(raw.extrasCharge),
  }
}

export function loadCartLines(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCartLine).map(normalizeLine)
  } catch {
    return []
  }
}

export function saveCartLines(lines: CartLine[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    /* quota / private mode */
  }
}
