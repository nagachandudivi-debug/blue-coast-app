import { Link } from 'react-router-dom'
import { useMenuData } from '../context/MenuDataContext'
import type { MenuCategoryId } from '../data/menu'
import { CATEGORY_BLURBS, categoryCardImage } from '../data/menu'
import './MenuCategoriesSection.css'

export function MenuCategoriesSection() {
  const { loading, error, categories, products } = useMenuData()

  if (loading) {
    return (
      <section
        id="menu-preview"
        className="ola-menu-section"
        aria-labelledby="ola-menu-heading"
      >
        <div className="ola-menu-section__container">
          <header className="ola-menu-section__header">
            <p className="ola-menu-section__eyebrow">The menu</p>
            <h2 id="ola-menu-heading" className="ola-menu-section__title">
              Blue Coast favorites, made to order
            </h2>
          </header>
          <p className="ola-menu-section__status">Loading...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        id="menu-preview"
        className="ola-menu-section"
        aria-labelledby="ola-menu-heading"
      >
        <div className="ola-menu-section__container">
          <header className="ola-menu-section__header">
            <p className="ola-menu-section__eyebrow">The menu</p>
            <h2 id="ola-menu-heading" className="ola-menu-section__title">
              Blue Coast favorites, made to order
            </h2>
          </header>
          <p
            className="ola-menu-section__status ola-menu-section__status--error"
            role="alert"
          >
            {error}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="menu-preview"
      className="ola-menu-section"
      aria-labelledby="ola-menu-heading"
    >
      <div className="ola-menu-section__container">
        <header className="ola-menu-section__header">
          <p className="ola-menu-section__eyebrow">The menu</p>
          <h2 id="ola-menu-heading" className="ola-menu-section__title">
            Blue Coast favorites, made to order
          </h2>
          <p className="ola-menu-section__lead">
            Jump into a category—burritos, tacos, and bowls built your way.
          </p>
        </header>

        <ul className="ola-menu-section__grid">
          {categories.map((cat) => {
            const slug = cat.slug as MenuCategoryId
            return (
              <li key={cat.slug}>
                <Link to={`/menu#${cat.slug}`} className="ola-cat-card">
                  <span className="ola-cat-card__media">
                    <img
                      src={categoryCardImage(products, slug)}
                      alt=""
                      width={640}
                      height={400}
                      loading="lazy"
                    />
                    <span className="ola-cat-card__shade" aria-hidden />
                  </span>
                  <span className="ola-cat-card__body">
                    <span className="ola-cat-card__title">{cat.name}</span>
                    <span className="ola-cat-card__blurb">
                      {CATEGORY_BLURBS[slug]}
                    </span>
                    <span className="ola-cat-card__cta">
                      View category
                      <span className="ola-cat-card__arrow" aria-hidden>
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
