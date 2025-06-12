"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react"
import { fetchProducts } from "../store/slices/productsSlice"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const featuredProducts = products.filter((product) => product.featured).slice(0, 8)

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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Welcome to TechMart</h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover amazing products at unbeatable prices. From cutting-edge electronics to premium home goods, we
              have everything you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="btn-primary bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/products?featured=true"
                className="btn-outline border-white text-white hover:bg-white hover:text-blue-600 inline-flex items-center justify-center"
              >
                View Featured Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $100</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe with us</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products that our customers love most.
            </p>
          </div>

          <div className="grid-responsive">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary inline-flex items-center">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Electronics",
                image: "/placeholder.svg?height=200&width=300&text=Electronics",
                count: "50+ Products",
              },
              { name: "Sports", image: "/placeholder.svg?height=200&width=300&text=Sports", count: "30+ Products" },
              { name: "Home", image: "/placeholder.svg?height=200&width=300&text=Home", count: "40+ Products" },
              {
                name: "Accessories",
                image: "/placeholder.svg?height=200&width=300&text=Accessories",
                count: "25+ Products",
              },
            ].map((category) => (
              <Link key={category.name} to={`/products?category=${category.name}`} className="group card card-hover">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive
            deals.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
            />
            <button className="btn-primary bg-white text-blue-600 hover:bg-gray-100">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
