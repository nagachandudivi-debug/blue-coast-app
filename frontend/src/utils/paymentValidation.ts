/** Client-side demo validation for the payment form (no real gateway). */

export function stripDigits(s: string): string {
  return s.replace(/\D/g, '')
}

/** True if value contains anything other than digits and spaces. */
export function hasNonDigitSpaceCardChars(value: string): boolean {
  const s = value ?? ''
  if (s === '') return false
  return /[^\d\s]/.test(s)
}

/** Format up to 16 digits as "1234 5678 9012 3456" */
export function formatCardNumber(digits: string): string {
  const d = digits.slice(0, 16)
  const parts: string[] = []
  for (let i = 0; i < d.length; i += 4) {
    parts.push(d.slice(i, i + 4))
  }
  return parts.join(' ')
}

export function cardDigitsFromInput(value: string): string {
  return stripDigits(value).slice(0, 16)
}

const NAME_ERROR = 'Enter the name on the card'
const CARD_ERROR =
  'Unable to read the card. Enter a valid 16-digit card number.'
const EXPIRY_ERROR = 'Enter a valid expiry date.'
const CVC_ERROR = 'Enter a valid 3-digit security code.'

export function validateCardholderName(name: string): string | null {
  const t = name.trim()
  if (t.length === 0) return NAME_ERROR
  if (t.length < 2) return NAME_ERROR
  return null
}

export function validateCardNumber(
  digits: string,
  displayValue: string,
): string | null {
  const display = displayValue ?? ''
  if (hasNonDigitSpaceCardChars(display)) return CARD_ERROR
  if (digits.length === 0 || digits.length !== 16) return CARD_ERROR
  return null
}

/** Format 4 digits as MM/YY */
export function formatExpiry(digits: string): string {
  const d = digits.slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

export function expiryDigitsFromInput(value: string): string {
  return stripDigits(value).slice(0, 4)
}

/** Last instant of expiry month (card valid through end of that month). */
function expiryIsNotPast(mm: number, yearTwoDigit: number): boolean {
  const fullYear = 2000 + yearTwoDigit
  const monthIndex = mm - 1
  const lastMs = new Date(
    fullYear,
    monthIndex + 1,
    0,
    23,
    59,
    59,
    999,
  ).getTime()
  return lastMs >= Date.now()
}

export function validateExpiry(digits: string): string | null {
  if (digits.length === 0) return EXPIRY_ERROR
  if (digits.length !== 4) return EXPIRY_ERROR

  const mm = parseInt(digits.slice(0, 2), 10)
  const yy = parseInt(digits.slice(2, 4), 10)

  if (Number.isNaN(mm) || Number.isNaN(yy)) return EXPIRY_ERROR
  if (mm < 1 || mm > 12) return EXPIRY_ERROR
  if (!expiryIsNotPast(mm, yy)) return EXPIRY_ERROR

  return null
}

export function validateCvc(digits: string): string | null {
  if (digits.length === 0) return CVC_ERROR
  if (digits.length !== 3) return CVC_ERROR
  return null
}

export function cvcDigitsFromInput(value: string): string {
  return stripDigits(value).slice(0, 3)
}

export type PaymentFormDigits = {
  card: string
  expiry: string
  cvc: string
}

export function isPaymentFormValid(
  cardholderName: string,
  digits: PaymentFormDigits,
  cardDisplay: string,
): boolean {
  return (
    validateCardholderName(cardholderName) === null &&
    validateCardNumber(digits.card, cardDisplay) === null &&
    validateExpiry(digits.expiry) === null &&
    validateCvc(digits.cvc) === null
  )
}
