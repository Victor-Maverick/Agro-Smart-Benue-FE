"use client"

import { useState,React } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wheat,
  DollarSign,
  Users,
  BookOpen,
  Award,
  MessageCircle,
  Bell,
  BarChart3,
  Leaf,
  Target,
  Edit,
  Camera,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for the farmer
const initialFarmerData = {
  name: "Emmanuel Terkimbi",
  id: "BF-2024-001234",
  phone: "+234 803 456 7890",
  email: "emmanuel.terkimbi@gmail.com",
  location: "Gwer East LGA, Benue State",
  farmSize: "5.2",
  joinDate: "March 2023",
  status: "Active",
  tier: "Premium",
  avatar: "/placeholder.svg?height=100&width=100&text=ET",
  bio: "Experienced rice and yam farmer with 8 years in agriculture. Passionate about sustainable farming practices and community development.",
}

const yieldData = [
  { month: "Jan", rice: 2.1, yam: 1.8, cassava: 3.2 },
  { month: "Feb", rice: 2.3, yam: 2.0, cassava: 3.4 },
  { month: "Mar", rice: 2.8, yam: 2.5, cassava: 3.8 },
  { month: "Apr", rice: 3.2, yam: 2.8, cassava: 4.1 },
  { month: "May", rice: 3.5, yam: 3.2, cassava: 4.5 },
  { month: "Jun", rice: 3.8, yam: 3.5, cassava: 4.8 },
]

const marketData = [
  { crop: "Rice", currentPrice: "₦450/kg", trend: "up", change: "+12%" },
  { crop: "Yam", currentPrice: "₦280/kg", trend: "down", change: "-5%" },
  { crop: "Cassava", currentPrice: "₦180/kg", trend: "up", change: "+8%" },
  { crop: "Maize", currentPrice: "₦320/kg", trend: "up", change: "+15%" },
]

// Updated crop distribution with more diverse colors
const initialCropDistribution = [
  { name: "Rice", value: 40, color: "#3b82f6" }, // Blue
  { name: "Yam", value: 30, color: "#f59e0b" }, // Amber
  { name: "Cassava", value: 20, color: "#8b5cf6" }, // Violet
  { name: "Maize", value: 10, color: "#06b6d4" }, // Cyan
]

const trainingProgress = [
  { course: "Modern Rice Cultivation", progress: 85, status: "In Progress" },
  { course: "Pest Management", progress: 100, status: "Completed" },
  { course: "Soil Health Management", progress: 60, status: "In Progress" },
  { course: "Post-Harvest Handling", progress: 25, status: "In Progress" }, // Changed from 0 to show low progress
]

export default function FarmerProfile() {
  const [activeTab, setActiveTab] = useState("overview")
  const [farmerData, setFarmerData] = useState(initialFarmerData)
  const [cropDistribution, setCropDistribution] = useState(initialCropDistribution)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingCrops, setIsEditingCrops] = useState(false)
  const [editFormData, setEditFormData] = useState(farmerData)
  const [editCropData, setEditCropData] = useState(cropDistribution)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAvatar = e.target?.result
        setFarmerData((prev) => ({ ...prev, avatar: newAvatar }))
        setEditFormData((prev) => ({ ...prev, avatar: newAvatar }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setFarmerData(editFormData)
    setIsEditingProfile(false)
  }

  const handleSaveCrops = () => {
    setCropDistribution(editCropData)
    setIsEditingCrops(false)
  }

  const updateCropValue = (index, newValue) => {
    const newCrops = [...editCropData]
    newCrops[index].value = newValue
    setEditCropData(newCrops)
  }

  // Helper function to get progress bar color based on value
  const getProgressColor = (value) => {
    if (value >= 80) return "bg-green-600" // High - Green
    if (value >= 50) return "bg-yellow-500" // Medium - Yellow
    return "bg-red-500" // Low - Red
  }

  // Helper function to get progress background color
  const getProgressBgColor = (value) => {
    if (value >= 80) return "bg-green-100"
    if (value >= 50) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <Card className="border-green-200 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-green-200">
                  <AvatarImage src={farmerData.avatar || "/placeholder.svg"} alt={farmerData.name} />
                  <AvatarFallback className="text-xl sm:text-2xl bg-green-100 text-green-800">ET</AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-2 -right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{farmerData.name}</h1>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">{farmerData.status}</Badge>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        {farmerData.tier}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">Farmer ID: {farmerData.id}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{farmerData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{farmerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{farmerData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Joined {farmerData.joinDate}</span>
                  </div>
                </div>

                {farmerData.bio && <p className="text-gray-700 text-sm leading-relaxed">{farmerData.bio}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>Update your personal information and farm details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, email: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="text-right">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={editFormData.location}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, location: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="farmSize" className="text-right">
                          Farm Size (ha)
                        </Label>
                        <Input
                          id="farmSize"
                          value={editFormData.farmSize}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, farmSize: e.target.value }))}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="bio" className="text-right">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={editFormData.bio}
                          onChange={(e) => setEditFormData((prev) => ({ ...prev, bio: e.target.value }))}
                          className="col-span-3"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  onClick={() => (window.location.href = "/notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    7
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Farm Size</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{farmerData.farmSize} ha</p>
                </div>
                <Image src="/images/header image.png" alt="BFPC Logo" width={32} height={32} className="object-contain"/>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Yield Increase</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">+23%</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Training Completed</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">12</p>
                </div>
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Market Connections</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">8</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 min-w-[600px] lg:min-w-0 bg-green-50 border border-green-200">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="yield"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Yield Analytics
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Market Insights
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Training
              </TabsTrigger>
              <TabsTrigger
                value="buyers"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Buyers
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Community
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Current Crops */}
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Wheat className="h-5 w-5 text-green-600" />
                      Current Crops Distribution
                    </CardTitle>
                    <Dialog open={isEditingCrops} onOpenChange={setIsEditingCrops}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Edit Crop Distribution</DialogTitle>
                          <DialogDescription>Update the percentage allocation of your crops.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {editCropData.map((crop, index) => (
                            <div key={index} className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">{crop.name}</Label>
                              <Input
                                type="number"
                                value={crop.value}
                                onChange={(e) => updateCropValue(index, Number.parseInt(e.target.value) || 0)}
                                className="col-span-2"
                                min="0"
                                max="100"
                              />
                              <span className="text-sm text-gray-500">%</span>
                            </div>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditingCrops(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveCrops} className="bg-green-600 hover:bg-green-700">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cropDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {cropDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {cropDistribution.map((crop, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }} />
                        <span className="text-xs sm:text-sm">
                          {crop.name} ({crop.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Completed Pest Management Training</p>
                      <p className="text-xs sm:text-sm text-gray-600">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Connected with AgroMall buyer</p>
                      <p className="text-xs sm:text-sm text-gray-600">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-300 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Attended FADAMA III program</p>
                      <p className="text-xs sm:text-sm text-gray-600">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-200 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Updated farm yield data</p>
                      <p className="text-xs sm:text-sm text-gray-600">2 weeks ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="h-5 w-5 text-green-600" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Yield Optimization</h4>
                    <p className="text-xs sm:text-sm text-green-700">
                      Consider intercropping maize with your rice to maximize land use and increase overall yield by
                      15%.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Market Opportunity</h4>
                    <p className="text-xs sm:text-sm text-green-700">
                      Rice prices are trending up 12%. Consider increasing rice production for next season.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Training</h4>
                    <p className="text-xs sm:text-sm text-green-700">
                      Complete the Soil Health Management course to unlock advanced farming techniques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield" className="space-y-4 sm:space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Yield Performance Trends
                </CardTitle>
                <CardDescription>Track your crop yields over time (tons per hectare)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={3} name="Rice" />
                      <Line type="monotone" dataKey="yam" stroke="#f59e0b" strokeWidth={3} name="Yam" />
                      <Line type="monotone" dataKey="cassava" stroke="#8b5cf6" strokeWidth={3} name="Cassava" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-blue-500 rounded" />
                    <span className="text-sm">Rice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-amber-500 rounded" />
                    <span className="text-sm">Yam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-violet-500 rounded" />
                    <span className="text-sm">Cassava</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Seasonal Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Dry Season</span>
                        <span className="text-sm text-gray-600">85% of target</span>
                      </div>
                      <Progress
                        value={85}
                        className={`h-2 ${getProgressBgColor(85)} [&>div]:${getProgressColor(85)}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Rainy Season</span>
                        <span className="text-sm text-gray-600">92% of target</span>
                      </div>
                      <Progress
                        value={92}
                        className={`h-2 ${getProgressBgColor(92)} [&>div]:${getProgressColor(92)}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Harmattan</span>
                        <span className="text-sm text-gray-600">45% of target</span>
                      </div>
                      <Progress
                        value={45}
                        className={`h-2 ${getProgressBgColor(45)} [&>div]:${getProgressColor(45)}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Impact of Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-sm sm:text-base">Before Training</p>
                        <p className="text-xs sm:text-sm text-gray-600">Average yield: 2.1 tons/ha</p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-sm sm:text-base">After Training</p>
                        <p className="text-xs sm:text-sm text-gray-600">Average yield: 3.5 tons/ha</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded-lg border border-green-300">
                      <p className="font-bold text-lg text-green-700">+67% Improvement</p>
                      <p className="text-xs sm:text-sm text-green-600">Since joining BFPC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4 sm:space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Current Market Prices
                </CardTitle>
                <CardDescription>Real-time price trends for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marketData.map((item, index) => (
                    <div key={index} className="p-4 border border-green-200 rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">{item.crop}</h4>
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">{item.currentPrice}</p>
                      <p className={`text-xs sm:text-sm ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {item.change} from last week
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">High Demand Crops</CardTitle>
                  <CardDescription>Crops with increasing market demand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Organic Rice</p>
                      <p className="text-xs sm:text-sm text-gray-600">Premium market opportunity</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0">High Demand</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Sweet Potato</p>
                      <p className="text-xs sm:text-sm text-gray-600">Export potential</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0">Growing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Sesame Seeds</p>
                      <p className="text-xs sm:text-sm text-gray-600">International buyers</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex-shrink-0">Emerging</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Market Alerts</CardTitle>
                  <CardDescription>Recent market notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <Bell className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-red-800 text-sm sm:text-base">Price Alert</p>
                      <p className="text-xs sm:text-sm text-red-700">Rice prices dropped 3% in Abuja market</p>
                      <p className="text-xs text-red-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Bell className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-green-800 text-sm sm:text-base">Opportunity</p>
                      <p className="text-xs sm:text-sm text-green-700">New buyer seeking 50 tons of yam</p>
                      <p className="text-xs text-green-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Bell className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-green-800 text-sm sm:text-base">Market Update</p>
                      <p className="text-xs sm:text-sm text-green-700">Cassava processing plant opening in Makurdi</p>
                      <p className="text-xs text-green-600">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4 sm:space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Training Progress
                </CardTitle>
                <CardDescription>Track your agricultural education journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm sm:text-base">{course.course}</h4>
                      <Badge
                        className={
                          course.status === "Completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : course.status === "In Progress"
                              ? course.progress >= 50
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <Progress
                      value={course.progress}
                      className={`h-2 ${getProgressBgColor(course.progress)} [&>div]:${getProgressColor(course.progress)}`}
                    />
                    <p className={`text-xs sm:text-sm ${course.progress >= 50 ? "text-gray-600" : "text-red-600"}`}>
                      {course.progress}% complete
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recommended Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-white">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Climate-Smart Agriculture</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">
                      Learn adaptive farming techniques for climate change
                    </p>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      Enroll Now
                    </Button>
                  </div>
                  <div className="p-4 border border-green-200 rounded-lg bg-white">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Digital Marketing for Farmers</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">Reach more buyers through digital platforms</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Award className="h-5 w-5 text-green-600" />
                    Conference Eligibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <Award className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-bold text-lg text-green-800">Gold Tier Farmer</h3>
                      <p className="text-xs sm:text-sm text-green-700 mb-4">
                        You're eligible for conference sponsorship!
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700 text-sm">Apply for Sponsorship</Button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      <p>Requirements met:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                        <li>✅ 12+ training courses completed</li>
                        <li>✅ 20%+ yield improvement</li>
                        <li>✅ Active community participation</li>
                        <li>✅ 18+ months membership</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buyers" className="space-y-4 sm:space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="h-5 w-5 text-green-600" />
                  Connected Buyers
                </CardTitle>
                <CardDescription>Your verified buyer network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10 bg-green-100">
                        <AvatarFallback className="text-green-700">AM</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base">AgroMall Nigeria</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Food Processing</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>
                        <strong>Interested in:</strong> Rice, Maize
                      </p>
                      <p>
                        <strong>Volume:</strong> 100+ tons/month
                      </p>
                      <p>
                        <strong>Rating:</strong> ⭐⭐⭐⭐⭐ (4.8/5)
                      </p>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10 bg-green-100">
                        <AvatarFallback className="text-green-700">TA</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base">Thrive Agric</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Commodity Trading</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <p>
                        <strong>Interested in:</strong> Yam, Cassava
                      </p>
                      <p>
                        <strong>Volume:</strong> 50+ tons/month
                      </p>
                      <p>
                        <strong>Rating:</strong> ⭐⭐⭐⭐ (4.2/5)
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Rice Sale - AgroMall</p>
                      <p className="text-xs sm:text-sm text-gray-600">5 tons @ ₦450/kg</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-green-600 text-sm sm:text-base">₦2,250,000</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">Yam Sale - Local Coop</p>
                      <p className="text-xs sm:text-sm text-gray-600">3 tons @ ₦280/kg</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-green-600 text-sm sm:text-base">₦840,000</p>
                      <p className="text-xs text-gray-500">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Buyer Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-green-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm sm:text-base">Premium Rice Request</h4>
                      <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0">New</Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Looking for 10 tons of premium rice for export
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50 text-xs bg-transparent"
                      >
                        Negotiate
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm sm:text-base">Cassava Bulk Order</h4>
                      <Badge variant="outline" className="border-green-300 text-green-700 flex-shrink-0">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Processing company needs 20 tons monthly</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50 text-xs bg-transparent"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4 sm:space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="h-5 w-5 text-green-600" />
                  Community Groups
                </CardTitle>
                <CardDescription>Connect with farmers in your area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 rounded-lg bg-white">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Gwer East Farmers Association</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">Local farming community group</p>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>👥 245 members</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
                      Join Discussions
                    </Button>
                  </div>

                  <div className="p-4 border border-green-200 rounded-lg bg-white">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">Rice Farmers Network</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">Specialized rice cultivation group</p>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>👥 1,234 members</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Member</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      View Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Discussions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-green-200 rounded-lg bg-white">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 bg-green-100 flex-shrink-0">
                        <AvatarFallback className="text-green-700 text-xs">JA</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm">John Agbo</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          "Anyone tried the new drought-resistant rice variety? Looking for feedback..."
                        </p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago • 12 replies</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg bg-white">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 bg-green-100 flex-shrink-0">
                        <AvatarFallback className="text-green-700 text-xs">MO</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm">Mary Ochoga</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          "Sharing my experience with organic fertilizers. 30% yield increase!"
                        </p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago • 28 replies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <h4 className="font-semibold text-green-800 text-sm sm:text-base">FADAMA III Training</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 mb-2">Modern farming techniques workshop</p>
                    <p className="text-xs text-green-600">March 15, 2024 • Makurdi</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <h4 className="font-semibold text-green-800 text-sm sm:text-base">Harvest Festival</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 mb-2">Community celebration and market day</p>
                    <p className="text-xs text-green-600">March 22, 2024 • Gwer East</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
