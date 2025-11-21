"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Leaf,
    TrendingUp,
    CloudRain,
    Thermometer,
    Droplets,
    Sun,
    Bell,
    Settings,
    LogOut,
    MapPin,
    BarChart3,
    ShoppingBag,
    Loader2,
    User as UserIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import UserProductManager from "@/components/UserProductManager"
import UserProfile from "@/components/UserProfile"
import Link from "next/link"
import axios from "axios"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" />, href: "/dashboard/overview" },
  { id: "profile", label: "Profile", icon: <UserIcon className="h-5 w-5" />, href: "/dashboard/profile" },
  { id: "crops", label: "My Crops", icon: <Leaf className="h-5 w-5" />, href: "/dashboard/crops" },
  { id: "products", label: "My Products", icon: <ShoppingBag className="h-5 w-5" />, href: "/dashboard/products" },
  { id: "weather", label: "Weather", icon: <CloudRain className="h-5 w-5" />, href: "/dashboard/weather" },
  { id: "market", label: "Market", icon: <span className="text-lg font-bold">₦</span>, href: "/dashboard/market" },
]

export default function UserDashboard() {
    const { data: session } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("overview")
    const [notifications] = useState(3)
    const [weatherData, setWeatherData] = useState<any>(null)
    const [weatherLoading, setWeatherLoading] = useState(true)

    useEffect(() => {
        fetchWeather()
    }, [])

    const fetchWeather = async () => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
            const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Makurdi&aqi=no`
            )
            setWeatherData({
                temperature: Math.round(response.data.current.temp_c),
                humidity: response.data.current.humidity,
                rainfall: response.data.current.precip_mm,
                forecast: response.data.current.condition.text,
                location: `${response.data.location.name}, ${response.data.location.region}`,
            })
        } catch (error) {
            console.error("Failed to fetch weather:", error)
        } finally {
            setWeatherLoading(false)
        }
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

    const cropData = [
        { name: "Rice", planted: "2 hectares", status: "Growing", health: 85 },
        { name: "Yam", planted: "1.5 hectares", status: "Harvesting", health: 92 },
        { name: "Cassava", planted: "1 hectare", status: "Mature", health: 78 },
    ]

    const marketPrices = [
        { crop: "Maize", location: "Gboko Main Market", price: "₦15,000/bag", trend: "up" },
        { crop: "Yam", location: "Zaki-Biam Yam Market", price: "₦3,500/tuber", trend: "down" },
        { crop: "Cassava", location: "Makurdi Modern Market", price: "₦25,000/bag", trend: "up" },
        { crop: "Soya Beans", location: "Adikpo Market", price: "₦18,000/bag", trend: "up" },
    ]

    const recentActivities = [
        { action: "Planted rice seeds", date: "2 days ago", icon: <Leaf className="h-4 w-4" /> },
        { action: "Applied fertilizer to yam", date: "5 days ago", icon: <Droplets className="h-4 w-4" /> },
        { action: "Harvested cassava", date: "1 week ago", icon: <TrendingUp className="h-4 w-4" /> },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Collapsible Sidebar */}
            <CollapsibleSidebar
                items={sidebarItems}
                activeTab={activeTab}
                onTabChange={(tabId) => {
                    const item = sidebarItems.find(i => i.id === tabId)
                    if (item?.href) {
                        router.push(item.href)
                    }
                }}
                title="Dashboard"
            />

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Welcome back, {session?.user?.firstName} {session?.user?.lastName}</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <Link href="/dashboard/notifications">
                                    <Button variant="ghost" size="sm" className="relative">
                                        <Bell className="h-5 w-5" />
                                        {notifications > 0 && (
                                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                                                {notifications}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={session?.user?.mediaUrl || "/placeholder.svg?height=32&width=32"} alt={`${session?.user?.firstName} ${session?.user?.lastName}`} />
                                                <AvatarFallback>{session?.user?.firstName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session?.user?.firstName} {session?.user?.lastName}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link href="/profile" className="flex items-center w-full">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Weather Widget */}
                                {weatherLoading ? (
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                                                <span className="ml-2 text-gray-600">Loading weather...</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : weatherData ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <CloudRain className="h-5 w-5" />
                                                <span>Today's Weather in {weatherData.location}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Thermometer className="h-5 w-5 text-orange-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Temperature</p>
                                                        <p className="text-lg font-semibold">{weatherData.temperature}°C</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Droplets className="h-5 w-5 text-blue-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Humidity</p>
                                                        <p className="text-lg font-semibold">{weatherData.humidity}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <CloudRain className="h-5 w-5 text-gray-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Rainfall</p>
                                                        <p className="text-lg font-semibold">{weatherData.rainfall}mm</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Sun className="h-5 w-5 text-yellow-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Forecast</p>
                                                        <p className="text-sm">{weatherData.forecast}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : null}

                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
                                            <Leaf className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">3</div>
                                            <p className="text-xs text-muted-foreground">Different crop varieties</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Location</CardTitle>
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">Benue State</div>
                                            <p className="text-xs text-muted-foreground">Your farming location</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activities */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Activities</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentActivities.map((activity, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <div className="text-green-600">{activity.icon}</div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{activity.action}</p>
                                                        <p className="text-xs text-gray-500">{activity.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === "profile" && <UserProfile />}

                        {/* Crops Tab */}
                        {activeTab === "crops" && (
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
                        )}

                        {/* Products Tab */}
                        {activeTab === "products" && <UserProductManager />}

                        {/* Weather Tab */}
                        {activeTab === "weather" && (
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
                        )}

                        {/* Market Tab */}
                        {activeTab === "market" && (
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
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
