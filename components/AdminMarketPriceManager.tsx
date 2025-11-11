"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, TrendingUp, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']
const benueLGAs = ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"]

export default function AdminMarketPriceManager() {
  const [crops, setCrops] = useState([])
  const [marketPrices, setMarketPrices] = useState([])
  const [markets, setMarkets] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddMarketDialogOpen, setIsAddMarketDialogOpen] = useState(false)
  const [selectedCropForView, setSelectedCropForView] = useState(null)
  const [cropPricesByMarket, setCropPricesByMarket] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(8)
  const [formData, setFormData] = useState({ cropId: "", market: "", state: "Benue", lga: "", price: "", unit: "kg", priceDate: new Date().toISOString().split('T')[0] })
  const [newMarketData, setNewMarketData] = useState({ name: "", lga: "", state: "Benue", description: "", address: "" })
  const { showToast } = useToast()

  useEffect(() => { fetchData(); fetchStatistics() }, [currentPage])

  const fetchData = async () => {
    try {
      setLoading(true)
      const cropsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crops`)
      if (cropsRes.ok) setCrops((await cropsRes.json()).data || [])
      const pricesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/paginated?page=${currentPage}&size=${pageSize}`)
      if (pricesRes.ok) {
        const data = (await pricesRes.json()).data
        setMarketPrices(data.content || [])
        setTotalPages(data.totalPages || 0)
      }
      const marketsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets`)
      if (marketsRes.ok) setMarkets((await marketsRes.json()).data || [])
      const locsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/locations`)
      if (locsRes.ok) setLocations((await locsRes.json()).data || [])
    } catch (error) {
      showToast('error', 'Error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/statistics`)
      if (res.ok) setStatistics((await res.json()).data)
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
    }
  }

  const fetchCropPricesByMarket = async (cropId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/crop/${cropId}/by-market`)
      if (res.ok) setCropPricesByMarket((await res.json()).data || [])
    } catch (error) {
      console.error("Failed to fetch crop prices:", error)
    }
  }

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const handleMarketInputChange = (field, value) => setNewMarketData(prev => ({ ...prev, [field]: value }))
  const resetForm = () => setFormData({ cropId: "", market: "", state: "Benue", lga: "", price: "", unit: "kg", priceDate: new Date().toISOString().split('T')[0] })
  const validateForm = () => {
    if (!formData.cropId || !formData.market || !formData.lga || !formData.price) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/update-or-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cropId: parseInt(formData.cropId), price: parseFloat(formData.price) })
      })
      if (res.ok) {
        showToast('success', 'Price Updated!', 'Market price has been updated successfully.')
        fetchData()
        fetchStatistics()
        setIsDialogOpen(false)
        resetForm()
      } else throw new Error("Failed to update price")
    } catch (error) {
      showToast('error', 'Error', 'Failed to update price.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddMarket = async () => {
    if (!newMarketData.name || !newMarketData.lga) {
      showToast('error', 'Missing Information', 'Please provide market name and LGA.')
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMarketData)
      })
      if (res.ok) {
        showToast('success', 'Market Added!', 'New market has been added successfully.')
        fetchData()
        setIsAddMarketDialogOpen(false)
        setNewMarketData({ name: "", lga: "", state: "Benue", description: "", address: "" })
      } else throw new Error("Failed to add market")
    } catch (error) {
      showToast('error', 'Error', 'Failed to add market.')
    }
  }

  const handleDelete = async (priceId) => {
    if (!confirm("Are you sure you want to delete this price entry?")) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/${priceId}`, { method: "DELETE" })
      if (res.ok) {
        showToast('success', 'Deleted!', 'Price entry has been deleted.')
        fetchData()
        fetchStatistics()
      } else throw new Error("Failed to delete")
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete price entry.')
    }
  }

  const handleViewCropPrices = async (crop) => {
    setSelectedCropForView(crop)
    await fetchCropPricesByMarket(crop.id)
    setIsViewDialogOpen(true)
  }

  const handleEditFromView = (price) => {
    setFormData({ cropId: price.crop.id.toString(), market: price.market, state: price.state, lga: price.lga, price: price.price.toString(), unit: price.unit, priceDate: price.priceDate })
    setIsViewDialogOpen(false)
    setIsDialogOpen(true)
  }

  const getFilteredMarketsOrLocations = () => {
    if (!formData.lga) return []
    return [...markets.filter(m => m.lga === formData.lga).map(m => m.name), ...locations.filter(l => l.lga === formData.lga).map(l => l.name)]
  }

  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price)
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  if (loading && currentPage === 0) return (<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /><span className="ml-2">Loading...</span></div>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Market Price Management</h2>
          <p className="text-gray-600">Update crop prices for different markets</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddMarketDialogOpen} onOpenChange={setIsAddMarketDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-600 text-green-600">
                <Plus className="h-4 w-4 mr-2" />Add Market
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>Add New Market</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Market Name *</Label>
                    <Input value={newMarketData.name} onChange={(e) => handleMarketInputChange("name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>LGA *</Label>
                    <Select value={newMarketData.lga} onValueChange={(v) => handleMarketInputChange("lga", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {benueLGAs.map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddMarketDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMarket} className="bg-green-600">Add</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-green-600">
                <Plus className="h-4 w-4 mr-2" />Update Price
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>Update Market Price</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Crop *</Label>
                      <Select value={formData.cropId} onValueChange={(v) => handleInputChange("cropId", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {crops.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>LGA *</Label>
                      <Select value={formData.lga} onValueChange={(v) => handleInputChange("lga", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {benueLGAs.map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Market *</Label>
                    {formData.lga ? (
                      <Select value={formData.market} onValueChange={(v) => handleInputChange("market", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {getFilteredMarketsOrLocations().map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.market} onChange={(e) => handleInputChange("market", e.target.value)} />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input type="number" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={formData.unit} onValueChange={(v) => handleInputChange("unit", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          <SelectItem value="kg">Per Kg</SelectItem>
                          <SelectItem value="bag">Per Bag</SelectItem>
                          <SelectItem value="ton">Per Ton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                      {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Update
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {statistics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Price Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statistics.priceDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {statistics.priceDistribution.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatPrice(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm text-gray-600">Markets</p><p className="text-2xl font-bold text-green-600">{statistics.totalMarkets}</p></div>
              <div><p className="text-sm text-gray-600">Crops</p><p className="text-2xl font-bold text-green-600">{statistics.totalCrops}</p></div>
              <div><p className="text-sm text-gray-600">Entries</p><p className="text-2xl font-bold text-green-600">{statistics.totalPriceEntries}</p></div>
            </CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          {marketPrices.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketPrices.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.crop.name}</TableCell>
                      <TableCell>{p.market}</TableCell>
                      <TableCell>{p.lga}</TableCell>
                      <TableCell className="font-semibold text-green-600">{formatPrice(p.price)}</TableCell>
                      <TableCell>{p.unit}</TableCell>
                      <TableCell>{formatDate(p.priceDate)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewCropPrices(p.crop)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => { setFormData({ cropId: p.crop.id.toString(), market: p.market, state: p.state, lga: p.lga, price: p.price.toString(), unit: p.unit, priceDate: p.priceDate }); setIsDialogOpen(true) }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between mt-4">
                <p className="text-sm">Page {currentPage + 1} of {totalPages}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                    <ChevronLeft className="h-4 w-4" />Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}>
                    Next<ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Prices</h3>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600">
                <Plus className="h-4 w-4 mr-2" />Add Price
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>{selectedCropForView?.name} - Prices by Market</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {cropPricesByMarket.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Market</TableHead>
                      <TableHead>LGA</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cropPricesByMarket.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>{p.market}</TableCell>
                        <TableCell>{p.lga}</TableCell>
                        <TableCell className="font-semibold text-green-600">{formatPrice(p.price)}</TableCell>
                        <TableCell>{p.unit}</TableCell>
                        <TableCell>{formatDate(p.priceDate)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEditFromView(p)}>
                            <Edit className="h-4 w-4 mr-1" />Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-8 text-gray-600">No prices found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
