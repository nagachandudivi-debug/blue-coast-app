import { Link } from 'react-router-dom'
import {
  PROMO_DISCOUNT_AMOUNT,
  PROMO_SUBTOTAL_MIN,
} from '../utils/orderTotals'
import './PromoBanner.css'

type PromoBannerProps = {
  /** Featured: homepage with CTA. Compact: reminder on cart / checkout / payment. */
  variant?: 'featured' | 'compact'
}

export function PromoBanner({ variant = 'compact' }: PromoBannerProps) {
  const featured = variant === 'featured'

  return (
    <aside
      className={`promo-banner ${featured ? 'promo-banner--featured' : 'promo-banner--compact'}`}
      aria-label="Special offer"
    >
      <div className="promo-banner__inner">
        {featured && (
          <span className="promo-banner__badge">Today&apos;s deal</span>
        )}
        <p className="promo-banner__title">
          Get ${PROMO_DISCOUNT_AMOUNT} off orders of ${PROMO_SUBTOTAL_MIN} or
          more
        </p>
        <p className="promo-banner__sub">
          Discount is applied automatically at checkout.
        </p>
        {featured && (
          <Link to="/menu" className="promo-banner__cta">
            Order Now
          </Link>
        )}
      </div>
    </aside>
  )
}
