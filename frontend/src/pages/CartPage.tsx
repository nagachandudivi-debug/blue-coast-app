import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PromoBanner } from '../components/PromoBanner'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'
import {
  DISCOUNT_APPLIED_MESSAGE,
  calculateTotals,
} from '../utils/orderTotals'
import { lineUnitTotal, summarizeLine } from '../utils/orderFormat'
import '../styles/flow.css'
import './CartPage.css'

export function CartPage() {
  const { lines, subtotal, updateLineQuantity, removeLine } = useCart()
  const totals = useMemo(() => calculateTotals(subtotal, 0), [subtotal])

  if (lines.length === 0) {
    return (
      <div className="flow-page cart-page">
        <h1 className="flow-page__title">Your cart</h1>
        <PromoBanner variant="compact" />
        <p className="cart-page__empty">Your cart is empty.</p>
        <Link to="/menu" className="flow-page__btn flow-page__btn--primary">
          Browse menu
        </Link>
      </div>
    )
  }

  return (
    <div className="flow-page cart-page">
      <h1 className="flow-page__title">Your cart</h1>
      <p className="cart-page__location">Pickup & dine-in · Mt Juliet, TN</p>
      <PromoBanner variant="compact" />

      <ul className="cart-page__list">
        {lines.map((line) => (
          <li key={line.lineId} className="cart-page__row">
            <img
              src={line.image}
              alt=""
              className="cart-page__thumb"
              width={88}
              height={88}
            />
            <div className="cart-page__main">
              <div className="cart-page__row-head">
                <span className="cart-page__name">{line.name}</span>
                <button
                  type="button"
                  className="cart-page__remove"
                  onClick={() => removeLine(line.lineId)}
                >
                  Remove
                </button>
              </div>
              <p className="cart-page__custom">{summarizeLine(line)}</p>
              <div className="cart-page__controls">
                <div className="cart-page__qty">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateLineQuantity(line.lineId, line.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      updateLineQuantity(line.lineId, line.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <span className="cart-page__line-total">
                  {formatCurrency(lineUnitTotal(line))}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-page__summary">
        <div className="cart-page__subtotal">
          <span>Subtotal</span>
          <strong>{formatCurrency(totals.subtotal)}</strong>
        </div>
        {totals.discount > 0 && (
          <>
            <div className="cart-page__subtotal">
              <span>Discount</span>
              <strong>{formatCurrency(-totals.discount)}</strong>
            </div>
            <p className="flow-page__discount-msg">{DISCOUNT_APPLIED_MESSAGE}</p>
          </>
        )}
        <div className="cart-page__total">
          <span>Total</span>
          <strong>{formatCurrency(totals.total)}</strong>
        </div>
        <Link to="/checkout" className="flow-page__btn flow-page__btn--primary">
          Checkout
        </Link>
        <Link to="/menu" className="cart-page__continue">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
