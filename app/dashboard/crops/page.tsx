"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Leaf, ShoppingBag, CloudRain, User as UserIcon } from "lucide-react"
import Loading from "@/components/Loading"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/overview" },
  { id: "profile", label: "Profile", icon: <UserIcon className="h-5 w-5" />, href: "/dashboard/profile" },
  { id: "crops", label: "My Crops", icon: <Leaf className="h-5 w-5" />, href: "/dashboard/crops" },
  { id: "products", label: "My Products", icon: <ShoppingBag className="h-5 w-5" />, href: "/dashboard/products" },
  { id: "weather", label: "Weather", icon: <CloudRain className="h-5 w-5" />, href: "/dashboard/weather" },
  { id: "market", label: "Market", icon: <span className="text-lg font-bold">₦</span>, href: "/dashboard/market" },
]

const cropData = [
  { name: "Rice", planted: "2 hectares", status: "Growing", health: 85 },
  { name: "Yam", planted: "1.5 hectares", status: "Harvesting", health: 92 },
  { name: "Cassava", planted: "1 hectare", status: "Mature", health: 78 },
]

export default function DashboardCropsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CollapsibleSidebar
        items={sidebarItems}
        activeTab="crops"
        onTabChange={(tabId) => {
          const item = sidebarItems.find(i => i.id === tabId)
          if (item?.href) {
            router.push(item.href)
          }
        }}
        title="Dashboard"
      />

      <div className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Crops</h2>
              <p className="text-gray-600">Manage and monitor your crop health</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cropData.map((crop, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{crop.name}</span>
                      <Badge
                        variant={
                          crop.status === "Growing" ? "default" : crop.status === "Harvesting" ? "secondary" : "outline"
                        }
                      >
                        {crop.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Planted: {crop.planted}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Health Score</span>
                        <span>{crop.health}%</span>
                      </div>
                      <Progress value={crop.health} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
