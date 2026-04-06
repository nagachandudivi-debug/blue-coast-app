/** Shapes returned by the Blue Coast Burrito .NET API */

export type ApiCategory = {
  id: number
  name: string
}

export type ApiMenuItem = {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: number
}
