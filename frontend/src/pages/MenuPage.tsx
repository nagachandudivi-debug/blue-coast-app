import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMenuData } from '../context/MenuDataContext'
import type { MenuCategoryId, MenuProduct } from '../data/menu'
import { productsByCategory } from '../data/menu'
import { ItemCustomizeModal } from '../components/ItemCustomizeModal'
import { MenuItemCard } from '../components/MenuItemCard'
import './MenuPage.css'

export function MenuPage() {
  const { hash } = useLocation()
  const { loading, error, categories, products } = useMenuData()
  const [selected, setSelected] = useState<MenuProduct | null>(null)

  const categoryOrder = useMemo(
    () => categories.map((c) => c.slug),
    [categories],
  )

  const labelFor = (slug: MenuCategoryId) =>
    categories.find((c) => c.slug === slug)?.name ?? slug

  useEffect(() => {
    if (!hash || hash.length < 2 || loading) return
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash, loading, categoryOrder])

  if (loading) {
    return (
      <div className="menu-page">
        <header className="menu-page__hero">
          <p className="menu-page__eyebrow">Blue Coast Burrito · Mt Juliet, TN</p>
          <h1 className="menu-page__title">Our menu</h1>
        </header>
        <p className="menu-page__status">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="menu-page">
        <header className="menu-page__hero">
          <p className="menu-page__eyebrow">Blue Coast Burrito · Mt Juliet, TN</p>
          <h1 className="menu-page__title">Our menu</h1>
        </header>
        <p className="menu-page__status menu-page__status--error" role="alert">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="menu-page">
      <header className="menu-page__hero">
        <p className="menu-page__eyebrow">Blue Coast Burrito · Mt Juliet, TN</p>
        <h1 className="menu-page__title">Our menu</h1>
        <p className="menu-page__lead">
          Tap any item to customize and add to your cart. Open 11am–9pm daily.
        </p>
        <nav className="menu-page__chips" aria-label="Jump to category">
          {categoryOrder.map((id) => (
            <a key={id} className="menu-page__chip" href={`#${id}`}>
              {labelFor(id)}
            </a>
          ))}
        </nav>
      </header>

      {categoryOrder.map((categoryId) => {
        const items = productsByCategory(products, categoryId)
        return (
          <section
            key={categoryId}
            id={categoryId}
            className="menu-page__section"
            aria-labelledby={`cat-${categoryId}`}
          >
            <h2 className="menu-page__cat-title" id={`cat-${categoryId}`}>
              {labelFor(categoryId)}
            </h2>
            <div className="menu-page__grid">
              {items.map((p) => (
                <MenuItemCard
                  key={p.id}
                  product={p}
                  onOpen={() => setSelected(p)}
                />
              ))}
            </div>
          </section>
        )
      })}

      <ItemCustomizeModal
        product={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
