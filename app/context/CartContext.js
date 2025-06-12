"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
        console.log("📦 Loaded cart from localStorage:", parsedCart)
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
      console.log("💾 Saved cart to localStorage:", cartItems)
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    console.log("🛒 Adding to cart:", product.name, "Quantity:", quantity)

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
        console.log("📈 Updated existing item quantity:", updatedItems)
        return updatedItems
      } else {
        // Add new item to cart
        const newItems = [...prevItems, { ...product, quantity }]
        console.log("✨ Added new item to cart:", newItems)
        return newItems
      }
    })

    // Show success feedback
    console.log(`✅ Successfully added ${product.name} to cart`)
  }

  const removeFromCart = (productId) => {
    console.log("🗑️ Removing from cart:", productId)
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId)
      console.log("Updated cart after removal:", updatedItems)
      return updatedItems
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    console.log("🔄 Updating quantity:", productId, "New quantity:", newQuantity)

    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const clearCart = () => {
    console.log("🧹 Clearing cart")
    setCartItems([])
    localStorage.removeItem("cart")
  }

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    return total
  }

  const getCartItemsCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0)
    return count
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    setIsCartOpen,
  }

  console.log("🛒 Cart Context State:", {
    itemsCount: cartItems.length,
    totalItems: getCartItemsCount(),
    total: getCartTotal(),
    isOpen: isCartOpen,
  })

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
