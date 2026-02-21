import { Link } from 'react-router'
import type { Product } from '@/entities/product/model/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover bg-gray-100"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          이미지 없음
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="mt-1 text-lg font-bold text-gray-900">
          {product.price.toLocaleString()}원
        </p>
        {product.stockQuantity === 0 && (
          <span className="mt-1 inline-block text-xs text-red-500 font-medium">품절</span>
        )}
      </div>
    </Link>
  )
}
