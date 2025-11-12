"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ShoppingBag, TrendingUp, Plus } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import ProductTable from "@/components/ProductTable"

interface Product {
  id: number
  name: string
  description: string
  quantity: number
  quantityCategory: string
  unitPrice: number
  location?: string
  imageUrl?: string
  isAvailable?: boolean
  available?: boolean
  farmerName?: string
  // Legacy fields for backward compatibility
  unit?: string
  pricePerUnit?: number
}

interface Demand {
  id: number
  productName: string
  description?: string
  offerPrice?: number
  quantity: number
  quantityCategory: string
  location?: string
  phoneContact: string
  status?: string
  createdAt?: string
}

export default function UserProductManager() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [demands, setDemands] = useState<Demand[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddDemandOpen, setIsAddDemandOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [activeTab, setActiveTab] = useState("products")

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    quantity: "",
    quantityCategory: "",
    unitPrice: "",
    location: "",
  })

  const [demandForm, setDemandForm] = useState({
    productName: "",
    quantity: "",
    quantityCategory: "",
    offerPrice: "",
    location: "",
    phoneContact: "",
    description: "",
  })

  useEffect(() => {
    if (user?.email) {
      fetchUserProducts()
      fetchUserDemands()
    }
  }, [user])

  const fetchUserProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/by-user?email=${user?.email}`
      )
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDemands = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demands/by-user?email=${user?.email}`
      )
      if (response.ok) {
        const data = await response.json()
        setDemands(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch demands:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.quantity || !productForm.unitPrice || !productForm.quantityCategory || !selectedImage) {
      showToast('error', 'Missing Information', 'Please fill in all required fields including image.')
      return
    }

    if (!user?.email) {
      showToast('error', 'Authentication Error', 'User email not found. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('description', productForm.description || '')
      formData.append('quantity', productForm.quantity.toString())
      formData.append('quantityCategory', productForm.quantityCategory)
      formData.append('unitPrice', productForm.unitPrice.toString())
      formData.append('location', productForm.location || '')
      formData.append('image', selectedImage)

      console.log('Sending product data:', {
        name: productForm.name,
        quantity: productForm.quantity,
        unitPrice: productForm.unitPrice,
        quantityCategory: productForm.quantityCategory,
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/add?email=${user.email}`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (response.ok) {
        showToast('success', 'Product Added!', 'Your product has been added to the marketplace.')
        setIsAddProductOpen(false)
        resetProductForm()
        fetchUserProducts()
      } else {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to add product')
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to add product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddDemand = async () => {
    if (!demandForm.productName || !demandForm.quantity || !demandForm.quantityCategory || !demandForm.phoneContact) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
      return
    }

    if (!user?.email) {
      showToast('error', 'Authentication Error', 'User email not found. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        productName: demandForm.productName,
        description: demandForm.description || '',
        offerPrice: demandForm.offerPrice ? parseFloat(demandForm.offerPrice) : null,
        quantity: parseInt(demandForm.quantity),
        quantityCategory: demandForm.quantityCategory,
        location: demandForm.location || '',
        phoneContact: demandForm.phoneContact,
      }

      console.log('Sending demand data:', payload)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demand?buyerEmail=${user.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        showToast('success', 'Demand Added!', 'Your demand request has been submitted.')
        setIsAddDemandOpen(false)
        resetDemandForm()
        fetchUserDemands()
      } else {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to add demand')
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to add demand. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      quantity: "",
      quantityCategory: "",
      unitPrice: "",
      location: "",
    })
    setSelectedImage(null)
    setImagePreview("")
  }

  const resetDemandForm = () => {
    setDemandForm({
      productName: "",
      quantity: "",
      quantityCategory: "",
      offerPrice: "",
      location: "",
      phoneContact: "",
      description: "",
    })
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading products...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
          <p className="text-gray-600">Manage your products and demand requests</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add your product to the marketplace</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g., Premium Rice"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe your product"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantityCategory">Unit *</Label>
                    <Select value={productForm.quantityCategory} onValueChange={(value) => setProductForm({ ...productForm, quantityCategory: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="tubers">Tubers</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Price per Unit *</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      value={productForm.unitPrice}
                      onChange={(e) => setProductForm({ ...productForm, unitPrice: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={productForm.location}
                    onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                    placeholder="e.g., Makurdi (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddProduct} 
                    disabled={
                      submitting || 
                      !productForm.name || 
                      !productForm.quantity || 
                      !productForm.unitPrice || 
                      !productForm.quantityCategory || 
                      !selectedImage
                    }
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDemandOpen} onOpenChange={setIsAddDemandOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <TrendingUp className="h-4 w-4 mr-2" />
                Add to Demand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Demand Request</DialogTitle>
                <DialogDescription>Request products you need</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    value={demandForm.productName}
                    onChange={(e) => setDemandForm({ ...demandForm, productName: e.target.value })}
                    placeholder="e.g., Fertilizer NPK 15-15-15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="demandQuantity">Quantity *</Label>
                    <Input
                      id="demandQuantity"
                      type="number"
                      value={demandForm.quantity}
                      onChange={(e) => setDemandForm({ ...demandForm, quantity: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demandUnit">Unit *</Label>
                    <Select value={demandForm.quantityCategory} onValueChange={(value) => setDemandForm({ ...demandForm, quantityCategory: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bag">Bags</SelectItem>
                        <SelectItem value="tubers">Tubers</SelectItem>
                        <SelectItem value="rubber">Rubber</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerPrice">Offer Price (Optional)</Label>
                  <Input
                    id="offerPrice"
                    type="number"
                    value={demandForm.offerPrice}
                    onChange={(e) => setDemandForm({ ...demandForm, offerPrice: e.target.value })}
                    placeholder="Your offer price per unit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneContact">Phone Contact *</Label>
                  <Input
                    id="phoneContact"
                    type="tel"
                    value={demandForm.phoneContact}
                    onChange={(e) => setDemandForm({ ...demandForm, phoneContact: e.target.value })}
                    placeholder="e.g., +234 800 000 0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandLocation">Location</Label>
                  <Input
                    id="demandLocation"
                    value={demandForm.location}
                    onChange={(e) => setDemandForm({ ...demandForm, location: e.target.value })}
                    placeholder="e.g., Makurdi (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandDescription">Additional Details</Label>
                  <Textarea
                    id="demandDescription"
                    value={demandForm.description}
                    onChange={(e) => setDemandForm({ ...demandForm, description: e.target.value })}
                    placeholder="Any specific requirements or details"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDemandOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddDemand} 
                    disabled={
                      submitting || 
                      !demandForm.productName || 
                      !demandForm.quantity || 
                      !demandForm.quantityCategory || 
                      !demandForm.phoneContact
                    }
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Demand
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for Products and Demands */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">
            <ShoppingBag className="h-4 w-4 mr-2" />
            My Products
          </TabsTrigger>
          <TabsTrigger value="demands">
            <TrendingUp className="h-4 w-4 mr-2" />
            My Demands
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {products.length > 0 ? (
            <ProductTable 
              products={products} 
              onEdit={(product) => {
                // TODO: Implement edit functionality
                console.log('Edit product:', product)
              }}
              onDelete={(productId) => {
                // TODO: Implement delete functionality
                console.log('Delete product:', productId)
              }}
              itemsPerPage={10}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
                <p className="text-gray-600 mb-4">Start adding your products to the marketplace</p>
                <Button onClick={() => setIsAddProductOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="demands" className="space-y-4">
          {demands.length > 0 ? (
            <div className="grid gap-4">
              {demands.map((demand) => (
                <Card key={demand.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {demand.productName}
                          {demand.status && (
                            <Badge variant={demand.status === "FULFILLED" ? "default" : "secondary"}>
                              {demand.status}
                            </Badge>
                          )}
                        </CardTitle>
                        {demand.description && (
                          <CardDescription>{demand.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Quantity</p>
                        <p className="text-gray-600">{demand.quantity} {demand.quantityCategory}</p>
                      </div>
                      {demand.offerPrice && (
                        <div>
                          <p className="font-medium text-gray-700">Offer Price</p>
                          <p className="text-gray-600 text-green-600 font-semibold">
                            ₦{demand.offerPrice.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-700">Contact</p>
                        <p className="text-gray-600">{demand.phoneContact}</p>
                      </div>
                      {demand.location && (
                        <div>
                          <p className="font-medium text-gray-700">Location</p>
                          <p className="text-gray-600">{demand.location}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Demands Yet</h3>
                <p className="text-gray-600 mb-4">Create demand requests for products you need</p>
                <Button onClick={() => setIsAddDemandOpen(true)} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Demand
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
