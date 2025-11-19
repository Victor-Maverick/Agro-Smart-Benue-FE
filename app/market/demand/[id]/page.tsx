"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Copy, Check, Mail, Phone, Calendar, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import axios from "axios"

interface ProductDemand {
  id: number
  productName: string
  description?: string
  offerPrice: number
  quantity: number
  quantityCategory: string
  location: string
  phoneContact?: string
  phone?: string
  buyerName?: string
  createdAt: string
}

export default function DemandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [demand, setDemand] = useState<ProductDemand | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedPhone, setCopiedPhone] = useState(false)

  useEffect(() => {
    fetchDemand()
  }, [params.id])

  const fetchDemand = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demands/by-id?id=${params.id}`)
      if (response.data.status === true) {
        setDemand(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch demand:", error)
      setDemand(null)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
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
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading demand details...</p>
        </div>
      </div>
    )
  }

  if (!demand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Demand not found</p>
          <Link href="/market">
            <Button className="mt-4 bg-orange-600 hover:bg-orange-700">Back to Market</Button>
          </Link>
        </div>
      </div>
    )
  }

  const contactPhone = demand.phoneContact || demand.phone

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Market
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-3 bg-orange-600">Product in Demand</Badge>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{demand.productName}</h1>
                  {demand.buyerName && (
                    <p className="text-lg text-gray-600">Requested by {demand.buyerName}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Offer Price</p>
                  <p className="text-3xl font-bold text-orange-600">{formatPrice(demand.offerPrice)}</p>
                  <p className="text-sm text-gray-500">per {demand.quantityCategory}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity Needed</p>
                    <p className="text-xl font-semibold">{demand.quantity} {demand.quantityCategory}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-xl font-semibold">{demand.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posted On</p>
                    <p className="text-xl font-semibold">{formatDate(demand.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          {demand.description && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{demand.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-900">Contact Buyer</h3>
              <div className="space-y-3">
                {contactPhone && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Phone className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold text-gray-900">{contactPhone}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(contactPhone)}
                      className="border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
