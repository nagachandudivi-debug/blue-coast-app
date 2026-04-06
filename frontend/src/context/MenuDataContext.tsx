import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ApiCategory, ApiMenuItem } from '../api/types'
import type { MenuCategoryId, MenuProduct } from '../data/menu'

/** Maps API category ids to URL hash slugs (same as before). */
const SLUG_BY_CATEGORY_ID: Record<number, MenuCategoryId> = {
  1: 'burritos',
  2: 'tacos',
  3: 'bowls',
  4: 'drinks',
}

export type MenuCategoryView = {
  apiId: number
  slug: MenuCategoryId
  name: string
}

type MenuDataContextValue = {
  loading: boolean
  error: string | null
  /** Categories sorted by API id */
  categories: MenuCategoryView[]
  /** All menu items mapped for the UI */
  products: MenuProduct[]
}

const MenuDataContext = createContext<MenuDataContextValue | null>(null)

function mapApiItemToProduct(item: ApiMenuItem): MenuProduct | null {
  const slug = SLUG_BY_CATEGORY_ID[item.categoryId]
  if (!slug) return null

  return {
    id: String(item.id),
    category: slug,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.imageUrl,
    customizable: slug !== 'drinks',
  }
}

function buildCategoryViews(apiCategories: ApiCategory[]): MenuCategoryView[] {
  return [...apiCategories]
    .sort((a, b) => a.id - b.id)
    .map((c) => {
      const slug = SLUG_BY_CATEGORY_ID[c.id]
      if (!slug) return null
      return { apiId: c.id, slug, name: c.name }
    })
    .filter((v): v is MenuCategoryView => v !== null)
}

export function MenuDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<MenuCategoryView[]>([])
  const [products, setProducts] = useState<MenuProduct[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const base = import.meta.env.VITE_API_URL as string | undefined
      if (!base || !base.trim()) {
        setError('Missing VITE_API_URL. Add it to your .env file.')
        setLoading(false)
        return
      }

      const root = base.replace(/\/$/, '')

      try {
        const [catRes, itemRes] = await Promise.all([
          fetch(`${root}/api/categories`),
          fetch(`${root}/api/menuitems`),
        ])

        if (!catRes.ok) {
          throw new Error(
            `Could not load categories (HTTP ${catRes.status}).`,
          )
        }
        if (!itemRes.ok) {
          throw new Error(
            `Could not load menu items (HTTP ${itemRes.status}).`,
          )
        }

        const apiCategories = (await catRes.json()) as ApiCategory[]
        const apiItems = (await itemRes.json()) as ApiMenuItem[]

        if (cancelled) return

        const views = buildCategoryViews(apiCategories)
        const mapped = apiItems
          .map(mapApiItemToProduct)
          .filter((p): p is MenuProduct => p !== null)

        setCategories(views)
        setProducts(mapped)
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : 'Something went wrong. Try again.',
          )
          setCategories([])
          setProducts([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<MenuDataContextValue>(
    () => ({
      loading,
      error,
      categories,
      products,
    }),
    [loading, error, categories, products],
  )

  return (
    <MenuDataContext.Provider value={value}>{children}</MenuDataContext.Provider>
  )
}

export function useMenuData(): MenuDataContextValue {
  const ctx = useContext(MenuDataContext)
  if (!ctx) {
    throw new Error('useMenuData must be used inside MenuDataProvider')
  }
  return ctx
}
