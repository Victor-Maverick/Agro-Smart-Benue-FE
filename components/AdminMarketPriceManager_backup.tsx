"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, Plus, Wheat, Edit, Trash2, TrendingUp, Search, Filter, MoreVertical } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"

interface Crop {
  id: number
  name: string
  category: string
  description?: string
  plantingSeason: string
  harvestSeason: string
  growthPeriodDays?: number
  imageUrl?: string
  createdAt: string
}

interface CropPrice {
  cropId: number
  averagePrice: number
  priceCount: number
  lastUpdated: string
}

export default function AdminCropManager() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [cropPrices, setCropPrices] = useState<{ [key: number]: CropPrice }>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    plantingSeason: "",
    harvestSeason: "",
    growthPeriodDays: "",
    imageUrl: "",
  })

  const { showToast } = useToast()

  const cropCategories = [
    "Cereals",
    "Legumes", 
    "Root Crops",
    "Vegetables",
    "Fruits",
    "Cash Crops",
    "Spices & Herbs"
  ]

  const seasons = [
    "Dry Season (November - March)",
    "Wet Season (April - October)", 
    "Year Round",
    "Early Wet Season (April - June)",
    "Late Wet Season (July - October)"
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch crops
      const cropsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crops`)
      if (cropsResponse.ok) {
        const cropsData = await cropsResponse.json()
        console.log('Fetched crops:', cropsData)
        setCrops(cropsData.data || [])
      }

      // Note: Crop prices can be fetched from /api/market-prices/statistics if needed
    } catch (error) {
      console.error("Failed to fetch data:", error)
      showToast('error', 'Error', 'Failed to load crops data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      plantingSeason: "",
      harvestSeason: "",
      growthPeriodDays: "",
      imageUrl: "",
    })
    setEditingCrop(null)
  }

  const validateForm = () => {
    if (!formData.name || !formData.category || !formData.plantingSeason || !formData.harvestSeason) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const url = editingCrop 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crops/${editingCrop.id}` 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crops`
      const method = editingCrop ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showToast('success', 
          editingCrop ? 'Crop Updated!' : 'Crop Added!', 
          `Crop has been ${editingCrop ? 'updated' : 'added'} successfully.`
        )
        fetchData()
        setIsDialogOpen(false)
        resetForm()
      } else {
        throw new Error("Failed to save crop")
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to save crop. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop)
    setFormData({
      name: crop.name,
      category: crop.category,
      description: crop.description || "",
      plantingSeason: crop.plantingSeason,
      harvestSeason: crop.harvestSeason,
      growthPeriodDays: crop.growthPeriodDays?.toString() || "",
      imageUrl: crop.imageUrl || "",
    })
    setIsDialogOpen(true)
  }

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || crop.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (cropId: number) => {
    if (!confirm("Are you sure you want to delete this crop?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crops/${cropId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        showToast('success', 'Crop Deleted', 'Crop has been deleted successfully.')
        fetchData()
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete crop. Please try again.')
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
        <span className="ml-2">Loading crops...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crop Management</h2>
          <p className="text-gray-600">Manage crops in the system and view average market prices</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCrop ? "Edit Crop" : "Add New Crop"}</DialogTitle>
              <DialogDescription>
                {editingCrop ? "Update crop information" : "Add a new crop to the system"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Crop Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter crop name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the crop"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantingSeason">Planting Season *</Label>
                  <Select value={formData.plantingSeason} onValueChange={(value) => handleInputChange("plantingSeason", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select planting season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map((season) => (
                        <SelectItem key={season} value={season}>
                          {season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestSeason">Harvest Season *</Label>
                  <Select value={formData.harvestSeason} onValueChange={(value) => handleInputChange("harvestSeason", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select harvest season" />
                    </SelectTrigger>
                    <SelectContent>
                      {seasons.map((season) => (
                        <SelectItem key={season} value={season}>
                          {season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="growthPeriodDays">Growth Period (Days)</Label>
                  <Input
                    id="growthPeriodDays"
                    type="number"
                    value={formData.growthPeriodDays}
                    onChange={(e) => handleInputChange("growthPeriodDays", e.target.value)}
                    placeholder="e.g., 90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    placeholder="Crop image URL"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingCrop ? "Update Crop" : "Add Crop"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crops by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-green-300 text-green-700 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Category: {categoryFilter === "all" ? "All" : categoryFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                  {cropCategories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crops Table */}
      <Card className="border-green-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Planting Season</TableHead>
                  <TableHead>Harvest Season</TableHead>
                  <TableHead>Growth Period</TableHead>
                  <TableHead>Average Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrops.length > 0 ? (
                  filteredCrops.map((crop) => {
                    const priceData = cropPrices[crop.id]
                    return (
                      <TableRow key={crop.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {crop.imageUrl && (
                              <img 
                                src={crop.imageUrl} 
                                alt={crop.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{crop.name}</p>
                              {crop.description && (
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {crop.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {crop.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{crop.plantingSeason}</TableCell>
                        <TableCell className="text-sm">{crop.harvestSeason}</TableCell>
                        <TableCell className="text-sm">
                          {crop.growthPeriodDays ? `${crop.growthPeriodDays} days` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {priceData ? (
                            <div>
                              <p className="font-medium text-green-600">
                                {formatPrice(priceData.averagePrice)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {priceData.priceCount} markets
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(crop)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Crop
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDelete(crop.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Crop
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Wheat className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">No crops found</p>
                        <p className="text-sm text-gray-400">
                          {searchQuery || categoryFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "No crops have been added yet"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}