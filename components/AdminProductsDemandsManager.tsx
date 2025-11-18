"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, TrendingUp } from "lucide-react"
import ProductTable from "@/components/ProductTable"

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
      const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/all`)
        const productsData = await productsResponse.json()
        console.log("PRoducts:",productsData);
        setProducts(productsData || [])
      

      // Fetch all demands from API
      const demandsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demands`)
        const demandsData = await demandsResponse.json()
        if (productsData.status == true) {
          setProducts(productsData.data || [])
        }
        if (demandsData.status == true) {
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
          {products.length > 0 ? (
            <ProductTable 
              products={products} 
              itemsPerPage={15}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600">No products have been added to the marketplace yet.</p>
              </CardContent>
            </Card>
          )}
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
                      {/* <p className="text-gray-600 capitalize">{demand.status.toLowerCase()}</p> */}
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
