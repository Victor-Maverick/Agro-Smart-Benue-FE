"use client"

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface MarketStats {
  totalMarkets: number
  totalCrops: number
  totalPriceEntries: number
}

export default function MarketPriceStats() {
  const [stats, setStats] = useState<MarketStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/market-prices/statistics`)
      if (res.ok) {
        const data = await res.json()
        if (data.successful) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching market stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Loading statistics...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900">Total Markets</h3>
        <p className="text-2xl font-bold text-green-600">{stats?.totalMarkets || 0}</p>
        <p className="text-sm text-green-700">Active markets</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900">Tracked Crops</h3>
        <p className="text-2xl font-bold text-blue-600">{stats?.totalCrops || 0}</p>
        <p className="text-sm text-blue-700">Different crops</p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-900">Price Entries</h3>
        <p className="text-2xl font-bold text-orange-600">{stats?.totalPriceEntries || 0}</p>
        <p className="text-sm text-orange-700">Total records</p>
      </div>
    </div>
  )
}