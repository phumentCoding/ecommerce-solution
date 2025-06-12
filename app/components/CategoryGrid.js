"use client"

import { Smartphone, Laptop, Headphones, Watch, Camera, Gamepad2 } from "lucide-react"
import Link from "next/link"

const categories = [
  { name: "Electronics", icon: Smartphone, color: "from-blue-500 to-blue-600", count: "250+ items" },
  { name: "Computers", icon: Laptop, color: "from-purple-500 to-purple-600", count: "180+ items" },
  { name: "Audio", icon: Headphones, color: "from-green-500 to-green-600", count: "120+ items" },
  { name: "Wearables", icon: Watch, color: "from-orange-500 to-orange-600", count: "90+ items" },
  { name: "Photography", icon: Camera, color: "from-pink-500 to-pink-600", count: "150+ items" },
  { name: "Gaming", icon: Gamepad2, color: "from-red-500 to-red-600", count: "200+ items" },
]

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-white/30 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of premium products across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={`/products?category=${category.name}`}>
                <div
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-500 border border-white/20 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.count}</p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
