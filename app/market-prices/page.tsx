"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/Header"
import CropPricesByMarket from "@/components/CropPricesByMarket"
import SlidingMarketPrices from "@/components/SlidingMarketPrices"
import MarketPriceStats from "@/components/MarketPriceStats"
import MarketPricesByMarket from "@/components/MarketPricesByMarket"

export default function MarketPricesPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

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
                      <MarketPriceStats />
                      
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
            <MarketPricesByMarket />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}