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
import { Loader2, ShoppingBag, TrendingUp, Plus, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"

interface Product {
  id: number
  name: string
  description: string
  category: string
  quantity: number
  unit: string
  pricePerUnit: number
  location: string
  imageUrl?: string
  available: boolean
}

export default function UserProductManager() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddDemandOpen, setIsAddDemandOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    unit: "",
    pricePerUnit: "",
    location: "",
  })

  const [demandForm, setDemandForm] = useState({
    productName: "",
    quantity: "",
    unit: "",
    location: "",
    description: "",
  })

  useEffect(() => {
    if (user?.email) {
      fetchUserProducts()
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
    if (!productForm.name || !productForm.category || !productForm.quantity || !productForm.pricePerUnit) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
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
      formData.append('description', productForm.description)
      formData.append('category', productForm.category)
      formData.append('quantity', productForm.quantity)
      formData.append('unit', productForm.unit)
      formData.append('pricePerUnit', productForm.pricePerUnit)
      formData.append('location', productForm.location)
      
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

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
    if (!demandForm.productName || !demandForm.quantity || !demandForm.location) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
      return
    }

    if (!user?.email) {
      showToast('error', 'Authentication Error', 'User email not found. Please log in again.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demands/add?email=${user.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(demandForm),
        }
      )

      if (response.ok) {
        showToast('success', 'Demand Added!', 'Your demand request has been submitted.')
        setIsAddDemandOpen(false)
        resetDemandForm()
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
      category: "",
      quantity: "",
      unit: "",
      pricePerUnit: "",
      location: "",
    })
    setSelectedImage(null)
    setImagePreview("")
  }

  const resetDemandForm = () => {
    setDemandForm({
      productName: "",
      quantity: "",
      unit: "",
      location: "",
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="category">Category *</Label>
                    <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="tubers">Tubers</SelectItem>
                        <SelectItem value="legumes">Legumes</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Label htmlFor="unit">Unit *</Label>
                    <Select value={productForm.unit} onValueChange={(value) => setProductForm({ ...productForm, unit: value })}>
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
                    <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                    <Input
                      id="pricePerUnit"
                      type="number"
                      value={productForm.pricePerUnit}
                      onChange={(e) => setProductForm({ ...productForm, pricePerUnit: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={productForm.location}
                    onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                    placeholder="e.g., Makurdi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image (Optional)</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
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
                  <Button onClick={handleAddProduct} disabled={submitting}>
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
                    <Select value={demandForm.unit} onValueChange={(value) => setDemandForm({ ...demandForm, unit: value })}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandLocation">Location *</Label>
                  <Input
                    id="demandLocation"
                    value={demandForm.location}
                    onChange={(e) => setDemandForm({ ...demandForm, location: e.target.value })}
                    placeholder="e.g., Makurdi"
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
                  <Button onClick={handleAddDemand} disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Demand
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products List */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{product.name}</span>
                  <Badge className={product.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {product.available ? "Available" : "Unavailable"}
                  </Badge>
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-semibold">{product.quantity} {product.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per {product.unit}</span>
                    <span className="font-semibold text-green-600">{formatPrice(product.pricePerUnit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold">{product.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    </div>
  )
}
