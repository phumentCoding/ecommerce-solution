"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"

// Utility to group products by category
function groupByCategory(products) {
  return products.reduce((groups, product) => {
    if (!groups[product.category]) {
      groups[product.category] = [];
    }
    groups[product.category].push(product);
    return groups;
  }, {});
}

// For star ratings (full, half, empty)
function renderStars(rating) {
  const rounded = Math.round(rating * 2) / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.954L10 0l2.949 5.956 6.561.954-4.755 4.635 1.123 6.545z" />
        </svg>
      );
    } else if (rounded + 0.5 === i) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half${i}`}>
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="white"/>
            </linearGradient>
          </defs>
          <path fill={`url(#half${i})`} d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.954L10 0l2.949 5.956 6.561.954-4.755 4.635 1.123 6.545z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className="w-5 h-5 text-gray-300 inline" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.954L10 0l2.949 5.956 6.561.954-4.755 4.635 1.123 6.545z" />
        </svg>
      );
    }
  }
  return stars;
}

// Main Categories Page
function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ecommerce-solution-api-main-f9fiq8.laravel.cloud/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
        <p>No products found.</p>
      </div>
    );
  }

  const categories = groupByCategory(products);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
      {Object.entries(categories).map(([category, prods]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {prods.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default CategoriesPage;