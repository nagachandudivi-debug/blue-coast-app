import type { MenuCategoryId } from '../data/menu'
import type { CartCustomization } from '../context/cartTypes'

export type CartLine = {
  lineId: string
  productId: string
  name: string
  image: string
  category: MenuCategoryId
  quantity: number
  basePrice: number
  customization: CartCustomization
  extrasCharge: number
}
