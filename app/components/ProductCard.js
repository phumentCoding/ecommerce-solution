"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext"; // Adjust path as needed
import { useWishlist } from "../context/WishlistContext"; // If you use wishlist context
import { Heart, Eye, Star } from "lucide-react"; // Or your own icon components

function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist ? useWishlist() : { toggleWishlist: () => {}, isInWishlist: () => false };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
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
          onLoadingComplete={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow ${
                isInWishlist(product) ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product) ? "fill-current" : ""}`} />
            </button>
            <Link href={`/products/${product.id}`}>
              <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-900" aria-label="View details">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Sale badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">SALE</span>
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
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">${product.price || 0}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          {product.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{product.category}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;