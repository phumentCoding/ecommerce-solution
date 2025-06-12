"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { Search, Grid, List } from "lucide-react"
import { fetchProducts } from "../store/slices/productsSlice"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

const Products = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (categoryFilter) params.set("category", categoryFilter)
    if (sortBy !== "name") params.set("sort", sortBy)
    setSearchParams(params)
  }, [searchTerm, categoryFilter, sortBy, setSearchParams])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          return b.rating - a.rating
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const categories = [...new Set(products.map((product) => product.category))]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <p className="text-red-600">Error loading products: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">Discover our complete collection of premium products</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid-responsive" : "space-y-4"}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
