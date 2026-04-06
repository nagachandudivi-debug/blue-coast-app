import { Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/money'
import { summarizeLine } from '../utils/orderFormat'
import { DISCOUNT_APPLIED_MESSAGE } from '../utils/orderTotals'
import '../styles/flow.css'
import './OrderConfirmationPage.css'

export function OrderConfirmationPage() {
  const { completedOrder, clearCompletedOrder } = useCart()

  if (!completedOrder) {
    return <Navigate to="/" replace />
  }

  const {
    orderId,
    customer,
    lines,
    subtotal,
    discount,
    tipPercent,
    tipAmount,
    total,
  } = completedOrder

  return (
    <div className="confirm-page">
      <div className="confirm-page__icon" aria-hidden>
        ✓
      </div>
      <h1 className="confirm-page__title">Order placed successfully</h1>
      <p className="confirm-page__id">
        Order <strong>{orderId}</strong>
      </p>
      <p className="confirm-page__location">
        Blue Coast Burrito · <strong>Mt Juliet, TN</strong>
      </p>
      <p className="confirm-page__thanks">
        Thanks, {customer.name}. We&apos;ll have your{' '}
        {customer.orderType === 'pickup' ? 'order ready for pickup' : 'table order'}{' '}
        soon.
      </p>

      <section className="confirm-page__summary" aria-label="Order summary">
        <h2 className="confirm-page__h2">Order summary</h2>
        <ul className="confirm-page__lines">
          {lines.map((line) => (
            <li key={line.lineId}>
              <div>
                <span>
                  {line.quantity}× {line.name}
                </span>
                <span className="confirm-page__meta">{summarizeLine(line)}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="confirm-page__totals">
          <div>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <>
              <div>
                <span>Discount</span>
                <span>{formatCurrency(-discount)}</span>
              </div>
              <p className="flow-page__discount-msg confirm-page__discount-msg">
                {DISCOUNT_APPLIED_MESSAGE}
              </p>
            </>
          )}
          <div>
            <span>Tip ({tipPercent}%)</span>
            <span>{formatCurrency(tipAmount)}</span>
          </div>
          <div className="confirm-page__total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
        <p className="confirm-page__contact">
          {customer.phone} ·{' '}
          {customer.orderType === 'pickup' ? 'Pickup' : 'Dine-in'}
        </p>
      </section>

      <Link
        to="/"
        className="flow-page__btn flow-page__btn--primary confirm-page__cta"
        onClick={() => clearCompletedOrder()}
      >
        Start a new order
      </Link>
    </div>
  )
}
