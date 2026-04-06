/** Spend threshold (USD) for the automatic $5 promo. */
export const PROMO_SUBTOTAL_MIN = 50

/** Fixed discount amount (USD) when subtotal meets the threshold. */
export const PROMO_DISCOUNT_AMOUNT = 5

/** Shown when the promo discount applies. */
export const DISCOUNT_APPLIED_MESSAGE = `You got $${PROMO_DISCOUNT_AMOUNT} off with a purchase of $${PROMO_SUBTOTAL_MIN} or more.`

export type OrderTotalsBreakdown = {
  subtotal: number
  discount: number
  tipAmount: number
  /** subtotal + tipAmount - discount */
  total: number
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Central totals for cart, checkout, payment, and completed orders.
 * total = subtotal + tip - discount; discount is $5 when subtotal >= $50.
 */
export function calculateTotals(
  subtotalInput: number,
  tipPercent: number,
): OrderTotalsBreakdown {
  const subtotal = roundMoney(subtotalInput)
  const discount =
    subtotal >= PROMO_SUBTOTAL_MIN ? PROMO_DISCOUNT_AMOUNT : 0
  const tipAmount = roundMoney(subtotal * (tipPercent / 100))
  const total = roundMoney(subtotal + tipAmount - discount)
  return { subtotal, discount, tipAmount, total }
}
