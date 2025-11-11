"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin, TrendingUp, Calendar, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Crop {
  id: number
  name: string
  category: string
}

interface MarketPrice {
  id: number
  crop: {
    id: number
    name: string
  }
  market: string
  state: string
  lga: string
  price: number
  unit: string
  priceDate: string
  quality: string
}

// Dummy detailed market data with multiple locations per crop
const dummyDetailedPrices: MarketPrice[] = [
  // Rice prices across different markets
  { id: 1, crop: { id: 1, name: "Rice" }, market: "Makurdi Main Market", state: "Benue", lga: "Makurdi", price: 45000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "high" },
  { id: 2, crop: { id: 1, name: "Rice" }, market: "Gboko Market", state: "Benue", lga: "Gboko", price: 43000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "medium" },
  { id: 3, crop: { id: 1, name: "Rice" }, market: "Otukpo Market", state: "Benue", lga: "Otukpo", price: 44500, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "high" },
  { id: 4, crop: { id: 1, name: "Rice" }, market: "Katsina-Ala Market", state: "Benue", lga: "Katsina-Ala", price: 42000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "medium" },
  
  // Yam prices across different markets
  { id: 5, crop: { id: 2, name: "Yam" }, market: "Makurdi Main Market", state: "Benue", lga: "Makurdi", price: 25000, unit: "tuber", priceDate: "2024-01-15", quality: "high" },
  { id: 6, crop: { id: 2, name: "Yam" }, market: "Gboko Market", state: "Benue", lga: "Gboko", price: 22000, unit: "tuber", priceDate: "2024-01-15", quality: "medium" },
  { id: 7, crop: { id: 2, name: "Yam" }, market: "Vandeikya Market", state: "Benue", lga: "Vandeikya", price: 24000, unit: "tuber", priceDate: "2024-01-15", quality: "high" },
  { id: 8, crop: { id: 2, name: "Yam" }, market: "Aliade Market", state: "Benue", lga: "Aliade", price: 23500, unit: "tuber", priceDate: "2024-01-15", quality: "medium" },
  
  // Cassava prices across different markets
  { id: 9, crop: { id: 3, name: "Cassava" }, market: "Makurdi Main Market", state: "Benue", lga: "Makurdi", price: 15000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "medium" },
  { id: 10, crop: { id: 3, name: "Cassava" }, market: "Otukpo Market", state: "Benue", lga: "Otukpo", price: 14500, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "medium" },
  { id: 11, crop: { id: 3, name: "Cassava" }, market: "Oju Market", state: "Benue", lga: "Oju", price: 16000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "high" },
  
  // Maize prices across different markets
  { id: 12, crop: { id: 4, name: "Maize" }, market: "Makurdi Main Market", state: "Benue", lga: "Makurdi", price: 35000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "high" },
  { id: 13, crop: { id: 4, name: "Maize" }, market: "Gboko Market", state: "Benue", lga: "Gboko", price: 33500, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "medium" },
  { id: 14, crop: { id: 4, name: "Maize" }, market: "Katsina-Ala Market", state: "Benue", lga: "Katsina-Ala", price: 34000, unit: "bag (50kg)", priceDate: "2024-01-15", quality: "high" },
]

export default function DetailedMarketPrices() {
  const [selectedView, setSelectedView] = useState<"all" | "by-crop">("all")
  const [selectedCrop, setSelectedCrop] = useState<string>("")
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>(dummyDetailedPrices)
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  // Get unique crops from the data
  const uniqueCrops = Array.from(
    new Map(dummyDetailedPrices.map(price => [price.crop.id, price.crop])).values()
  )

  useEffect(() => {
    if (selectedView === "all") {
      setFilteredPrices(dummyDetailedPrices)
    } else if (selectedView === "by-crop" && selectedCrop) {
      const cropPrices = dummyDetailedPrices.filter(
        price => price.crop.id.toString() === selectedCrop
      )
      setFilteredPrices(cropPrices)
    }
  }, [selectedView, selectedCrop])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriceRange = (cropId: number) => {
    const cropPrices = dummyDetailedPrices.filter(p => p.crop.id === cropId)
    if (cropPrices.length === 0) return { min: 0, max: 0, avg: 0 }
    
    const prices = cropPrices.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
    
    return { min, max, avg }
  }

  const groupedByCrop = uniqueCrops.map(crop => ({
    crop,
    prices: dummyDetailedPrices.filter(p => p.crop.id === crop.id),
    priceRange: getPriceRange(crop.id)
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Prices</h2>
          <p className="text-gray-600">Detailed crop prices across different markets in Benue State</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedView} onValueChange={(value: "all" | "by-crop") => setSelectedView(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="by-crop">By Crop</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedView === "by-crop" && (
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCrops.map((crop) => (
                  <SelectItem key={crop.id} value={crop.id.toString()}>
                    {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as "all" | "by-crop")}>
        <TabsList>
          <TabsTrigger value="all">All Markets</TabsTrigger>
          <TabsTrigger value="by-crop">By Crop Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrices.map((price) => (
              <Card key={price.id} className="border-green-200 hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{price.crop.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {price.market}
                      </CardDescription>
                      <p className="text-xs text-gray-500 mt-1">{price.lga}, {price.state}</p>
                    </div>
                    <Badge className={getQualityColor(price.quality)}>
                      {price.quality}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(price.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        per {price.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(price.priceDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-crop" className="space-y-6">
          {selectedCrop ? (
            <div className="space-y-4">
              {(() => {
                const cropData = groupedByCrop.find(g => g.crop.id.toString() === selectedCrop)
                if (!cropData) return null
                
                return (
                  <>
                    <Card className="border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {cropData.crop.name} Price Analysis
                          <Badge variant="outline">{cropData.prices.length} Markets</Badge>
                        </CardTitle>
                        <CardDescription>
                          Price comparison across different markets in Benue State
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Lowest Price</p>
                            <p className="text-xl font-bold text-red-600">
                              {formatPrice(cropData.priceRange.min)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Average Price</p>
                            <p className="text-xl font-bold text-blue-600">
                              {formatPrice(cropData.priceRange.avg)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Highest Price</p>
                            <p className="text-xl font-bold text-green-600">
                              {formatPrice(cropData.priceRange.max)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {cropData.prices
                        .sort((a, b) => b.price - a.price)
                        .map((price, index) => (
                        <Card 
                          key={price.id} 
                          className={`border-green-200 hover:shadow-md transition-all duration-300 ${
                            index === 0 ? 'ring-2 ring-green-500 ring-offset-2' : 
                            index === cropData.prices.length - 1 ? 'ring-2 ring-red-500 ring-offset-2' : ''
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {price.market}
                                  {index === 0 && <Badge className="bg-green-100 text-green-800">Highest</Badge>}
                                  {index === cropData.prices.length - 1 && <Badge className="bg-red-100 text-red-800">Lowest</Badge>}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {price.lga}, {price.state}
                                </CardDescription>
                              </div>
                              <Badge className={getQualityColor(price.quality)}>
                                {price.quality}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-green-600">
                                  {formatPrice(price.price)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  per {price.unit}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Updated {formatDate(price.priceDate)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Crop</h3>
                <p className="text-gray-600">Choose a crop from the dropdown to view detailed price analysis across different markets.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}