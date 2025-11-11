"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, User, Star, Phone, Mail, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  quantity: number
  location: string
  imageUrl: string
  farmer: {
    name: string
    rating: number
    contact?: string
    email?: string
  }
  category: string
  createdAt?: string
}

const dummyProduct: Product = {
  id: 1,
  name: "Premium Rice",
  description: "High-quality locally grown rice from Makurdi farms. This rice is carefully selected and processed to ensure the best quality for your consumption. Grown using organic farming methods and harvested at the perfect time for maximum flavor and nutrition.",
  price: 45000,
  unit: "bag (50kg)",
  quantity: 100,
  location: "Makurdi, Benue State",
  imageUrl: "https://res.cloudinary.com/dgswwi2ye/image/upload/v1730965630/rice_sample.jpg",
  farmer: {
    name: "Emmanuel Terkimbi",
    rating: 4.8,
    contact: "+234 803 XXX XXXX",
    email: "emmanuel.t@example.com"
  },
  category: "Grains",
  createdAt: "2025-11-01"
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.data || dummyProduct)
      } else {
        setProduct(dummyProduct)
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      setProduct(dummyProduct)
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
      month: "long",
      day: "numeric",
    })
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
          <p className="text-gray-600">Product not found</p>
          <Link href="/market">
            <Button className="mt-4 bg-green-600 hover:bg-green-700">Back to Market</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[80px]">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 text-green-800 hover:text-green-900 transition-colors">
                <Image src="/images/header image.png" alt="BFPC Logo" width={64} height={64} />
                <p className="font-bold leading-tight">Benue <span className="text-orange-600">Farmers</span> <br />Peace Corps</p>
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/#features" className="text-green-700 hover:text-green-900 transition-colors">Features</Link>
              <Link href="/market" className="text-green-700 hover:text-green-900 font-semibold transition-colors">Market</Link>
              <Link href="/market-prices" className="text-green-700 hover:text-green-900 transition-colors">Market Prices</Link>
              <Link href="/#about" className="text-green-700 hover:text-green-900 transition-colors">About</Link>
              <Link href="/login" className="text-green-700 hover:text-green-900 transition-colors">Login</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Market
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-green-600 text-lg px-4 py-2">
              {product.category}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
                {product.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Listed {formatDate(product.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-green-600">{formatPrice(product.price)}</span>
                  <span className="text-gray-600">per {product.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>{product.quantity} {product.unit} available</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farmer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.farmer.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{product.farmer.rating} rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                {product.farmer.contact && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{product.farmer.contact}</span>
                  </div>
                )}
                {product.farmer.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{product.farmer.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6">
                Contact Farmer
              </Button>
              <Button variant="outline" className="flex-1 border-green-600 text-green-600 hover:bg-green-50 text-lg py-6">
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
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
                <li><Link href="/market-prices" className="text-green-100 hover:text-white">Market Prices</Link></li>
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
