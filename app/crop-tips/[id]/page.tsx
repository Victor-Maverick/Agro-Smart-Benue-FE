"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from 'next/link'
import Header from "@/components/Header"

interface CropTip {
  id: number
  title: string
  description: string
  imageUrls: string[]
  createdAt: string
}

export default function CropTipDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [cropTip, setCropTip] = useState<CropTip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCropTip(params.id as string)
    }
  }, [params.id])

  const fetchCropTip = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips/${id}`)
      const data = await res.json()
      if (data.status === true) {
        setCropTip(data.data)
      }
    } catch (error) {
      console.error('Error fetching crop tip:', error)
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
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!cropTip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-2">Crop Tip Not Found</h3>
              <Button onClick={() => router.push('/crop-tips')}>
                View All Tips
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/crop-tips')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Tips
        </Button>

        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{cropTip.title}</h1>
            <p className="text-sm text-gray-500 mb-6">Published on {formatDate(cropTip.createdAt)}</p>
            
            {cropTip.imageUrls && cropTip.imageUrls.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cropTip.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${cropTip.title} - Image ${idx + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {cropTip.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BFPC</h3>
              <p className="text-green-100">Empowering Benue farmers with technology and market access.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-green-100 hover:text-white">Home</Link></li>
                <li><Link href="/market" className="text-green-100 hover:text-white">Market</Link></li>
                <li><Link href="/crop-tips" className="text-green-100 hover:text-white">Crop Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-green-100">
                <li>Email: info@bfpc.org</li>
                <li>Phone: +234 XXX XXX XXXX</li>
                <li>Makurdi, Benue State</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-green-100 hover:text-white">Facebook</a>
                <a href="#" className="text-green-100 hover:text-white">Twitter</a>
                <a href="#" className="text-green-100 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-100">
            <p>&copy; 2025 Benue Farmers Peace Corps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
