import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PromoBanner } from '../components/PromoBanner'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'
import { lineUnitTotal, summarizeLine } from '../utils/orderFormat'
import {
  DISCOUNT_APPLIED_MESSAGE,
  calculateTotals,
} from '../utils/orderTotals'
import {
  cardDigitsFromInput,
  cvcDigitsFromInput,
  expiryDigitsFromInput,
  formatCardNumber,
  formatExpiry,
  isPaymentFormValid,
  validateCardholderName,
  validateCardNumber,
  validateCvc,
  validateExpiry,
} from '../utils/paymentValidation'
import '../styles/flow.css'
import './PaymentPage.css'

const TIPS = [10, 15, 20] as const

type Touched = {
  name: boolean
  card: boolean
  expiry: boolean
  cvc: boolean
}

export function PaymentPage() {
  const navigate = useNavigate()
  const { lines, subtotal, checkoutCustomer, completedOrder, placeOrder } =
    useCart()
  /** True only on first paint — redirect to cart when /payment is opened with an empty cart. */
  const cartWasEmptyOnEnter = useRef(lines.length === 0)
  const [tipPercent, setTipPercent] = useState<number>(15)

  const [cardholderName, setCardholderName] = useState('')
  const [cardDisplay, setCardDisplay] = useState('')
  const [expiryDisplay, setExpiryDisplay] = useState('')
  const [cvcDisplay, setCvcDisplay] = useState('')

  const cardDigits = useMemo(() => cardDigitsFromInput(cardDisplay), [cardDisplay])
  const expiryDigits = useMemo(() => expiryDigitsFromInput(expiryDisplay), [expiryDisplay])
  const cvcDigits = useMemo(() => cvcDigitsFromInput(cvcDisplay), [cvcDisplay])

  const [touched, setTouched] = useState<Touched>({
    name: false,
    card: false,
    expiry: false,
    cvc: false,
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const nameError = validateCardholderName(cardholderName)
  const cardError = validateCardNumber(cardDigits, cardDisplay)
  const expiryError = validateExpiry(expiryDigits)
  const cvcError = validateCvc(cvcDigits)

  const showNameErr = (touched.name || submitAttempted) && nameError
  const showCardErr = (touched.card || submitAttempted) && cardError
  const showExpiryErr = (touched.expiry || submitAttempted) && expiryError
  const showCvcErr = (touched.cvc || submitAttempted) && cvcError

  const formValid = isPaymentFormValid(
    cardholderName,
    {
      card: cardDigits,
      expiry: expiryDigits,
      cvc: cvcDigits,
    },
    cardDisplay,
  )

  const totals = useMemo(
    () => calculateTotals(subtotal, tipPercent),
    [subtotal, tipPercent],
  )

  const summaryCustomer = checkoutCustomer ?? completedOrder?.customer

  if (cartWasEmptyOnEnter.current) {
    return <Navigate to="/cart" replace />
  }

  /* After a successful placeOrder, customer is cleared in the same update as completedOrder.
     Do not send the user to checkout (empty cart → /cart) during that transition. */
  if (!checkoutCustomer && !completedOrder) {
    return <Navigate to="/checkout" replace />
  }

  if (lines.length === 0) {
    return (
      <div className="payment-page">
        <h1 className="flow-page__title">Payment</h1>
        <p className="payment-page__sub">Blue Coast Burrito · Mt Juliet, TN</p>
        <PromoBanner variant="compact" />
        <p className="payment-page__mock">
          Your cart has no items. Add something from the menu to continue.
        </p>
        <Link to="/menu" className="payment-page__back">
          Back to menu
        </Link>
      </div>
    )
  }

  function handlePlaceOrder() {
    const nameErr = validateCardholderName(cardholderName)
    const cardErr = validateCardNumber(cardDigits, cardDisplay)
    const expiryErr = validateExpiry(expiryDigits)
    const cvcErr = validateCvc(cvcDigits)

    if (nameErr || cardErr || expiryErr || cvcErr) {
      setSubmitAttempted(true)
      return
    }

    const placed = placeOrder(tipPercent)
    if (placed) {
      navigate('/order-confirmation')
    }
  }

  function onCardChange(e: ChangeEvent<HTMLInputElement>) {
    const next = cardDigitsFromInput(e.target.value)
    setCardDisplay(formatCardNumber(next))
    setTouched((t) => ({ ...t, card: true }))
  }

  function onExpiryChange(e: ChangeEvent<HTMLInputElement>) {
    const next = expiryDigitsFromInput(e.target.value)
    setExpiryDisplay(formatExpiry(next))
    setTouched((t) => ({ ...t, expiry: true }))
  }

  function onCvcChange(e: ChangeEvent<HTMLInputElement>) {
    setCvcDisplay(cvcDigitsFromInput(e.target.value))
    setTouched((t) => ({ ...t, cvc: true }))
  }

  return (
    <div className="payment-page">
      <h1 className="flow-page__title">Payment</h1>
      <p className="payment-page__sub">Blue Coast Burrito · Mt Juliet, TN</p>
      <PromoBanner variant="compact" />
      <p className="payment-page__mock">
        Demo payment only — no card is charged.
      </p>

      <section className="payment-page__card" aria-label="Payment card">
        <h2 className="payment-page__h2">Card (demo)</h2>

        <div className="payment-page__field">
          <label className="payment-page__label" htmlFor="pay-name">
            Cardholder name
          </label>
          <input
            id="pay-name"
            className={`payment-page__input ${showNameErr ? 'payment-page__input--error' : ''}`}
            type="text"
            autoComplete="cc-name"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value)
              setTouched((t) => ({ ...t, name: true }))
            }}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="Name on card"
            aria-invalid={showNameErr ? true : undefined}
            aria-describedby={showNameErr ? 'pay-name-err' : undefined}
          />
          {showNameErr && (
            <p id="pay-name-err" className="payment-page__error" role="alert">
              {nameError}
            </p>
          )}
        </div>

        <div className="payment-page__field">
          <label className="payment-page__label" htmlFor="pay-card">
            Card number
          </label>
          <input
            id="pay-card"
            className={`payment-page__input ${showCardErr ? 'payment-page__input--error' : ''}`}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardDisplay}
            onChange={onCardChange}
            onBlur={() => setTouched((t) => ({ ...t, card: true }))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            aria-invalid={showCardErr ? true : undefined}
            aria-describedby={showCardErr ? 'pay-card-err' : undefined}
          />
          {showCardErr && (
            <p id="pay-card-err" className="payment-page__error" role="alert">
              {cardError}
            </p>
          )}
        </div>

        <div className="payment-page__row2">
          <div className="payment-page__field">
            <label className="payment-page__label" htmlFor="pay-expiry">
              Expiry date
            </label>
            <input
              id="pay-expiry"
              className={`payment-page__input ${showExpiryErr ? 'payment-page__input--error' : ''}`}
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={expiryDisplay}
              onChange={onExpiryChange}
              onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
              placeholder="MM/YY"
              maxLength={5}
              aria-invalid={showExpiryErr ? true : undefined}
              aria-describedby={showExpiryErr ? 'pay-expiry-err' : undefined}
            />
            {showExpiryErr && (
              <p id="pay-expiry-err" className="payment-page__error" role="alert">
                {expiryError}
              </p>
            )}
          </div>
          <div className="payment-page__field">
            <label className="payment-page__label" htmlFor="pay-cvc">
              CVC
            </label>
            <input
              id="pay-cvc"
              className={`payment-page__input ${showCvcErr ? 'payment-page__input--error' : ''}`}
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cvcDisplay}
              onChange={onCvcChange}
              onBlur={() => setTouched((t) => ({ ...t, cvc: true }))}
              placeholder="123"
              maxLength={3}
              aria-invalid={showCvcErr ? true : undefined}
              aria-describedby={showCvcErr ? 'pay-cvc-err' : undefined}
            />
            {showCvcErr && (
              <p id="pay-cvc-err" className="payment-page__error" role="alert">
                {cvcError}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="payment-page__tip" aria-label="Tip">
        <h2 className="payment-page__h2">Add a tip</h2>
        <div className="payment-page__tip-btns">
          {TIPS.map((p) => (
            <button
              key={p}
              type="button"
              className={
                tipPercent === p
                  ? 'payment-page__tip-btn payment-page__tip-btn--on'
                  : 'payment-page__tip-btn'
              }
              onClick={() => setTipPercent(p)}
            >
              {p}%
            </button>
          ))}
        </div>
      </section>

      <section className="payment-page__summary" aria-label="Totals">
        <h2 className="payment-page__h2">Order summary</h2>
        <p className="payment-page__customer">
          {summaryCustomer ? (
            <>
              {summaryCustomer.name} · {summaryCustomer.phone} ·{' '}
              {summaryCustomer.orderType === 'pickup' ? 'Pickup' : 'Dine-in'}
            </>
          ) : (
            <>— · — · —</>
          )}
        </p>
        <ul className="payment-page__lines">
          {lines.map((line) => (
            <li key={line.lineId}>
              <div>
                <span>
                  {line.quantity}× {line.name}
                </span>
                <span className="payment-page__line-meta">
                  {summarizeLine(line)}
                </span>
              </div>
              <span>{formatCurrency(lineUnitTotal(line))}</span>
            </li>
          ))}
        </ul>
        <div className="payment-page__totals">
          <div>
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <>
              <div>
                <span>Discount</span>
                <span>{formatCurrency(-totals.discount)}</span>
              </div>
              <p className="flow-page__discount-msg payment-page__discount-msg">
                {DISCOUNT_APPLIED_MESSAGE}
              </p>
            </>
          )}
          <div>
            <span>Tip ({tipPercent}%)</span>
            <span>{formatCurrency(totals.tipAmount)}</span>
          </div>
          <div className="payment-page__total-row">
            <span>Total</span>
            <strong>{formatCurrency(totals.total)}</strong>
          </div>
        </div>
      </section>

      <button
        type="button"
        className={`flow-page__btn flow-page__btn--primary payment-page__place ${!formValid ? 'payment-page__place--pending' : ''}`}
        onClick={handlePlaceOrder}
      >
        Complete payment
      </button>
      <Link to="/checkout" className="payment-page__back">
        Back to checkout
      </Link>
    </div>
  )
}
