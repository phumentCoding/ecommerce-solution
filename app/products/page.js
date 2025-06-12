"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Grid3X3, List, Star, ChevronDown, Heart } from "lucide-react"
import Image from "next/image"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name")
  const [viewMode, setViewMode] = useState("grid")

  // Fetch products from JSON server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("https://ecommerce-solution-api-main-f9fiq8.laravel.cloud/api/products")

        console.log("📡 Response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        console.log("✅ Products fetched successfully:", data)
        console.log("📊 Number of products:", data.length)

        setProducts(data)
      } catch (err) {
        console.error("❌ Error fetching products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (categoryFilter) params.set("category", categoryFilter)
    if (sortBy !== "name") params.set("sort", sortBy)

    const newUrl = params.toString() ? `?${params.toString()}` : "/products"
    router.push(newUrl, { scroll: false })
  }, [searchTerm, categoryFilter, sortBy, router])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
    console.log("🛒 Added to cart:", product.name)
  }

  const handleToggleWishlist = (product) => {
    toggleWishlist(product)
    console.log("❤️ Toggled wishlist:", product.name)
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !categoryFilter || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return a.name?.localeCompare(b.name) || 0
      }
    })

  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading Products...</h1>
            <p className="text-gray-600">Fetching data from JSON server</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="bg-gray-200 rounded-lg h-48 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cannot Connect to JSON Server</h2>
          <p className="text-gray-600 mb-4">Error: {error}</p>
          <div className="bg-gray-100 p-4 rounded-lg text-left text-sm">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Make sure JSON server is running</li>
              <li>
                Run: <code className="bg-gray-200 px-1 rounded">json-server --watch db.json --port 3001</code>
              </li>
              <li>
                Check:{" "}
                <a
                  href="http://localhost:3001/products"
                  target="_blank"
                  className="text-blue-600 underline"
                  rel="noreferrer"
                >
                  http://localhost:3001/products
                </a>
              </li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No products found
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-600">Your JSON server is connected but has no products.</p>
          <p className="text-sm text-gray-500 mt-2">Check your db.json file</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
          <p className="text-green-800">✅ Connected to JSON Server | {products.length} products loaded</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover our complete collection ({products.length} items)</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                index={index}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, viewMode, index, onAddToCart, onToggleWishlist, isInWishlist }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (viewMode === "list") {
    return (
      <div
        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div
              className={`absolute inset-0 bg-gray-200 rounded-lg ${imageLoaded ? "opacity-0" : "opacity-100"} transition-opacity`}
            />
            <Image
              src={
                product.image ||
                `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(product.name || "product")}`
              }
              alt={product.name || "Product"}
              fill
              className={`object-cover rounded-lg ${imageLoaded ? "opacity-100" : "opacity-0"} transition-opacity`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name || "Unnamed Product"}</h3>
              <button
                onClick={() => onToggleWishlist(product)}
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

              <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
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

        {/* Wishlist button */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isInWishlist ? "bg-white/90 text-red-500" : "bg-white/70 text-gray-600 hover:bg-white/90 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
        </button>

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">SALE</span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded font-medium">Out of Stock</span>
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
          {product.category && (
            <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.category}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">${product.price || 0}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
