"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Package, TrendingUp, Plus, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/contexts/ToastContext"
import ProductTable from "@/components/ProductTable"
import axios from "axios"

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
  const { data: session } = useSession()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [demands, setDemands] = useState<Demand[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddDemandOpen, setIsAddDemandOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [userEmail, setUserEmail] = useState("")

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
    buyerEmail: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch all products from API
      const productsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/all`)
            
      // Fetch all demands from API
      const demandsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demands`)
      setProducts(productsResponse.data || [])
      setDemands(demandsResponse.data.data || [])

      
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setProducts([])
      setDemands([])
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
    if (!productForm.name || !productForm.quantity || !productForm.unitPrice || !productForm.quantityCategory || !selectedImage || !userEmail) {
      showToast('error', 'Missing Information', 'Please fill in all required fields including user email and image.')
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/add?email=${userEmail}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        showToast('success', 'Product Added!', 'Product has been added to the marketplace.')
        setIsAddProductOpen(false)
        resetProductForm()
        fetchData()
      } else {
        throw new Error(response.data?.message || 'Failed to add product')
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to add product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddDemand = async () => {
    const buyerEmail = session?.user?.email || demandForm.buyerEmail
    
    if (!demandForm.productName || !demandForm.quantity || !demandForm.quantityCategory || !demandForm.phoneContact) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
      return
    }

    if (!buyerEmail) {
      showToast('error', 'Missing Email', 'Buyer email is required.')
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demands?buyerEmail=${buyerEmail}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200 || response.status === 201) {
        showToast('success', 'Demand Added!', 'Demand request has been submitted.')
        setIsAddDemandOpen(false)
        resetDemandForm()
        fetchData()
      } else {
        throw new Error(response.data?.message || 'Failed to add demand')
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to add demand. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/delete/${productId}`
      )

      if (response.status === 200) {
        showToast('success', 'Product Deleted', 'Product has been removed from the marketplace.')
        fetchData()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to delete product. Please try again.')
    }
  }

  const handleDeleteDemand = async (demandId: number) => {
    if (!confirm('Are you sure you want to delete this demand request?')) {
      return
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/demand/delete/${demandId}`
      )

      if (response.status === 200) {
        showToast('success', 'Demand Deleted', 'Demand request has been removed.')
        fetchData()
      } else {
        throw new Error('Failed to delete demand')
      }
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to delete demand. Please try again.')
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
    setUserEmail("")
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
      buyerEmail: "",
    })
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products & Demands</h2>
          <p className="text-gray-600">View and manage marketplace products and demand requests</p>
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
                <DialogDescription>Add a product to the marketplace on behalf of a user</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">User Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="farmer@example.com"
                  />
                </div>

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
                    placeholder="Describe the product"
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
                    placeholder="e.g., Makurdi"
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
                    disabled={submitting}
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
                Add Demand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Demand Request</DialogTitle>
                <DialogDescription>Add a demand request on behalf of a buyer</DialogDescription>
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
                    placeholder="Offer price per unit"
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
                    placeholder="e.g., Makurdi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demandDescription">Additional Details</Label>
                  <Textarea
                    id="demandDescription"
                    value={demandForm.description}
                    onChange={(e) => setDemandForm({ ...demandForm, description: e.target.value })}
                    placeholder="Any specific requirements"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDemandOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddDemand} 
                    disabled={submitting}
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
              onDelete={handleDeleteProduct}
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
                            <Badge 
                              variant={demand.status === "FULFILLED" ? "default" : "secondary"}
                            >
                              {demand.status}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>Requested on {formatDate(demand.createdAt)}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDemand(demand.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                        <p className="text-gray-600 capitalize">{demand.status?.toLowerCase() || 'Pending'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Demands Found</h3>
                <p className="text-gray-600">No demand requests have been submitted yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
