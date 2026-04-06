import type { CartLine } from '../types/cartLine'

export function lineUnitTotal(line: CartLine): number {
  return (line.basePrice + line.extrasCharge) * line.quantity
}

export function summarizeLine(line: CartLine): string {
  if (line.category === 'drinks') {
    return 'Standard'
  }
  const c = line.customization
  const extras = [
    c.extras.cheese && 'Cheese',
    c.extras.guac && 'Guac',
  ].filter(Boolean)
  const toppings =
    c.toppings.length > 0 ? c.toppings.join(', ') : 'No extra toppings'
  return [
    `Protein: ${c.protein}`,
    `Rice: ${c.rice}`,
    `Beans: ${c.beans}`,
    toppings,
    extras.length ? `Extras: ${extras.join(', ')}` : null,
  ]
    .filter(Boolean)
    .join(' · ')
}
