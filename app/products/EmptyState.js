"use client"

import { Search } from "lucide-react"

export default function EmptyState({ onClearFilters }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No products found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We could not find any products matching your criteria. Try adjusting your search or filters.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
      >
        Clear all filters
      </button>
    </div>
  )
}
