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
  }
  category: string
}

interface ProductDemand {
  id: number
  productName: string
  quantity: number
  unit: string
  maxPrice: number
  location: string
  buyer: {
    name: string
    contact: string
  }
  deadline: string
}

const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Premium Rice",
    description: "High-quality locally grown rice from Makurdi farms",
    price: 45000,
    unit: "bag (50kg)",
    quantity: 100,
    location: "Makurdi, Benue",
    imageUrl: "https://res.cloudinary.com/dgswwi2ye/image/upload/v1730965630/rice_sample.jpg",
    farmer: { name: "Emmanuel Terkimbi", rating: 4.8 },
    category: "Grains"
  },
  {
    id: 2,
    name: "Fresh Yam Tubers",
    description: "Freshly harvested yam tubers, perfect for consumption",
    price: 2500,
    unit: "tuber",
    quantity: 500,
    location: "Gboko, Benue",
    imageUrl: "https://res.cloudinary.com/dgswwi2ye/image/upload/v1730965630/yam_sample.jpg",
    farmer: { name: "Mary Ochoga", rating: 4.9 },
    category: "Tubers"
  }
]

const dummyDemands: ProductDemand[] = [
  {
    id: 1,
    productName: "Cassava",
    quantity: 200,
    unit: "bags",
    maxPrice: 15000,
    location: "Otukpo, Benue",
    buyer: { name: "John Agbo", contact: "+234 803 XXX XXXX" },
    deadline: "2025-11-15"
  },
  {
    id: 2,
    productName: "Soybeans",
    quantity: 50,
    unit: "bags",
    maxPrice: 54000,
    location: "Katsina-Ala, Benue",
    buyer: { name: "Grace Iortyom", contact: "+234 805 XXX XXXX" },
    deadline: "2025-11-20"
  }
]

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
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`)
      if (productsRes.ok) {
        const data = await productsRes.json()
        const fetchedProducts = data.data || []
        setProducts(fetchedProducts.length > 0 ? fetchedProducts : dummyProducts)
        if (fetchedProducts.length > 0) {
          setTopPerformer(fetchedProducts[0])
        } else {
          setTopPerformer(dummyProducts[0])
        }
      } else {
        setProducts(dummyProducts)
        setTopPerformer(dummyProducts[0])
      }

      const demandsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product-demands`)
      if (demandsRes.ok) {
        const data = await demandsRes.json()
        const fetchedDemands = data.data || []
        setDemands(fetchedDemands.length > 0 ? fetchedDemands : dummyDemands)
      } else {
        setDemands(dummyDemands)
      }
    } catch (error) {
      console.error("Failed to fetch market data:", error)
      setProducts(dummyProducts)
      setDemands(dummyDemands)
      setTopPerformer(dummyProducts[0])
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
      month: "short",
      day: "numeric",
    })
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
                        <span className="text-sm text-gray-600">{topPerformer.quantity} {topPerformer.unit} available</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{formatPrice(topPerformer.price)}</p>
                      <p className="text-sm text-gray-500">per {topPerformer.unit}</p>
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
                    <Badge className="absolute top-2 right-2 bg-green-600">{product.category}</Badge>
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
                          <p className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</p>
                          <p className="text-xs text-gray-500">per {product.unit}</p>
                        </div>
                        <Link href={`/market/${product.id}`}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                        <span>{product.farmer.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{product.farmer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="demands" className="space-y-6">
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
                          <p className="text-lg font-semibold">{demand.quantity} {demand.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Max Price</p>
                          <p className="text-lg font-semibold text-green-600">{formatPrice(demand.maxPrice)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{demand.location}</span>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-600">Buyer: {demand.buyer.name}</p>
                        <p className="text-sm text-gray-600">Deadline: {formatDate(demand.deadline)}</p>
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Contact Buyer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
