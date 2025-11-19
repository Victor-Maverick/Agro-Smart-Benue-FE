"use client"

import SingleCropPieChart from "@/components/SingleCropPieChart"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function MarketPricesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Market Price Analysis</h1>
          <p className="text-lg text-gray-600">View price distribution across different markets</p>
        </div>

        <SingleCropPieChart />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
