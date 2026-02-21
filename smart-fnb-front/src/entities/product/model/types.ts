export interface Product {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string | null
}

export interface ProductListResponse {
  products: Product[]
}
