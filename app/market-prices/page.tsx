"use client"

import SingleCropPieChart from "@/components/SingleCropPieChart"
import Header from "@/components/Header"
import Link from "next/link"

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
      <footer className="bg-green-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BFPC</h3>
              <p className="text-green-100">Empowering Benue farmers with technology and market access.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-green-100 hover:text-white">Home</Link></li>
                <li><Link href="/market" className="text-green-100 hover:text-white">Market</Link></li>
                <li><Link href="/market-prices" className="text-green-100 hover:text-white">Market Prices</Link></li>
                <li><Link href="/crop-tips" className="text-green-100 hover:text-white">Crop Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-green-100">
                <li>Email: info@bfpc.org</li>
                <li>Phone: +234 XXX XXX XXXX</li>
                <li>Makurdi, Benue State</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-green-100 hover:text-white">Facebook</a>
                <a href="#" className="text-green-100 hover:text-white">Twitter</a>
                <a href="#" className="text-green-100 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-100">
            <p>&copy; 2025 Benue Farmers Peace Corps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
