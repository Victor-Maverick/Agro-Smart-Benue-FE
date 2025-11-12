"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Users, 
  Sprout,
  ShoppingBag,
  Package
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface CollapsibleSidebarProps {
  items: SidebarItem[]
  activeTab: string
  onTabChange: (tab: string) => void
  title: string
}

export default function CollapsibleSidebar({ 
  items, 
  activeTab, 
  onTabChange, 
  title 
}: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/header image.png" 
                alt="BFPC Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
          )}
          {isCollapsed && (
            <Image 
              src="/images/header image.png" 
              alt="BFPC Logo" 
              width={24} 
              height={24} 
              className="object-contain mx-auto"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("ml-auto", isCollapsed && "mx-auto mt-2")}
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                activeTab === item.id
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Spacer for content */}
      <div className={cn("transition-all duration-300", isCollapsed ? "w-16" : "w-64")} />
    </>
  )
}
