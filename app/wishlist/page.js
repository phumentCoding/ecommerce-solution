"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [removingItems, setRemovingItems] = useState(new Set())

  const handleRemoveFromWishlist = (productId) => {
    setRemovingItems((prev) => new Set([...prev, productId]))
    setTimeout(() => {
      removeFromWishlist(productId)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    console.log("🛒 Added to cart from wishlist:", product.name)
  }

  const handleMoveToCart = (product) => {
    addToCart(product, 1)
    handleRemoveFromWishlist(product.id)
    console.log("🛒 Moved to cart:", product.name)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length === 0
                  ? "Your wishlist is empty"
                  : `${wishlistItems.length} ${wishlistItems.length === 1 ? "item" : "items"} saved for later`}
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist. You can save items for later and easily find them here.
            </p>
            <Link href="/products">
              <button className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium inline-flex items-center gap-2">
                <span>Browse Products</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product, index) => (
              <WishlistCard
                key={product.id}
                product={product}
                index={index}
                onRemove={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
                onMoveToCart={handleMoveToCart}
                isRemoving={removingItems.has(product.id)}
              />
            ))}
          </div>
        )}

        {/* Recommendations */}
        {wishlistItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-600">Personalized recommendations coming soon!</p>
              <Link href="/products">
                <button className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Browse All Products
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Wishlist Card Component
function WishlistCard({ product, index, onRemove, onAddToCart, onMoveToCart, isRemoving }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up ${
        isRemoving ? "opacity-50 scale-95" : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <div
          className={`absolute inset-0 bg-gray-200 ${imageLoaded ? "opacity-0" : "opacity-100"} transition-opacity`}
        />
        <Image
          src={
            product.image ||
            `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name || "product")}`
          }
          alt={product.name || "Product"}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Remove button */}
        <button
          onClick={() => onRemove(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 transform"
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Sale badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">SALE</span>
          </div>
        )}

        {/* Stock status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded-lg font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name || "Unnamed Product"}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description || "No description available"}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({product.rating || 0})</span>
          {product.category && (
            <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">${product.price || 0}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onMoveToCart(product)}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed group"
          >
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {product.stock === 0 ? "Out of Stock" : "Move to Cart"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

            <Link href={`/products/${product.id}`} className="flex-1">
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
