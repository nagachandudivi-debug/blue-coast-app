import { useEffect, useId, useState } from 'react'
import type { MenuProduct } from '../data/menu'
import {
  defaultCustomization,
  drinkCustomization,
  useCart,
  TOPPING_OPTIONS,
} from '../context/CartContext'
import {
  extraCostForCustomization,
  type BeansType,
  type CartCustomization,
  type Protein,
  type RiceType,
} from '../context/cartTypes'
import { formatCurrency } from '../utils/money'
import './ItemCustomizeModal.css'

type ItemCustomizeModalProps = {
  product: MenuProduct | null
  onClose: () => void
}

const proteins: { id: Protein; label: string }[] = [
  { id: 'chicken', label: 'Chicken' },
  { id: 'steak', label: 'Steak' },
  { id: 'veg', label: 'Veg' },
]

const rices: { id: RiceType; label: string }[] = [
  { id: 'white', label: 'White' },
  { id: 'brown', label: 'Brown' },
]

const beans: { id: BeansType; label: string }[] = [
  { id: 'black', label: 'Black' },
  { id: 'pinto', label: 'Pinto' },
]

export function ItemCustomizeModal({ product, onClose }: ItemCustomizeModalProps) {
  const titleId = useId()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [customization, setCustomization] = useState<CartCustomization>(
    defaultCustomization(),
  )

  useEffect(() => {
    if (!product) return
    setQty(1)
    setCustomization(
      product.customizable ? defaultCustomization() : drinkCustomization(),
    )
  }, [product])

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  if (!product) return null

  const showBuilder = product.customizable
  const extrasCharge = extraCostForCustomization(customization)
  const unitPrice = product.price + extrasCharge
  const linePreview = unitPrice * qty

  function toggleTopping(name: string) {
    setCustomization((c) => {
      const has = c.toppings.includes(name)
      return {
        ...c,
        toppings: has
          ? c.toppings.filter((t) => t !== name)
          : [...c.toppings, name],
      }
    })
  }

  function addToCartAndClose() {
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
      qty,
    )
    onClose()
  }

  return (
    <div
      className="item-modal"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="item-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="item-modal__close" onClick={onClose}>
          Close
        </button>
        <div className="item-modal__grid">
          <div className="item-modal__visual">
            <img src={product.image} alt="" width={640} height={420} />
          </div>
          <div className="item-modal__content">
            <h2 id={titleId} className="item-modal__title">
              {product.name}
            </h2>
            <p className="item-modal__desc">{product.description}</p>
            <p className="item-modal__price">
              {formatCurrency(product.price)}
              {extrasCharge > 0 && (
                <span className="item-modal__price-note">
                  {' '}
                  + {formatCurrency(extrasCharge)} extras
                </span>
              )}
            </p>

            {showBuilder ? (
              <div className="item-modal__options">
                <fieldset className="item-modal__field">
                  <legend>Protein</legend>
                  <div className="item-modal__chips">
                    {proteins.map((p) => (
                      <label key={p.id} className="item-modal__chip">
                        <input
                          type="radio"
                          name="protein"
                          value={p.id}
                          checked={customization.protein === p.id}
                          onChange={() =>
                            setCustomization((c) => ({ ...c, protein: p.id }))
                          }
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="item-modal__field">
                  <legend>Rice</legend>
                  <div className="item-modal__chips">
                    {rices.map((r) => (
                      <label key={r.id} className="item-modal__chip">
                        <input
                          type="radio"
                          name="rice"
                          value={r.id}
                          checked={customization.rice === r.id}
                          onChange={() =>
                            setCustomization((c) => ({ ...c, rice: r.id }))
                          }
                        />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="item-modal__field">
                  <legend>Beans</legend>
                  <div className="item-modal__chips">
                    {beans.map((b) => (
                      <label key={b.id} className="item-modal__chip">
                        <input
                          type="radio"
                          name="beans"
                          value={b.id}
                          checked={customization.beans === b.id}
                          onChange={() =>
                            setCustomization((c) => ({ ...c, beans: b.id }))
                          }
                        />
                        {b.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="item-modal__field">
                  <legend>Toppings</legend>
                  <div className="item-modal__checks">
                    {TOPPING_OPTIONS.map((t) => (
                      <label key={t} className="item-modal__check">
                        <input
                          type="checkbox"
                          checked={customization.toppings.includes(t)}
                          onChange={() => toggleTopping(t)}
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="item-modal__field">
                  <legend>Extras</legend>
                  <div className="item-modal__checks">
                    <label className="item-modal__check">
                      <input
                        type="checkbox"
                        checked={customization.extras.cheese}
                        onChange={() =>
                          setCustomization((c) => ({
                            ...c,
                            extras: {
                              ...c.extras,
                              cheese: !c.extras.cheese,
                            },
                          }))
                        }
                      />
                      Cheese (+$0.75)
                    </label>
                    <label className="item-modal__check">
                      <input
                        type="checkbox"
                        checked={customization.extras.guac}
                        onChange={() =>
                          setCustomization((c) => ({
                            ...c,
                            extras: { ...c.extras, guac: !c.extras.guac },
                          }))
                        }
                      />
                      Guac (+$2.25)
                    </label>
                  </div>
                </fieldset>
              </div>
            ) : (
              <p className="item-modal__hint">
                Ready to drink—adjust quantity and add to your cart.
              </p>
            )}

            <div className="item-modal__qty-row">
              <span className="item-modal__qty-label">Quantity</span>
              <div className="item-modal__qty">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="item-modal__footer">
              <p className="item-modal__total">
                Line total{' '}
                <strong>{formatCurrency(linePreview)}</strong>
              </p>
              <button
                type="button"
                className="item-modal__add-cart"
                onClick={addToCartAndClose}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
