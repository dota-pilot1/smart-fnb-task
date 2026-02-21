import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { apiClient } from '@/shared/api/client'
import { ProductDetail } from '@/features/product/ui/ProductDetail'
import type { Product } from '@/entities/product/model/types'

export function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    apiClient<Product>(`/api/products/${id}`)
      .then(setProduct)
      .catch(() => setError('상품을 찾을 수 없습니다.'))
  }, [id])

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          상품 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  if (!product) {
    return <p className="py-20 text-center text-gray-500">로딩 중...</p>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        &larr; 상품 목록
      </Link>
      <ProductDetail product={product} />
    </div>
  )
}
