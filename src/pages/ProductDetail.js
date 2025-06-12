"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft } from "lucide-react"
import { fetchProductById } from "../store/slices/productsSlice"
import { addToCart } from "../store/slices/cartSlice"
import LoadingSpinner from "../components/LoadingSpinner"

const ProductDetail = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { currentProduct: product, loading } = useSelector((state) => state.products)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (product) {
      setSelectedImage(0)
    }
  }, [product])

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
        }),
      )
    }
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || [product.image]

  return (
    <div className="container-custom py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <span className="badge badge-info">{product.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            <span className={`badge ${product.stock > 0 ? "badge-success" : "badge-error"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
            </button>
            <button className="btn-outline flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Add to Wishlist</span>
            </button>
          </div>

          {/* Product Specifications */}
          {product.specifications && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Back to Products */}
      <div className="mt-12">
        <Link to="/products" className="btn-secondary inline-flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    </div>
  )
}

export default ProductDetail
