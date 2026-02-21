import { useEffect, useState } from 'react'
import { apiClient } from '@/shared/api/client'
import { ProductCard } from '@/features/product/ui/ProductCard'
import type { ProductListResponse } from '@/entities/product/model/types'

export function ProductListPage() {
  const [data, setData] = useState<ProductListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient<ProductListResponse>('/api/products')
      .then(setData)
      .catch(() => setError('상품 목록을 불러오지 못했습니다.'))
  }, [])

  if (error) {
    return <p className="py-20 text-center text-red-500">{error}</p>
  }

  if (!data) {
    return <p className="py-20 text-center text-gray-500">로딩 중...</p>
  }

  if (data.products.length === 0) {
    return <p className="py-20 text-center text-gray-500">등록된 상품이 없습니다.</p>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">상품 목록</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
