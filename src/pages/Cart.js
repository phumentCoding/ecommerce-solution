"use client"

import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { updateQuantity, removeFromCart } from "../store/slices/cartSlice"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login")
    } else {
      navigate("/checkout")
    }
  }

  const shippingCost = 10.0
  const taxRate = 0.08
  const tax = total * taxRate
  const finalTotal = total + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart to get started.</p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full sm:w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">${item.price} each</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-800 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full mb-4">
              Proceed to Checkout
            </button>

            <Link to="/products" className="btn-secondary w-full text-center block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
