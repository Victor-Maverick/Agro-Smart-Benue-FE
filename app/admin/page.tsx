"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Calendar, DollarSign, Users, BarChart3 } from "lucide-react"
import AdminEventManager from "@/components/AdminEventManager"
import AdminMarketPriceManager from "@/components/AdminMarketPriceManager"
import AdminUserManager from "@/components/AdminUserManager"
import AdminCropManager from "@/components/AdminCropManager"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6']

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [statistics, setStatistics] = useState<any>(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-prices/statistics`)
      if (response.ok) {
        const data = await response.json()
        setStatistics(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">BFPC Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">
            Manage events, market prices, and platform content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="prices">Market Prices</TabsTrigger>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">3 upcoming this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Prices</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">Across 8 markets</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Registered Farms</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">567</div>
                  <p className="text-xs text-muted-foreground">+23 this month</p>
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
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
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
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Latest agricultural events and programs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Rice Farming Workshop</p>
                      <p className="text-xs text-gray-500">Makurdi - Dec 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Digital Marketing Conference</p>
                      <p className="text-xs text-gray-500">Gboko - Dec 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cassava Processing Seminar</p>
                      <p className="text-xs text-gray-500">Otukpo - Dec 25, 2024</p>
                    </div>
                  </div>
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
          </TabsContent>

          <TabsContent value="events">
            <AdminEventManager />
          </TabsContent>

          <TabsContent value="prices">
            <AdminMarketPriceManager />
          </TabsContent>

          <TabsContent value="crops">
            <AdminCropManager />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}