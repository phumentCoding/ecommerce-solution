"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Menu, X, Search, Heart, Bell, ChevronDown, Sparkles, Plus, Minus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "../context/CartContext"

export default function Navbar() {
  const router = useRouter()
  const { cartItems, getCartItemsCount, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } =
    useCart()

  // Mock auth state - replace with your actual auth state management
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const cartItemsCount = getCartItemsCount()

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setIsUserMenuOpen(false)
    router.push("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setSearchFocused(false)
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_2px_20px_-2px_rgba(0,0,0,0.05)] border-b border-gray-100"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl transform transition-transform duration-300 group-hover:rotate-3"></div>
                <span className="relative text-white font-bold text-lg">S</span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">StyleStore</h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Products</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gray-900 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
              <Link
                href="/products"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
              >
                Products
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gray-900 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
              >
                Categories
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gray-900 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
              <Link
                href="/deals"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group flex items-center gap-1"
              >
                <span>Deals</span>
                <Sparkles className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gray-900 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className={`w-full pl-11 pr-4 py-2.5 bg-gray-50 border transition-all duration-300 rounded-xl focus:outline-none ${
                    searchFocused
                      ? "border-gray-400 shadow-[0_0_0_4px_rgba(229,231,235,0.5)] bg-white"
                      : "border-gray-200"
                  }`}
                />
                <Search
                  className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    searchFocused ? "text-gray-700" : "text-gray-400"
                  } w-4 h-4`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="relative p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                  <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </Link>

              {/* Notifications */}
              {isAuthenticated && (
                <button className="relative p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                  <Bell className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-medium transform transition-transform duration-300 group-hover:scale-110">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Menu - Same as before */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-white font-medium text-xs">{user?.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown - Same as before */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in-up overflow-hidden">
                      {/* User dropdown content same as before */}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium relative group overflow-hidden">
                      <span className="relative z-10">Sign Up</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Same as before */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in-up">
            {/* Mobile menu content same as before */}
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 translate-x-0">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopping Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {cartItemsCount}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItemsCount === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
                  <Link href="/products">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium inline-flex items-center gap-2"
                    >
                      <span>Browse Products</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            item.image || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.name)}`
                          }
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium">
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  )
}
