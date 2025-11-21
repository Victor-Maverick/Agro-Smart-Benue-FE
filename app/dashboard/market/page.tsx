"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Leaf, ShoppingBag, CloudRain, User as UserIcon, TrendingUp } from "lucide-react"
import Loading from "@/components/Loading"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/overview" },
  { id: "profile", label: "Profile", icon: <UserIcon className="h-5 w-5" />, href: "/dashboard/profile" },
  { id: "crops", label: "My Crops", icon: <Leaf className="h-5 w-5" />, href: "/dashboard/crops" },
  { id: "products", label: "My Products", icon: <ShoppingBag className="h-5 w-5" />, href: "/dashboard/products" },
  { id: "weather", label: "Weather", icon: <CloudRain className="h-5 w-5" />, href: "/dashboard/weather" },
  { id: "market", label: "Market", icon: <span className="text-lg font-bold">₦</span>, href: "/dashboard/market" },
]

const marketPrices = [
  { crop: "Maize", location: "Gboko Main Market", price: "₦15,000/bag", trend: "up" },
  { crop: "Yam", location: "Zaki-Biam Yam Market", price: "₦3,500/tuber", trend: "down" },
  { crop: "Cassava", location: "Makurdi Modern Market", price: "₦25,000/bag", trend: "up" },
  { crop: "Soya Beans", location: "Adikpo Market", price: "₦18,000/bag", trend: "up" },
]

export default function DashboardMarketPage() {
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
        activeTab="market"
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
              <h2 className="text-2xl font-bold text-gray-900">Market Prices</h2>
              <p className="text-gray-600">Current market prices across Benue State</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketPrices.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{item.crop}</span>
                      {item.trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                      )}
                    </CardTitle>
                    <CardDescription>{item.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">{item.price}</p>
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
