import type { MouseEvent } from 'react'
import type { MenuProduct } from '../data/menu'
import {
  defaultCustomization,
  drinkCustomization,
  useCart,
} from '../context/CartContext'
import { formatCurrency } from '../utils/money'
import './MenuItemCard.css'

type MenuItemCardProps = {
  product: MenuProduct
  onOpen: (product: MenuProduct) => void
}

export function MenuItemCard({ product, onOpen }: MenuItemCardProps) {
  const { addToCart } = useCart()

  function handleQuickAdd(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    const customization = product.customizable
      ? defaultCustomization()
      : drinkCustomization()
    addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        price: product.price,
        customizable: product.customizable,
      },
      customization,
      1,
    )
  }

  return (
    <article className="menu-item-card">
      <button
        type="button"
        className="menu-item-card__media-btn"
        onClick={() => onOpen(product)}
        aria-label={`${product.name}, details`}
      >
        <img
          src={product.image}
          alt=""
          className="menu-item-card__img"
          width={400}
          height={260}
          loading="lazy"
        />
      </button>
      <div className="menu-item-card__body">
        <button
          type="button"
          className="menu-item-card__title-btn"
          onClick={() => onOpen(product)}
        >
          {product.name}
        </button>
        <p className="menu-item-card__price">{formatCurrency(product.price)}</p>
        <button
          type="button"
          className="menu-item-card__add"
          onClick={handleQuickAdd}
        >
          Add
        </button>
      </div>
    </article>
  )
}
