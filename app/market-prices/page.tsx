"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CropPricesByMarket from "@/components/CropPricesByMarket"
import SlidingMarketPrices from "@/components/SlidingMarketPrices"

export default function MarketPricesPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">Market Prices</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural Market Prices</h1>
          <p className="text-lg text-gray-600">
            Real-time crop prices across different markets in Benue State
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Price Overview</TabsTrigger>
            <TabsTrigger value="by-crop">Prices by Crop</TabsTrigger>
            <TabsTrigger value="by-market">Prices by Market</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Market Trends</CardTitle>
                    <CardDescription>
                      Live price updates from major markets across Benue State
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-green-900">Total Markets</h3>
                          <p className="text-2xl font-bold text-green-600">8</p>
                          <p className="text-sm text-green-700">Active markets</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-900">Tracked Crops</h3>
                          <p className="text-2xl font-bold text-blue-600">15</p>
                          <p className="text-sm text-blue-700">Different crops</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-orange-900">Price Updates</h3>
                          <p className="text-2xl font-bold text-orange-600">Daily</p>
                          <p className="text-sm text-orange-700">Fresh data</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Featured Markets</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">Makurdi Main Market</h5>
                            <p className="text-sm text-gray-600">Largest market in Benue State</p>
                            <p className="text-xs text-gray-500 mt-1">Makurdi LGA</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">Gboko Market</h5>
                            <p className="text-sm text-gray-600">Major yam trading center</p>
                            <p className="text-xs text-gray-500 mt-1">Gboko LGA</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">Otukpo Market</h5>
                            <p className="text-sm text-gray-600">Rice and grain hub</p>
                            <p className="text-xs text-gray-500 mt-1">Otukpo LGA</p>
                          </div>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">Katsina-Ala Market</h5>
                            <p className="text-sm text-gray-600">Soybean trading center</p>
                            <p className="text-xs text-gray-500 mt-1">Katsina-Ala LGA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <SlidingMarketPrices />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="by-crop">
            <CropPricesByMarket />
          </TabsContent>

          <TabsContent value="by-market">
            <Card>
              <CardHeader>
                <CardTitle>Prices by Market Location</CardTitle>
                <CardDescription>
                  Browse crop prices organized by market and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Market-based price view coming soon...</p>
                  <p className="text-sm text-gray-500">
                    This feature will allow you to browse all crop prices for a specific market location.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}