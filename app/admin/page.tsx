"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Calendar, DollarSign, Users, BarChart3, Sprout, Package, Loader2, Star } from "lucide-react"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import AdminEventManager from "@/components/AdminEventManager"
import AdminMarketPriceManager from "@/components/AdminMarketPriceManager"
import AdminUserManager from "@/components/AdminUserManager"
import AdminCropManager from "@/components/AdminCropManager"
import AdminProductsDemandsManager from "@/components/AdminProductsDemandsManager"
import AdminCropTipManager from "@/components/AdminCropTipManager"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getApiUrl } from "@/lib/config"

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6']

const sidebarItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/overview" },
  { id: "events", label: "Events", icon: <Calendar className="h-5 w-5" />, href: "/admin/events" },
  { id: "prices", label: "Market Prices", icon: <DollarSign className="h-5 w-5" />, href: "/admin/prices" },
  { id: "products", label: "Products & Demands", icon: <Package className="h-5 w-5" />, href: "/admin/products" },
  { id: "crops", label: "Crops", icon: <Sprout className="h-5 w-5" />, href: "/admin/crops" },
  { id: "crop-tips", label: "Crop Tips", icon: <Sprout className="h-5 w-5" />, href: "/admin/crop-tips" },
  { id: "users", label: "Users", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [statistics, setStatistics] = useState<any>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    totalMarketPrices: 0,
    totalCrops: 0,
    totalReviews: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview'
    setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    fetchStatistics()
    fetchUpcomingEvents()
    fetchDashboardStats()
  }, [])

  const handleTabChange = (tabId: string) => {
    router.push(`/admin?tab=${tabId}`)
  }

  const fetchStatistics = async () => {
    try {
      const response = await fetch(getApiUrl('/api/market-prices/statistics'))
      if (response.ok) {
        const data = await response.json()
        setStatistics(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
    }
  }

  const fetchUpcomingEvents = async () => {
    try {
      const response = await fetch(getApiUrl('/api/events/upcoming'))
      if (response.ok) {
        const data = await response.json()
        setUpcomingEvents(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error)
    } finally {
      setLoadingEvents(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      // Fetch all stats in parallel
      const [usersRes, eventsRes, pricesRes, cropsRes, reviewsRes] = await Promise.all([
        fetch(getApiUrl('/api/users/allCount')),
        fetch(getApiUrl('/api/events/active-count')),
        fetch(getApiUrl('/api/market-prices/statistics')),
        fetch(getApiUrl('/api/crops')),
        fetch(getApiUrl('/api/reviews/count'))
      ])

      const newStats = { ...stats }

      if (usersRes.ok) {
        newStats.totalUsers = await usersRes.json()
      }

      if (eventsRes.ok) {
        const data = await eventsRes.json()
        newStats.activeEvents = data.data || 0
      }

      if (pricesRes.ok) {
        const data = await pricesRes.json()
        newStats.totalMarketPrices = data.data?.totalPriceEntries || 0
      }

      if (cropsRes.ok) {
        const data = await cropsRes.json()
        newStats.totalCrops = data.data?.length || 0
      }

      if (reviewsRes.ok) {
        newStats.totalReviews = await reviewsRes.json()
      }

      setStats(newStats)
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Collapsible Sidebar */}
      <CollapsibleSidebar
        items={sidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        title="BFPC Admin"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">

          {activeTab === "overview" && (
            <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Registered users</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.activeEvents}</div>
                      <p className="text-xs text-muted-foreground">Currently active</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Prices</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.totalMarketPrices}</div>
                      <p className="text-xs text-muted-foreground">Price entries</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.totalCrops}</div>
                      <p className="text-xs text-muted-foreground">Crops tracked</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stats.totalReviews}</div>
                      <p className="text-xs text-muted-foreground">User reviews</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Market Price Distribution Pie Chart */}
            {statistics && (
              <Card>
                <CardHeader>
                  <CardTitle>Market Price Distribution</CardTitle>
                  <CardDescription>Average prices by crop type across all markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={statistics.priceDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(Number(percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statistics.priceDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Markets</p>
                      <p className="text-2xl font-bold text-green-600">{statistics.totalMarkets}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Crops Tracked</p>
                      <p className="text-2xl font-bold text-green-600">{statistics.totalCrops}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Price Entries</p>
                      <p className="text-2xl font-bold text-green-600">{statistics.totalPriceEntries}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events from database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingEvents ? (
                    <p className="text-sm text-gray-500">Loading events...</p>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 3).map((event, index) => (
                      <div key={event.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {event.location} - {formatEventDate(event.eventDate)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming events</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Updates</CardTitle>
                  <CardDescription>Recent market price changes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Rice - Makurdi Market</p>
                      <p className="text-xs text-gray-500">Updated 2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">₦45,000</p>
                      <p className="text-xs text-green-600">+2.3%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Yam - Gboko Market</p>
                      <p className="text-xs text-gray-500">Updated 4 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">₦23,000</p>
                      <p className="text-xs text-gray-500">No change</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Soybean - Katsina-Ala</p>
                      <p className="text-xs text-gray-500">Updated 6 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">₦54,000</p>
                      <p className="text-xs text-red-600">-1.8%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {activeTab === "events" && <AdminEventManager />}
          {activeTab === "prices" && <AdminMarketPriceManager />}
          {activeTab === "products" && <AdminProductsDemandsManager />}
          {activeTab === "crops" && <AdminCropManager />}
          {activeTab === "crop-tips" && <AdminCropTipManager />}
          {activeTab === "users" && <AdminUserManager />}
          </div>
        </div>
      </div>
    </div>
  )
}