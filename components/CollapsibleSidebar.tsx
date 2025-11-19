"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Users, 
  Sprout,
  ShoppingBag,
  Package,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import axios from "axios"

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
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsMobileOpen(false) // Close mobile menu after selection
  }

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint if we have a token
      if (session?.accessToken) {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
        try {
          await axios.post(
            `${API_URL}/api/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`
              }
            }
          )
        } catch (error) {
          console.error("Backend logout error:", error)
          // Continue with frontend logout even if backend fails
        }
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
    
    // Clear all storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Sign out from NextAuth and force reload
    await signOut({ redirect: false })
    window.location.href = "/"
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300",
          // Desktop behavior
          "hidden lg:block",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile behavior
          isMobileOpen ? "block w-64" : "hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Image 
                  src="/images/header image.png" 
                  alt="BFPC Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link href="/" className="w-full flex items-center justify-center hover:opacity-80 transition-opacity">
              <Image 
                src="/images/header image.png" 
                alt="BFPC Logo" 
                width={32} 
                height={32} 
                className="object-contain"
              />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col h-[calc(100vh-4rem)] p-2">
          <div className="space-y-1 flex-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                  activeTab === item.id
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* Logout Button at Bottom */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors",
                "text-red-600 hover:bg-red-50"
              )}
            >
              <span className="flex-shrink-0">
                <LogOut className="h-5 w-5" />
              </span>
              {(!isCollapsed || isMobileOpen) && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </nav>
      </aside>

      {/* Spacer for content - only on desktop */}
      <div className={cn("hidden lg:block transition-all duration-300", isCollapsed ? "w-16" : "w-64")} />
    </>
  )
}
