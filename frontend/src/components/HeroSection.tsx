import { Link } from 'react-router-dom'
import './HeroSection.css'

const HERO_BG =
  'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=2400&q=80'

export function HeroSection() {
  return (
    <section className="ola-hero" aria-labelledby="ola-hero-heading">
      <div
        className="ola-hero__bg"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        role="img"
        aria-label="Fresh burritos and coastal Mexican food"
      />
      <div className="ola-hero__overlay" aria-hidden />
      <div className="ola-hero__inner">
        <p className="ola-hero__badge">Fresh Coastal Flavors</p>
        <h1 id="ola-hero-heading" className="ola-hero__title">
          <span className="ola-hero__title-line">Burritos Made with</span>
          <span className="ola-hero__accent">Soul</span>
        </h1>
        <p className="ola-hero__sub">
          Fresh, bold, and built your way. Order ahead for pickup or dine in at
          Blue Coast Burrito.
        </p>
        <div className="ola-hero__ctas">
          <Link to="/menu" className="ola-hero__btn ola-hero__btn--primary">
            Order Now
          </Link>
          <Link to="/menu" className="ola-hero__btn ola-hero__btn--ghost">
            View Menu
          </Link>
        </div>
        <p className="ola-hero__hours">
          Open 11am–9pm <span aria-hidden>•</span> Mt Juliet, TN
        </p>
      </div>
    </section>
  )
}
