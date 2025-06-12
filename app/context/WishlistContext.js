"use client"

import { createContext, useContext, useState, useEffect } from "react"

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const isAlreadyInWishlist = prevItems.some((item) => item.id === product.id)
      if (!isAlreadyInWishlist) {
        console.log(`Added ${product.name} to wishlist`)
        return [...prevItems, product]
      }
      return prevItems
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId)
      console.log(`Removed product ${productId} from wishlist`)
      return updatedItems
    })
  }

  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id)
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
