"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Leaf, ShoppingBag, CloudRain, User as UserIcon, Sun } from "lucide-react"
import Loading from "@/components/Loading"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/overview" },
  { id: "profile", label: "Profile", icon: <UserIcon className="h-5 w-5" />, href: "/dashboard/profile" },
  { id: "crops", label: "My Crops", icon: <Leaf className="h-5 w-5" />, href: "/dashboard/crops" },
  { id: "products", label: "My Products", icon: <ShoppingBag className="h-5 w-5" />, href: "/dashboard/products" },
  { id: "weather", label: "Weather", icon: <CloudRain className="h-5 w-5" />, href: "/dashboard/weather" },
  { id: "market", label: "Market", icon: <span className="text-lg font-bold">₦</span>, href: "/dashboard/market" },
]

export default function DashboardWeatherPage() {
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
        activeTab="weather"
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
              <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
              <p className="text-gray-600">7-day weather outlook for your area</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[...Array(7)].map((_, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <p className="text-sm font-medium">
                        {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <Sun className="h-8 w-8 text-yellow-500 mx-auto my-2" />
                      <p className="text-lg font-bold">{28 + Math.floor(Math.random() * 6)}°C</p>
                      <p className="text-xs text-gray-500">{Math.floor(Math.random() * 30)}% rain</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
