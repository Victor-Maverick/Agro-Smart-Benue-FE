"use client"

import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"

interface MarketPrice {
  id: number
  crop: {
    name: string
  }
  market: string
  price: number
  unit: string
  priceDate: string
}

export default function SlidingMarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/market-prices/recent`)
      if (response.ok) {
        const data = await response.json()
        setPrices(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch prices:", error)
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

  if (loading || prices.length === 0) {
    return null
  }

  return (
    <div className="overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-lg text-gray-900">Live Market Prices</h3>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-8">
          {[...prices, ...prices].map((price, index) => (
            <div
              key={`${price.id}-${index}`}
              className="flex-shrink-0 bg-white border border-green-200 rounded-lg p-4 min-w-[250px] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{price.crop.name}</p>
                  <p className="text-sm text-gray-600">{price.market}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(price.price)}</p>
                  <p className="text-xs text-gray-500">per {price.unit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
