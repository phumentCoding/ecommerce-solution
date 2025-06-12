"use client"

import { useEffect, useState } from "react"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3001/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const featuredProducts = products.slice(0, 8)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that our customers love most
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
                onToggleWishlist={toggleWishlist}
                isInWishlist={wishlist.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Product Card Component
function ProductCard({ product, index, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          className={`object-cover group-hover:scale-110 transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay Actions */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 transform ${
              isHovered ? "scale-100" : "scale-75"
            } ${
              isInWishlist ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
          </button>

          <Link href={`/products/${product.id}`}>
            <button
              className={`p-3 rounded-full bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-all duration-200 transform ${
                isHovered ? "scale-100" : "scale-75"
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>
          </Link>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`p-3 rounded-full bg-white/90 text-gray-700 hover:bg-green-500 hover:text-white backdrop-blur-sm transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed ${
              isHovered ? "scale-100" : "scale-75"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Sale Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              SALE
            </span>
          </div>
        )}

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold">Out of Stock</span>
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">${product.price || 0}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}
