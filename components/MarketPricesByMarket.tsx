"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, TrendingUp } from "lucide-react"

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

export default function MarketPricesByMarket() {
  const [markets, setMarkets] = useState<string[]>([])
  const [selectedMarket, setSelectedMarket] = useState<string>("")
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetchMarkets()
  }, [])

  useEffect(() => {
    if (selectedMarket) {
      fetchMarketPrices(selectedMarket)
    }
  }, [selectedMarket])

  const fetchMarkets = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/markets`)
      if (response.ok) {
        const data = await response.json()
        setMarkets(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch markets:", error)
    } finally {
      setInitialLoading(false)
    }
  }

  const fetchMarketPrices = async (market: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/market/${encodeURIComponent(market)}`)
      
      if (response.ok) {
        const data = await response.json()
        setMarketPrices(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch market prices:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading markets...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Prices by Market Location</h2>
        <p className="text-gray-600">Browse all crop prices for a specific market location</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Market</CardTitle>
          <CardDescription>
            Choose a market to view all crop prices available at that location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a market to view prices" />
            </SelectTrigger>
            <SelectContent>
              {markets.map((market) => (
                <SelectItem key={market} value={market}>
                  {market}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedMarket && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <h3 className="text-xl font-semibold">Prices at {selectedMarket}</h3>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2">Loading market prices...</span>
            </div>
          ) : marketPrices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {marketPrices.map((price) => (
                <Card key={price.id} className="border-green-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{price.crop.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" />
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
                      <div className="text-xs text-gray-500">
                        Updated: {formatDate(price.priceDate)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prices Available</h3>
                <p className="text-gray-600">
                  No prices found for {selectedMarket}. Prices will appear here once they are added by administrators.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}