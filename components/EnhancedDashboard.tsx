"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Bell,
  Calendar,
  DollarSign,
  Leaf,
  MapPin,
  Settings,
  TrendingUp,
  Users,
  Wheat,
} from "lucide-react"
import ProfileSetup from "./ProfileSetup"
import FarmSetup from "./FarmSetup"
import CropInterestSetup from "./CropInterestSetup"
import DetailedMarketPrices from "./DetailedMarketPrices"

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [setupStep, setSetupStep] = useState<"profile" | "farm" | "crops" | "complete">("complete")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      // Check profile status
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/status`)
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        if (!profileData.data) {
          setSetupStep("profile")
          setLoading(false)
          return
        }
      }

      // Check if user has farms
      const farmsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/farms`)
      
      if (farmsResponse.ok) {
        const farmsData = await farmsResponse.json()
        if (!farmsData.data || farmsData.data.length === 0) {
          setSetupStep("farm")
          setLoading(false)
          return
        }
      }

      // Check if user has crop interests
      const cropInterestsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-crop-interests`)
      
      if (cropInterestsResponse.ok) {
        const cropInterestsData = await cropInterestsResponse.json()
        if (!cropInterestsData.data || cropInterestsData.data.length === 0) {
          setSetupStep("crops")
          setLoading(false)
          return
        }
      }

      setSetupStep("complete")
    } catch (error) {
      console.error("Failed to check setup status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetupComplete = (step: string) => {
    if (step === "profile") {
      setSetupStep("farm")
    } else if (step === "farm") {
      setSetupStep("crops")
    } else if (step === "crops") {
      setSetupStep("complete")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show setup components if not complete
  if (setupStep === "profile") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <ProfileSetup onComplete={() => handleSetupComplete("profile")} />
      </div>
    )
  }

  if (setupStep === "farm") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <FarmSetup onComplete={() => handleSetupComplete("farm")} />
      </div>
    )
  }

  if (setupStep === "crops") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <CropInterestSetup onComplete={() => handleSetupComplete("crops")} />
      </div>
    )
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">BFPC Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farms">My Farms</TabsTrigger>
            <TabsTrigger value="market">Market Prices</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Area</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.5 ha</div>
                  <p className="text-xs text-muted-foreground">Across all farms</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
                  <Wheat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Currently growing</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦2.5M</div>
                  <p className="text-xs text-muted-foreground">Estimated harvest value</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crop Progress</CardTitle>
                  <CardDescription>Track your current farming activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rice (2.5 ha)</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground">Growing - Expected harvest in 45 days</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yam (2.0 ha)</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <p className="text-xs text-muted-foreground">Planted - Early growth stage</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cassava (1.0 ha)</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Harvested - Ready for market</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Prices</CardTitle>
                  <CardDescription>Latest prices for your crops</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Rice</p>
                      <p className="text-sm text-muted-foreground">per bag (50kg)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₦45,000</p>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Yam</p>
                      <p className="text-sm text-muted-foreground">per tuber</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₦25,000</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="w-3 h-3 mr-1">—</span>
                        Stable
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cassava</p>
                      <p className="text-sm text-muted-foreground">per bag (50kg)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">₦15,000</p>
                      <div className="flex items-center text-xs text-red-600">
                        <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                        -3%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="farms">
            <Card>
              <CardHeader>
                <CardTitle>My Farms</CardTitle>
                <CardDescription>Manage your farming operations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Farm management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <DetailedMarketPrices />
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Agricultural events and training programs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Events interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}