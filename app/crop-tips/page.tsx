"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Leaf } from "lucide-react"
import Link from 'next/link'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface CropTip {
  id: number
  title: string
  description: string
  imageUrls: string[]
  createdAt: string
}

export default function CropTipsPage() {
  const router = useRouter()
  const [cropTips, setCropTips] = useState<CropTip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCropTips()
  }, [])

  const fetchCropTips = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips/all`)
      const data = await res.json()
      if (data.status === true) {
        setCropTips(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching crop tips:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading crop tips...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Farming Tips</h1>
          <p className="text-lg text-gray-600">Expert advice and best practices for successful farming</p>
        </div>

        {cropTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropTips.map((tip) => (
              <Card 
                key={tip.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/crop-tips/${tip.id}`)}
              >
                {tip.imageUrls && tip.imageUrls.length > 0 && (
                  <div className="relative h-48 w-full">
                    <img
                      src={tip.imageUrls[0]}
                      alt={tip.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{tip.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-3">{tip.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{formatDate(tip.createdAt)}</span>
                    <Button variant="link" className="text-green-600 p-0">
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tips Available</h3>
              <p className="text-gray-600">Check back later for farming tips and advice</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
