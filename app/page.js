"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Star, Truck, Shield, Headphones, Heart, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "./context/CartContext"
import { useWishlist } from "./context/WishlistContext"

export default function HomePage() {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products from JSON server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://ecommerce-solution-api-main-f9fiq8.laravel.cloud/api/products")
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
    addToCart(product, 1)
    console.log("🛒 Added to cart:", product.name)
  }

  const handleToggleWishlist = (product) => {
    toggleWishlist(product)
  }

  const featuredProducts = products.slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Welcome to Our Store</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing products at great prices. Quality you can trust, service you can count on.
            </p>
            <Link href="/products">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">We're here to help anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Check out our most popular items</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="bg-gray-200 rounded-xl h-48 mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading products: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">Get the latest news and exclusive offers</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button className="bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
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
          className={`object-cover ${imageLoaded ? "opacity-100" : "opacity-0"} transition-opacity`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${
                isInWishlist ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
            </button>

            <Link href={`/products/${product.id}`}>
              <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-900">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Sale badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">SALE</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name || "Unnamed Product"}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description || "No description available"}</p>

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
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">${product.price || 0}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          {product.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
