"use client"

import { useState , React} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  TrendingUp,
  Banknote,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  Bell,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Shield,
  UserCheck,
  UserX,
  MessageSquare,
  Camera,
} from "lucide-react"
import AdminCropManager from "./AdminCropManager"
import AdminUserManager from "./AdminUserManager"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

// Sample data for admin dashboard
const dashboardStats = {
  totalFarmers: 12847,
  activeFarmers: 9234,
  totalTransactions: 45623,
  totalRevenue: "₦2.4B",
  completedTrainings: 8934,
  pendingApprovals: 234,
  systemAlerts: 12,
  marketConnections: 1567,
}

const farmerGrowthData = [
  { month: "Jan", farmers: 8500, active: 6800 },
  { month: "Feb", farmers: 9200, active: 7400 },
  { month: "Mar", farmers: 9800, active: 7900 },
  { month: "Apr", farmers: 10500, active: 8500 },
  { month: "May", farmers: 11200, active: 9000 },
  { month: "Jun", farmers: 12847, active: 9234 },
]

const revenueData = [
  { month: "Jan", revenue: 180000000 },
  { month: "Feb", revenue: 220000000 },
  { month: "Mar", revenue: 280000000 },
  { month: "Apr", revenue: 320000000 },
  { month: "May", revenue: 380000000 },
  { month: "Jun", revenue: 420000000 },
]

const cropDistributionData = [
  { name: "Rice", value: 35, color: "#3b82f6", farmers: 4496 },
  { name: "Yam", value: 25, color: "#f59e0b", farmers: 3212 },
  { name: "Cassava", value: 20, color: "#8b5cf6", farmers: 2569 },
  { name: "Maize", value: 15, color: "#06b6d4", farmers: 1927 },
  { name: "Others", value: 5, color: "#10b981", farmers: 643 },
]

const regionData = [
  { region: "Gwer East", farmers: 2847, active: 2234, revenue: 450000000 },
  { region: "Makurdi", farmers: 2156, active: 1876, revenue: 380000000 },
  { region: "Gboko", farmers: 1934, active: 1567, revenue: 320000000 },
  { region: "Otukpo", farmers: 1789, active: 1445, revenue: 290000000 },
  { region: "Katsina-Ala", farmers: 1623, active: 1298, revenue: 260000000 },
  { region: "Others", farmers: 2498, active: 1814, revenue: 720000000 },
]

const recentFarmers = [
  {
    id: "BF-2024-001234",
    name: "Emmanuel Terkimbi",
    email: "emmanuel.t@gmail.com",
    location: "Gwer East LGA",
    joinDate: "2024-03-15",
    status: "active",
    tier: "premium",
    farmSize: "5.2 ha",
    crops: ["Rice", "Yam"],
    avatar: "/placeholder.svg?height=40&width=40&text=ET",
  },
  {
    id: "BF-2024-001235",
    name: "Mary Ochoga",
    email: "mary.ochoga@gmail.com",
    location: "Makurdi LGA",
    joinDate: "2024-03-14",
    status: "pending",
    tier: "basic",
    farmSize: "3.8 ha",
    crops: ["Cassava", "Maize"],
    avatar: "/placeholder.svg?height=40&width=40&text=MO",
  },
  {
    id: "BF-2024-001236",
    name: "John Agbo",
    email: "john.agbo@gmail.com",
    location: "Gboko LGA",
    joinDate: "2024-03-13",
    status: "active",
    tier: "gold",
    farmSize: "7.5 ha",
    crops: ["Rice", "Maize", "Yam"],
    avatar: "/placeholder.svg?height=40&width=40&text=JA",
  },
  {
    id: "BF-2024-001237",
    name: "Grace Iortyom",
    email: "grace.iortyom@gmail.com",
    location: "Otukpo LGA",
    joinDate: "2024-03-12",
    status: "suspended",
    tier: "basic",
    farmSize: "2.1 ha",
    crops: ["Cassava"],
    avatar: "/placeholder.svg?height=40&width=40&text=GI",
  },
  {
    id: "BF-2024-001238",
    name: "Peter Akume",
    email: "peter.akume@gmail.com",
    location: "Katsina-Ala LGA",
    joinDate: "2024-03-11",
    status: "active",
    tier: "premium",
    farmSize: "6.3 ha",
    crops: ["Rice", "Yam", "Maize"],
    avatar: "/placeholder.svg?height=40&width=40&text=PA",
  },
]

const systemAlerts = [
  {
    id: 1,
    type: "critical",
    title: "Server Performance Alert",
    message: "Database response time increased by 45% in the last hour",
    timestamp: "5 minutes ago",
    status: "unresolved",
  },
  {
    id: 2,
    type: "warning",
    title: "High Registration Volume",
    message: "234 new farmer registrations pending approval",
    timestamp: "15 minutes ago",
    status: "acknowledged",
  },
  {
    id: 3,
    type: "info",
    title: "Scheduled Maintenance",
    message: "System maintenance scheduled for tonight at 2:00 AM",
    timestamp: "2 hours ago",
    status: "scheduled",
  },
  {
    id: 4,
    type: "warning",
    title: "Payment Gateway Issue",
    message: "3 failed payment transactions reported",
    timestamp: "3 hours ago",
    status: "investigating",
  },
]

const pendingApprovals = [
  {
    id: "BF-2024-001239",
    name: "David Terna",
    email: "david.terna@gmail.com",
    location: "Gwer West LGA",
    farmSize: "4.2 ha",
    crops: ["Rice", "Yam"],
    submittedDate: "2024-03-15",
    documents: ["Farm Certificate", "ID Card", "Bank Details"],
  },
  {
    id: "BF-2024-001240",
    name: "Sarah Mnguember",
    email: "sarah.m@gmail.com",
    location: "Ushongo LGA",
    farmSize: "3.1 ha",
    crops: ["Cassava", "Maize"],
    submittedDate: "2024-03-14",
    documents: ["Farm Certificate", "ID Card"],
  },
]

export default function AdminDashboard() {
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@bfpc.org",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=40&width=40&text=AD",
  })
  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false)
  const [showFarmerProfileModal, setShowFarmerProfileModal] = useState(false)
  const [showEditFarmerModal, setShowEditFarmerModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedFarmerForAction, setSelectedFarmerForAction] = useState<any>(null)
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    role: "Admin",
    password: "",
  })
  const [newFarmerData, setNewFarmerData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    farmSize: "",
    crops: [] as string[],
    bio: "",
  })
  const [messageData, setMessageData] = useState({
    subject: "",
    message: "",
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([])
  const [farmerFilter, setFarmerFilter] = useState("all")

  // Filter farmers based on search and status
  const filteredFarmers = recentFarmers.filter((farmer) => {
    const matchesSearch =
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (farmerFilter === "all") return matchesSearch
    return farmer.status === farmerFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "basic":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAdminImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAvatar = e.target?.result as string
        setAdminProfile((prev) => ({ ...prev, avatar: newAvatar }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExportData = () => {
    // Create CSV data
    const csvData = [
      ["Farmer ID", "Name", "Email", "Location", "Farm Size", "Crops", "Status", "Tier", "Join Date"],
      ...recentFarmers.map((farmer) => [
        farmer.id,
        farmer.name,
        farmer.email,
        farmer.location,
        farmer.farmSize,
        farmer.crops.join("; "),
        farmer.status,
        farmer.tier,
        farmer.joinDate,
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bfpc-farmers-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleAddAdmin = () => {
    if (newAdminData.name && newAdminData.email && newAdminData.password) {
      // In a real app, this would make an API call
      console.log("Adding new admin:", newAdminData)
      setShowAddAdminModal(false)
      setNewAdminData({ name: "", email: "", role: "Admin", password: "" })
      // Show success message
      alert("Admin user added successfully!")
    }
  }

  const handleAddFarmer = () => {
    if (newFarmerData.name && newFarmerData.email && newFarmerData.location) {
      // In a real app, this would make an API call
      console.log("Adding new farmer:", newFarmerData)
      setShowAddFarmerModal(false)
      setNewFarmerData({
        name: "",
        email: "",
        phone: "",
        location: "",
        farmSize: "",
        crops: [],
        bio: "",
      })
      alert("Farmer added successfully!")
    }
  }

  const handleViewFarmerProfile = (farmer: any) => {
    setSelectedFarmerForAction(farmer)
    setShowFarmerProfileModal(true)
  }

  const handleEditFarmer = (farmer: any) => {
    setSelectedFarmerForAction(farmer)
    setNewFarmerData({
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone || "",
      location: farmer.location,
      farmSize: farmer.farmSize,
      crops: farmer.crops,
      bio: farmer.bio || "",
    })
    setShowEditFarmerModal(true)
  }

  const handleSendMessage = (farmer: any) => {
    setSelectedFarmerForAction(farmer)
    setMessageData({ subject: "", message: "" })
    setShowMessageModal(true)
  }

  const handleSuspendFarmer = (farmer: any) => {
    if (confirm(`Are you sure you want to suspend ${farmer.name}?`)) {
      // In a real app, this would make an API call
      console.log("Suspending farmer:", farmer.id)
      alert(`${farmer.name} has been suspended.`)
    }
  }

  const handleSendMessageSubmit = () => {
    if (messageData.subject && messageData.message) {
      console.log("Sending message to:", selectedFarmerForAction?.name, messageData)
      setShowMessageModal(false)
      alert("Message sent successfully!")
    }
  }

  const handleUpdateFarmer = () => {
    if (newFarmerData.name && newFarmerData.email && newFarmerData.location) {
      console.log("Updating farmer:", selectedFarmerForAction?.id, newFarmerData)
      setShowEditFarmerModal(false)
      alert("Farmer details updated successfully!")
    }
  }

  const addCropToNewFarmer = (crop: string) => {
    if (crop && !newFarmerData.crops.includes(crop)) {
      setNewFarmerData((prev) => ({
        ...prev,
        crops: [...prev.crops, crop],
      }))
    }
  }

  const removeCropFromNewFarmer = (crop: string) => {
    setNewFarmerData((prev) => ({
      ...prev,
      crops: prev.crops.filter((c) => c !== crop),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl">
                  <Shield className="h-8 w-8 text-green-600" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Manage farmers, monitor platform activity, and oversee system operations
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowAddAdminModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin User
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Farmers</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {dashboardStats.totalFarmers.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Farmers</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {dashboardStats.activeFarmers.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">72% engagement rate</p>
                </div>
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{dashboardStats.totalRevenue}</p>
                  <p className="text-xs text-green-600">+18% from last month</p>
                </div>
                <Banknote className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{dashboardStats.pendingApprovals}</p>
                  <p className="text-xs text-orange-600">Requires attention</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 min-w-[800px] lg:min-w-0 bg-green-50 border border-green-200">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="farmers"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Farmers
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="approvals"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Approvals
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                System
              </TabsTrigger>
              <TabsTrigger
                value="crops"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Crops
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Farmer Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={farmerGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="farmers" stroke="#3b82f6" strokeWidth={3} name="Total" />
                        <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} name="Active" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-green-600" />
                    Revenue Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="revenue" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead>Total Farmers</TableHead>
                        <TableHead>Active Farmers</TableHead>
                        <TableHead>Engagement Rate</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionData.map((region, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{region.region}</TableCell>
                          <TableCell>{region.farmers.toLocaleString()}</TableCell>
                          <TableCell>{region.active.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={(region.active / region.farmers) * 100}
                                className="w-16 h-2 bg-gray-200 [&>div]:bg-green-600"
                              />
                              <span className="text-sm">{Math.round((region.active / region.farmers) * 100)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(region.revenue)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 text-sm">+{Math.floor(Math.random() * 20 + 5)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">{alert.title}</h4>
                        <p className="text-xs sm:text-sm mt-1">{alert.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span>{alert.timestamp}</span>
                          <Badge variant="outline" className="text-xs">
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-4 sm:space-y-6">
            {/* Farmer Management Header */}
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search farmers by name, email, or location..."
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
                          Filter: {farmerFilter === "all" ? "All" : farmerFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFarmerFilter("all")}>All Farmers</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFarmerFilter("active")}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFarmerFilter("pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFarmerFilter("suspended")}>Suspended</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowAddFarmerModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Farmer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farmers Table */}
            <Card className="border-green-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input type="checkbox" className="rounded" />
                        </TableHead>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Farm Size</TableHead>
                        <TableHead>Crops</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFarmers.map((farmer) => (
                        <TableRow key={farmer.id}>
                          <TableCell>
                            <input type="checkbox" className="rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={farmer.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                  {farmer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{farmer.name}</p>
                                <p className="text-xs text-gray-600">{farmer.email}</p>
                                <p className="text-xs text-gray-500">{farmer.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{farmer.location}</TableCell>
                          <TableCell className="text-sm">{farmer.farmSize}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {farmer.crops.map((crop, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(farmer.status)}>{farmer.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTierColor(farmer.tier)}>{farmer.tier}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{farmer.joinDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewFarmerProfile(farmer)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditFarmer(farmer)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendMessage(farmer)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleSuspendFarmer(farmer)}>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 sm:space-y-6">
            <AdminUserManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Crop Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={cropDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {cropDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {cropDistributionData.map((crop, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }} />
                        <span className="text-xs sm:text-sm">
                          {crop.name} ({crop.farmers.toLocaleString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Platform Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Daily Active Users</p>
                      <p className="text-2xl font-bold text-green-600">7,234</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Training Completions</p>
                      <p className="text-2xl font-bold text-blue-600">1,456</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Market Connections</p>
                      <p className="text-2xl font-bold text-purple-600">892</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">Support Tickets</p>
                      <p className="text-2xl font-bold text-amber-600">23</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">User Retention Rate</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="flex-1 h-2 bg-green-100 [&>div]:bg-green-600" />
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Training Completion Rate</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={73} className="flex-1 h-2 bg-blue-100 [&>div]:bg-blue-600" />
                      <span className="text-sm font-medium">73%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Market Connection Success</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={91} className="flex-1 h-2 bg-purple-100 [&>div]:bg-purple-600" />
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Support Resolution Rate</Label>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="flex-1 h-2 bg-green-100 [&>div]:bg-green-600" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4 sm:space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Pending Farmer Approvals
                </CardTitle>
                <CardDescription>Review and approve new farmer registrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApprovals.map((farmer) => (
                  <div key={farmer.id} className="p-4 border border-green-200 rounded-lg bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-10 w-10 bg-green-100">
                            <AvatarFallback className="text-green-700">
                              {farmer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{farmer.name}</h4>
                            <p className="text-sm text-gray-600">{farmer.email}</p>
                            <p className="text-xs text-gray-500">{farmer.id}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Location:</span> {farmer.location}
                          </div>
                          <div>
                            <span className="font-medium">Farm Size:</span> {farmer.farmSize}
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span> {farmer.submittedDate}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-sm">Crops:</span>
                          <div className="flex gap-1 mt-1">
                            {farmer.crops.map((crop, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {crop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-sm">Documents:</span>
                          <div className="flex gap-1 mt-1">
                            {farmer.documents.map((doc, index) => (
                              <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-green-300 text-green-700 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 bg-transparent">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Server Status</p>
                      <p className="text-sm text-gray-600">All systems operational</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Database Performance</p>
                      <p className="text-sm text-gray-600">Response time: 45ms</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Storage Usage</p>
                      <p className="text-sm text-gray-600">78% of capacity used</p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">API Performance</p>
                      <p className="text-sm text-gray-600">99.9% uptime</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Enable for system updates</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Auto Backups</Label>
                      <p className="text-sm text-gray-600">Daily automated backups</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-600">System alerts via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Debug Mode</Label>
                      <p className="text-sm text-gray-600">Enhanced logging</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Logs */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-green-600" />
                  Recent System Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="text-xs font-mono p-2 bg-gray-50 rounded">
                    <span className="text-green-600">[INFO]</span> 2024-03-15 14:30:25 - User authentication successful
                  </div>
                  <div className="text-xs font-mono p-2 bg-gray-50 rounded">
                    <span className="text-blue-600">[DEBUG]</span> 2024-03-15 14:29:18 - Database query executed in 23ms
                  </div>
                  <div className="text-xs font-mono p-2 bg-gray-50 rounded">
                    <span className="text-yellow-600">[WARN]</span> 2024-03-15 14:28:45 - High memory usage detected
                  </div>
                  <div className="text-xs font-mono p-2 bg-gray-50 rounded">
                    <span className="text-green-600">[INFO]</span> 2024-03-15 14:27:32 - Backup completed successfully
                  </div>
                  <div className="text-xs font-mono p-2 bg-gray-50 rounded">
                    <span className="text-red-600">[ERROR]</span> 2024-03-15 14:26:15 - Failed to send notification
                    email
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="space-y-4 sm:space-y-6">
            <AdminCropManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Benue Farmers Peace Corps" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" defaultValue="support@bfpc.org" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-farmers">Maximum Farmers</Label>
                    <Input id="max-farmers" type="number" defaultValue="50000" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Registration Open</Label>
                      <p className="text-sm text-gray-600">Allow new farmer registrations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle>Admin Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-green-200">
                        <AvatarImage src={adminProfile.avatar || "/placeholder.svg"} alt={adminProfile.name} />
                        <AvatarFallback className="text-green-700 bg-green-100">
                          {adminProfile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute -bottom-1 -right-1 bg-green-600 hover:bg-green-700 text-white p-1 rounded-full cursor-pointer transition-colors">
                        <Camera className="h-3 w-3" />
                        <input type="file" accept="image/*" onChange={handleAdminImageUpload} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold">{adminProfile.name}</h3>
                      <p className="text-sm text-gray-600">{adminProfile.email}</p>
                      <Badge className="bg-green-100 text-green-800 mt-1">{adminProfile.role}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Name</Label>
                    <Input
                      id="admin-name"
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Update Profile</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="border-green-300 text-green-700 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="border-blue-300 text-blue-700 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Add Admin Modal */}
        <Dialog open={showAddAdminModal} onOpenChange={setShowAddAdminModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>Create a new administrator account for the platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-admin-name">Full Name</Label>
                <Input
                  id="new-admin-name"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-admin-email">Email Address</Label>
                <Input
                  id="new-admin-email"
                  type="email"
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-admin-role">Role</Label>
                <select
                  id="new-admin-role"
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-admin-password">Password</Label>
                <Input
                  id="new-admin-password"
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAdminModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin} className="bg-green-600 hover:bg-green-700 text-white">
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Farmer Modal */}
        <Dialog open={showAddFarmerModal} onOpenChange={setShowAddFarmerModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Farmer</DialogTitle>
              <DialogDescription>Register a new farmer on the platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-farmer-name">Full Name</Label>
                  <Input
                    id="new-farmer-name"
                    value={newFarmerData.name}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-farmer-email">Email</Label>
                  <Input
                    id="new-farmer-email"
                    type="email"
                    value={newFarmerData.email}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-farmer-phone">Phone Number</Label>
                  <Input
                    id="new-farmer-phone"
                    value={newFarmerData.phone}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-farmer-location">Location</Label>
                  <Input
                    id="new-farmer-location"
                    value={newFarmerData.location}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-farmer-farm-size">Farm Size (hectares)</Label>
                <Input
                  id="new-farmer-farm-size"
                  value={newFarmerData.farmSize}
                  onChange={(e) => setNewFarmerData((prev) => ({ ...prev, farmSize: e.target.value }))}
                  placeholder="Enter farm size"
                />
              </div>
              <div className="space-y-2">
                <Label>Crops</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add crop"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addCropToNewFarmer((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector("input")
                      if (input?.value) {
                        addCropToNewFarmer(input.value)
                        input.value = ""
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newFarmerData.crops.map((crop, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => removeCropFromNewFarmer(crop)}
                    >
                      {crop} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-farmer-bio">Bio (Optional)</Label>
                <Textarea
                  id="new-farmer-bio"
                  value={newFarmerData.bio}
                  onChange={(e) => setNewFarmerData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Enter farmer bio"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddFarmerModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFarmer} className="bg-green-600 hover:bg-green-700 text-white">
                Add Farmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Farmer Profile Modal */}
        <Dialog open={showFarmerProfileModal} onOpenChange={setShowFarmerProfileModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Farmer Profile</DialogTitle>
              <DialogDescription>Complete farmer information and statistics.</DialogDescription>
            </DialogHeader>
            {selectedFarmerForAction && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedFarmerForAction.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {selectedFarmerForAction.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedFarmerForAction.name}</h3>
                    <p className="text-gray-600">{selectedFarmerForAction.email}</p>
                    <p className="text-sm text-gray-500">{selectedFarmerForAction.id}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={getStatusColor(selectedFarmerForAction.status)}>
                        {selectedFarmerForAction.status}
                      </Badge>
                      <Badge className={getTierColor(selectedFarmerForAction.tier)}>
                        {selectedFarmerForAction.tier}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Location:</strong> {selectedFarmerForAction.location}
                  </div>
                  <div>
                    <strong>Farm Size:</strong> {selectedFarmerForAction.farmSize}
                  </div>
                  <div>
                    <strong>Join Date:</strong> {selectedFarmerForAction.joinDate}
                  </div>
                  <div>
                    <strong>Crops:</strong> {selectedFarmerForAction.crops.join(", ")}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEditFarmer(selectedFarmerForAction)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSendMessage(selectedFarmerForAction)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 bg-transparent"
                      onClick={() => handleSuspendFarmer(selectedFarmerForAction)}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFarmerProfileModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Farmer Modal */}
        <Dialog open={showEditFarmerModal} onOpenChange={setShowEditFarmerModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Farmer Details</DialogTitle>
              <DialogDescription>Update farmer information and profile details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-farmer-name">Full Name</Label>
                  <Input
                    id="edit-farmer-name"
                    value={newFarmerData.name}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-farmer-email">Email</Label>
                  <Input
                    id="edit-farmer-email"
                    type="email"
                    value={newFarmerData.email}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-farmer-phone">Phone Number</Label>
                  <Input
                    id="edit-farmer-phone"
                    value={newFarmerData.phone}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-farmer-location">Location</Label>
                  <Input
                    id="edit-farmer-location"
                    value={newFarmerData.location}
                    onChange={(e) => setNewFarmerData((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-farmer-farm-size">Farm Size (hectares)</Label>
                <Input
                  id="edit-farmer-farm-size"
                  value={newFarmerData.farmSize}
                  onChange={(e) => setNewFarmerData((prev) => ({ ...prev, farmSize: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Crops</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add crop"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addCropToNewFarmer((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector("input")
                      if (input?.value) {
                        addCropToNewFarmer(input.value)
                        input.value = ""
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newFarmerData.crops.map((crop, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => removeCropFromNewFarmer(crop)}
                    >
                      {crop} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-farmer-bio">Bio</Label>
                <Textarea
                  id="edit-farmer-bio"
                  value={newFarmerData.bio}
                  onChange={(e) => setNewFarmerData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditFarmerModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFarmer} className="bg-green-600 hover:bg-green-700 text-white">
                Update Farmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Message Modal */}
        <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
              <DialogDescription>Send a message to {selectedFarmerForAction?.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="message-subject">Subject</Label>
                <Input
                  id="message-subject"
                  value={messageData.subject}
                  onChange={(e) => setMessageData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter message subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-content">Message</Label>
                <Textarea
                  id="message-content"
                  value={messageData.message}
                  onChange={(e) => setMessageData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessageSubmit} className="bg-green-600 hover:bg-green-700 text-white">
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
