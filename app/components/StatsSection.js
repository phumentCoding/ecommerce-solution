"use client"

import { TrendingUp, Users, Award, Globe } from "lucide-react"

const stats = [
  { icon: Users, value: "50,000+", label: "Happy Customers", color: "from-blue-500 to-blue-600" },
  { icon: Award, value: "1,000+", label: "Premium Products", color: "from-green-500 to-green-600" },
  { icon: TrendingUp, value: "99.9%", label: "Customer Satisfaction", color: "from-purple-500 to-purple-600" },
  { icon: Globe, value: "50+", label: "Countries Served", color: "from-orange-500 to-orange-600" },
]

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Trusted Worldwide</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their premium product needs
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
