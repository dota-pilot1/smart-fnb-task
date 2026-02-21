import type { Product } from '@/entities/product/model/types'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-96 h-96 object-cover rounded-lg bg-gray-100"
        />
      ) : (
        <div className="w-full md:w-96 h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          이미지 없음
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-4 text-3xl font-bold text-gray-900">
          {product.price.toLocaleString()}원
        </p>
        <div className="mt-4">
          {product.stockQuantity > 0 ? (
            <span className="text-sm text-green-600">재고 {product.stockQuantity}개</span>
          ) : (
            <span className="text-sm text-red-500 font-medium">품절</span>
          )}
        </div>
        {product.description && (
          <p className="mt-6 text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        )}
      </div>
    </div>
  )
}
