"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { ShoppingCart, User, Menu, X, Settings } from "lucide-react"
import { logout } from "../store/slices/authSlice"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = () => {
    dispatch(logout())
    setIsUserMenuOpen(false)
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TechMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Products
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="font-medium">{user?.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </div>
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              <Link
                to="/cart"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cartItemsCount})</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
