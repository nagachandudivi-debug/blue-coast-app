import { FormEvent, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PromoBanner } from '../components/PromoBanner'
import { useCart } from '../context/CartContext'
import type { CustomerInfo } from '../context/CartContext'
import { formatCurrency } from '../utils/money'
import { lineUnitTotal, summarizeLine } from '../utils/orderFormat'
import {
  DISCOUNT_APPLIED_MESSAGE,
  calculateTotals,
} from '../utils/orderTotals'
import '../styles/flow.css'
import './CheckoutPage.css'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, subtotal, setCheckoutCustomer } = useCart()
  const totals = useMemo(() => calculateTotals(subtotal, 0), [subtotal])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderType, setOrderType] = useState<CustomerInfo['orderType']>(
    'pickup',
  )

  if (lines.length === 0) {
    return <Navigate to="/cart" replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || !phone.trim()) return
    const info: CustomerInfo = {
      name: trimmed,
      phone: phone.trim(),
      orderType,
    }
    setCheckoutCustomer(info)
    navigate('/payment')
  }

  return (
    <div className="checkout-page">
      <h1 className="flow-page__title">Checkout</h1>
      <p className="checkout-page__sub">Blue Coast Burrito · Mt Juliet, TN</p>
      <PromoBanner variant="compact" />

      <section className="checkout-page__summary" aria-label="Order summary">
        <h2 className="checkout-page__h2">Order summary</h2>
        <ul className="checkout-page__lines">
          {lines.map((line) => (
            <li key={line.lineId}>
              <span>
                {line.quantity}× {line.name}
              </span>
              <span>{formatCurrency(lineUnitTotal(line))}</span>
            </li>
          ))}
        </ul>
        <p className="checkout-page__note">
          {lines.map((l) => (
            <span key={l.lineId} className="checkout-page__mini">
              {summarizeLine(l)}
            </span>
          ))}
        </p>
        <div className="checkout-page__subtotal">
          <span>Subtotal</span>
          <strong>{formatCurrency(totals.subtotal)}</strong>
        </div>
        {totals.discount > 0 && (
          <>
            <div className="checkout-page__subtotal checkout-page__subtotal--continuation">
              <span>Discount</span>
              <strong>{formatCurrency(-totals.discount)}</strong>
            </div>
            <p className="flow-page__discount-msg">{DISCOUNT_APPLIED_MESSAGE}</p>
          </>
        )}
        <div className="checkout-page__summary-total">
          <span>Total</span>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
      </section>

      <form className="checkout-page__form" onSubmit={onSubmit}>
        <h2 className="checkout-page__h2">Your details</h2>
        <label className="checkout-page__label">
          Name
          <input
            className="checkout-page__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            placeholder="Full name"
          />
        </label>
        <label className="checkout-page__label">
          Phone
          <input
            className="checkout-page__input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
            placeholder="(615) 555-0123"
          />
        </label>

        <fieldset className="checkout-page__fieldset">
          <legend>Order type</legend>
          <label className="checkout-page__radio">
            <input
              type="radio"
              name="orderType"
              checked={orderType === 'pickup'}
              onChange={() => setOrderType('pickup')}
            />
            Pickup
          </label>
          <label className="checkout-page__radio">
            <input
              type="radio"
              name="orderType"
              checked={orderType === 'dine-in'}
              onChange={() => setOrderType('dine-in')}
            />
            Dine-in
          </label>
        </fieldset>

        <button type="submit" className="flow-page__btn flow-page__btn--primary checkout-page__submit">
          Continue to payment
        </button>
        <Link to="/cart" className="checkout-page__back">
          Back to cart
        </Link>
      </form>
    </div>
  )
}
