"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react"

interface CropTip {
  id: number
  title: string
  description: string
  imageUrls: string[]
  createdAt: string
}

export default function CropTipsCarousel() {
  const router = useRouter()
  const [cropTips, setCropTips] = useState<CropTip[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCropTips()
  }, [])

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (cropTips.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cropTips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [cropTips.length])

  const fetchCropTips = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips/all`)
      const data = await res.json()
      if (data.status === true && data.data) {
        // Get first 5 tips
        setCropTips(data.data.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching crop tips:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cropTips.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cropTips.length)
  }

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Don't render if no tips or still loading
  if (loading || cropTips.length === 0) {
    return null
  }

  const currentTip = cropTips[currentIndex]

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900">Farming Tips</h2>
          </div>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Expert advice and best practices for successful farming
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="border-green-200 shadow-lg">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                {currentTip.imageUrls && currentTip.imageUrls.length > 0 && (
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={currentTip.imageUrls[0]}
                      alt={currentTip.title}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {currentTip.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {truncateDescription(currentTip.description)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => router.push(`/crop-tips/${currentTip.id}`)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Read More
                    </Button>

                    {/* Carousel Indicators */}
                    <div className="flex gap-2">
                      {cropTips.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex
                              ? 'bg-green-600 w-8'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to tip ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Previous tip"
          >
            <ChevronLeft className="h-6 w-6 text-green-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Next tip"
          >
            <ChevronRight className="h-6 w-6 text-green-600" />
          </button>
        </div>

        {/* View All Tips Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => router.push('/crop-tips')}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            View All Tips
          </Button>
        </div>
      </div>
    </section>
  )
}
