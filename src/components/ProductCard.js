"use client"

import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ShoppingCart, Star } from "lucide-react"
import { addToCart } from "../store/slices/cartSlice"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }),
    )
  }

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="card card-hover animate-fade-in">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && <span className="absolute top-2 left-2 badge badge-info">Featured</span>}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">{product.category}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
