"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductCard({ product, viewMode, index, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (viewMode === "list") {
    return (
      <div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 hover:shadow-lg transition-all duration-300 group animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div
              className={`absolute inset-0 bg-gray-200 rounded-xl transition-opacity duration-300 ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src={
                product.image ||
                `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(product.name || "product")}`
              }
              alt={product.name || "Product"}
              fill
              className={`object-cover rounded-xl transition-all duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {product.name || "Unnamed Product"}
              </h3>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isInWishlist ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description || "No description available"}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">({product.rating || 0})</span>
              </div>

              {product.category && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{product.category}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">${product.price || 0}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/products/${product.id}`}>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-square overflow-hidden">
        <div
          className={`absolute inset-0 bg-gray-200 transition-opacity duration-300 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src={
            product.image ||
            `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name || "product")}`
          }
          alt={product.name || "Product"}
          fill
          className={`object-cover group-hover:scale-105 transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isInWishlist
                ? "bg-white/90 text-red-500"
                : "bg-white/70 text-gray-600 hover:bg-white/90 hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
        </div>

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-4 left-4">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">SALE</span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name || "Unnamed Product"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description || "No description available"}</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating || 0})</span>

          {product.category && (
            <span className="ml-auto px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{product.category}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">${product.price || 0}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          <Link href={`/products/${product.id}`}>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
