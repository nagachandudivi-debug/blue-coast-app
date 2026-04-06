export type MenuCategoryId = 'burritos' | 'tacos' | 'bowls' | 'drinks'

export type MenuProduct = {
  id: string
  category: MenuCategoryId
  name: string
  description: string
  price: number
  image: string
  /** Drinks skip build-your-own in the modal */
  customizable: boolean
}

/** Short descriptions for home category cards (UI copy only). */
export const CATEGORY_BLURBS: Record<MenuCategoryId, string> = {
  burritos: 'Signature rolls—rice, beans, salsa, and your protein',
  tacos: 'Coastal street style, lime, cilantro, house salsas',
  bowls: 'Burrito bowls with rice, greens, or the best of both',
  drinks: 'Horchata, agua fresca, and ice-cold Mexican Coke',
}

/** Fallback images if a category has no items yet. */
export const CATEGORY_FALLBACK_IMAGES: Record<MenuCategoryId, string> = {
  burritos:
    'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=80',
  tacos:
    'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
  bowls:
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  drinks:
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
}

export function productsByCategory(
  products: MenuProduct[],
  category: MenuCategoryId,
): MenuProduct[] {
  return products.filter((p) => p.category === category)
}

/** First item image in a category, or static fallback. */
export function categoryCardImage(
  products: MenuProduct[],
  slug: MenuCategoryId,
): string {
  const first = products.find((p) => p.category === slug)
  return first?.image ?? CATEGORY_FALLBACK_IMAGES[slug]
}
