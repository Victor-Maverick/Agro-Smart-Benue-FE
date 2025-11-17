"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import Dropdown from "@/components/Dropdown"

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6']

interface Crop {
  id: number
  name: string
}

interface MarketPriceData {
  market: string
  averagePrice: number
  priceCount: number
}

interface SingleCropPieChartProps {
  showTitle?: boolean
  className?: string
}

export default function SingleCropPieChart({ showTitle = true, className = "" }: SingleCropPieChartProps) {
  const [crops, setCrops] = useState<Crop[]>([])
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [priceData, setPriceData] = useState<MarketPriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingPrices, setLoadingPrices] = useState(false)

  useEffect(() => {
    fetchCrops()
  }, [])

  useEffect(() => {
    if (selectedCrop) {
      fetchCropPrices(selectedCrop.id)
    }
  }, [selectedCrop])

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crops`)
      if (res.ok) {
        const data = await res.json()
        const cropsData = data.data || []
        setCrops(cropsData)
        // Auto-select first crop if available
        if (cropsData.length > 0) {
          setSelectedCrop(cropsData[0])
        }
      }
    } catch (error) {
      console.error('Error fetching crops:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCropPrices = async (cropId: number) => {
    setLoadingPrices(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/crop/${cropId}/by-market`)
      if (res.ok) {
        const data = await res.json()
        const prices = data.data || []
        
        // Group by market and calculate average
        const marketMap = new Map<string, { total: number; count: number }>()
        
        prices.forEach((price: any) => {
          const market = price.market
          if (!marketMap.has(market)) {
            marketMap.set(market, { total: 0, count: 0 })
          }
          const current = marketMap.get(market)!
          current.total += price.price
          current.count += 1
        })

        // Convert to array format for pie chart
        const chartData: MarketPriceData[] = Array.from(marketMap.entries()).map(([market, data]) => ({
          market,
          averagePrice: Math.round(data.total / data.count),
          priceCount: data.count
        }))

        setPriceData(chartData)
      }
    } catch (error) {
      console.error('Error fetching crop prices:', error)
    } finally {
      setLoadingPrices(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2">Loading...</span>
        </CardContent>
      </Card>
    )
  }

  if (crops.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No crops available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        {showTitle && (
          <>
            <CardTitle>Market Price Distribution</CardTitle>
            <CardDescription>Average prices across different markets for selected crop</CardDescription>
          </>
        )}
        <div className="mt-4">
          <Dropdown
            options={crops}
            selectedOption={selectedCrop}
            onSelect={(crop) => setSelectedCrop(crop)}
            placeholder="Select a crop"
            getLabel={(crop) => crop.name}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loadingPrices ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2">Loading price data...</span>
          </div>
        ) : priceData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={priceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ market, percent }) => `${market}: ${(Number(percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="averagePrice"
                >
                  {priceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatPrice(value)}
                  labelFormatter={(label) => `Market: ${label}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-4">Market Breakdown for {selectedCrop?.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priceData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{data.market}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatPrice(data.averagePrice)}</p>
                      <p className="text-xs text-gray-500">{data.priceCount} entries</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No price data available for {selectedCrop?.name}</p>
            <p className="text-sm text-gray-400 mt-2">Add market prices to see the distribution</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
