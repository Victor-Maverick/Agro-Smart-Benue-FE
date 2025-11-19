"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, ArrowLeft, Star, Copy, Check, Mail, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import axios from "axios"

interface Product {
  id: number
  name: string
  description: string
  unitPrice: number
  quantity: number
  quantityCategory: string
  location: string
  imageUrl: string
  farmerName?: string
  phone?: string
  available: boolean
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/get-by-id?id=${params.id}`)
      if (response.data.status === true) {
        setProduct(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'phone') {
        setCopiedPhone(true)
        setTimeout(() => setCopiedPhone(false), 2000)
      } else {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Product not found</p>
          <Link href="/market">
            <Button className="mt-4 bg-green-600 hover:bg-green-700">Back to Market</Button>
          </Link>
        </div>
      </div>
    )
  }

  const contactPhone = product.phone

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Market
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-green-600 text-lg px-4 py-2">
              {product.quantityCategory}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.farmerName && (
                <div className="flex items-center gap-4 text-gray-600">
                  <span>Farmer: {product.farmerName}</span>
                </div>
              )}
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-green-600">{formatPrice(product.unitPrice)}</p>
                    <p className="text-gray-600">per {product.quantityCategory}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Available Quantity</p>
                      <p className="text-xl font-semibold">{product.quantity} {product.quantityCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-sm font-semibold">{product.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-green-900">Contact Seller</h3>
                <div className="space-y-3">
                  {contactPhone && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-semibold text-gray-900">{contactPhone}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(contactPhone, 'phone')}
                        className="border-green-600 text-green-600 hover:bg-green-50"
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
