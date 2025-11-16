"use client"

import { useState, useEffect } from 'react'
import { Sprout, Calendar } from 'lucide-react'

interface CropTip {
  id: number
  title: string
  description: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export default function CropTipsPage() {
  const [cropTips, setCropTips] = useState<CropTip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCropTips()
  }, [])

  const fetchCropTips = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crop-tips/all`)
      const data = await res.json()
      if (data.successful) {
        setCropTips(data.data)
      }
    } catch (error) {
      console.error('Error fetching crop tips:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sprout size={48} />
            <h1 className="text-4xl font-bold">Crop Tips & Advice</h1>
          </div>
          <p className="text-center text-green-100 text-lg max-w-2xl mx-auto">
            Expert farming tips and best practices to help you maximize your crop yields
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {cropTips.length === 0 ? (
          <div className="text-center py-12">
            <Sprout size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No crop tips available at the moment</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cropTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {tip.imageUrls && tip.imageUrls.length > 0 && (
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={tip.imageUrls[0]}
                      alt={tip.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{tip.title}</h2>
                  <p className="text-gray-700 mb-4 line-clamp-3">{tip.description}</p>
                  
                  {tip.imageUrls && tip.imageUrls.length > 1 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {tip.imageUrls.slice(1).map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${tip.title} ${idx + 2}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 pt-4 border-t">
                    <Calendar size={16} className="mr-2" />
                    <span>Posted {new Date(tip.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
