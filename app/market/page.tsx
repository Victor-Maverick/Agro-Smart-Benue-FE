"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Package, ShoppingCart, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SlidingMarketPrices from "@/components/SlidingMarketPrices"
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



export default function MarketPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [demands, setDemands] = useState<ProductDemand[]>([])
  const [loading, setLoading] = useState(true)
  const [topPerformer, setTopPerformer] = useState<Product | null>(null)

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const productsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/all`)
      console.log("Products", productsRes.data)
      if (productsRes.data.status === true) {
        const fetchedProducts = productsRes.data.data || []
        setProducts(fetchedProducts)
        setTopPerformer(fetchedProducts[0] || null)
      }

      const demandsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demands`)
      console.log("Demands: ", demandsRes.data)
      if (demandsRes.data.status === true) {
        const fetchedDemands = demandsRes.data.data || []
        setDemands(fetchedDemands)
      }
    } catch (error) {
      console.error("Failed to fetch market data:", error)
      setProducts([])
      setDemands([])
      setTopPerformer(null)
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



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BFPC Marketplace</h1>
          <p className="text-lg text-gray-600">Connect with farmers and buyers across Benue State</p>
        </div>

        {/* Sliding Market Prices */}
        <div className="mb-8">
          <SlidingMarketPrices />
        </div>

        {/* Top Performing Product */}
        {topPerformer && (
          <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                <CardTitle className="text-2xl">Top Performing Product</CardTitle>
              </div>
              <CardDescription>Most popular product this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={topPerformer.imageUrl}
                    alt={topPerformer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{topPerformer.name}</h3>
                    <p className="text-gray-600 mb-4">{topPerformer.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{topPerformer.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{topPerformer.quantity} {topPerformer.quantityCategory} available</span>
                      </div>
                      {topPerformer.farmerName && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Farmer: {topPerformer.farmerName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{formatPrice(topPerformer.unitPrice)}</p>
                      <p className="text-sm text-gray-500">per {topPerformer.quantityCategory}</p>
                    </div>
                    <Link href={`/market/${topPerformer.id}`}>
                      <Button className="bg-green-600 hover:bg-green-700">
                        View Details <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Products and Demands */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="demands">Products in Demand</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No products available</p>
                <p className="text-gray-500">Check back later for new products</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-600">{product.quantityCategory}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{product.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{formatPrice(product.unitPrice)}</p>
                          <p className="text-xs text-gray-500">per {product.quantityCategory}</p>
                        </div>
                        <Link href={`/market/${product.id}`}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                      {product.farmerName && (
                        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                          <span>Farmer: {product.farmerName}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="demands" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading demands...</p>
              </div>
            ) : demands.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No demands available</p>
                <p className="text-gray-500">Check back later for new demands</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {demands.map((demand) => (
                <Card key={demand.id} className="border-orange-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{demand.productName}</CardTitle>
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        In Demand
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Quantity Needed</p>
                          <p className="text-lg font-semibold">{demand.quantity} {demand.quantityCategory}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Offer Price</p>
                          <p className="text-lg font-semibold text-green-600">{formatPrice(demand.offerPrice)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{demand.location}</span>
                      </div>
                      {demand.buyerName && (
                        <div className="pt-3 border-t">
                          <p className="text-sm text-gray-600">Buyer: {demand.buyerName}</p>
                        </div>
                      )}
                      <Link href={`/market/demand/${demand.id}`}>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
