"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, TrendingUp } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  description: string
  imageUrl?: string
  averagePrice?: number
  inStock: boolean
}

interface Demand {
  id: number
  productName: string
  quantity: number
  unit: string
  location: string
  status: string
  createdAt: string
}

export default function AdminProductsDemandsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [demands, setDemands] = useState<Demand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch all products from API
      const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`)
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData.data || [])
      }

      // Fetch all demands from API
      const demandsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demands`)
      if (demandsResponse.ok) {
        const demandsData = await demandsResponse.json()
        setDemands(demandsData.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Products & Demands</h2>
        <p className="text-gray-600">View and manage marketplace products and demand requests</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="demands">
            <TrendingUp className="h-4 w-4 mr-2" />
            Demands
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {product.name}
                        <Badge variant={product.inStock ? "default" : "secondary"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Category</p>
                      <p className="text-gray-600 capitalize">{product.category}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Price per Unit</p>
                      <p className="text-gray-600">
                        {product.pricePerUnit ? formatPrice(product.pricePerUnit) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Quantity</p>
                      <p className="text-gray-600">{product.quantity} {product.unit}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Location</p>
                      <p className="text-gray-600">{product.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demands" className="space-y-4">
          <div className="grid gap-4">
            {demands.map((demand) => (
              <Card key={demand.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {demand.productName}
                        <Badge 
                          variant={demand.status === "FULFILLED" ? "default" : "secondary"}
                        >
                          {demand.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Requested on {formatDate(demand.createdAt)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Quantity</p>
                      <p className="text-gray-600">{demand.quantity} {demand.unit}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Location</p>
                      <p className="text-gray-600">{demand.location}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Status</p>
                      <p className="text-gray-600 capitalize">{demand.status.toLowerCase()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
