"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import UserProductManager from "@/components/UserProductManager"
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

export default function DashboardProductsPage() {
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
        activeTab="products"
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
          <UserProductManager />
        </div>
      </div>
    </div>
  )
}
