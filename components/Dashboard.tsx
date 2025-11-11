"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    TrendingDown,
    CloudRain,
    Thermometer,
    Droplets,
    Sun,
    AlertTriangle,
    Users,
    MessageSquare,
    Bell,
    Settings,
    LogOut,
    Calendar,
    MapPin,
    DollarSign,
    BarChart3,
    Wifi,
    WifiOff,
    ArrowLeft,
    ChevronDown,
    Wind,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isOnline, setIsOnline] = useState(true)
    const [notifications, setNotifications] = useState(3)
    const [showDetailedWeather, setShowDetailedWeather] = useState(false)
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0)


    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    useEffect(() => {
        const alertInterval = setInterval(() => {
            setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % alerts.length)
        }, 5000);

        return () => clearInterval(alertInterval);
    }, []);

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const weatherData = {
        temperature: 28,
        humidity: 65,
        rainfall: 12,
        forecast: "Partly cloudy with chance of rain",
        location: "Benue State",
        tempHigh: 32,
        tempLow: 18,
        wind: 12,
        rainProb: 26,
        hourlyForecast: [
            { time: "00 PM", temp: 23, icon: <Sun /> },
            { time: "01 PM", temp: 24, icon: <Sun /> },
            { time: "02 PM", temp: 27, icon: <CloudRain /> },
            { time: "03 PM", temp: 32, icon: <CloudRain /> },
            { time: "04 PM", temp: 29, icon: <Sun /> },
        ],
        weeklyForecast: [
            { day: "Mon", temp: 28, icon: <Sun /> },
            { day: "Tue", temp: 30, icon: <Sun /> },
            { day: "Wed", temp: 26, icon: <CloudRain /> },
            { day: "Thu", temp: 29, icon: <Sun /> },
            { day: "Fri", temp: 27, icon: <CloudRain /> },
            { day: "Sat", temp: 31, icon: <Sun /> },
            { day: "Sun", temp: 29, icon: <Sun /> },
        ]
    }

    const cropData = [
        { name: "Rice", planted: "2 hectares", status: "Growing", health: 85 },
        { name: "Yam", planted: "1.5 hectares", status: "Harvesting", health: 92 },
        { name: "Cassava", planted: "1 hectare", status: "Mature", health: 78 },
    ]

    const marketPrices = [
        { crop: "Maize", location: "Gboko Main Market", price: "₦15,000/bag", trend: "up", image: "./images/maize.jpg" },
        { crop: "Yam", location: "Zaki-Biam Yam Market", price: "₦3,500/tuber", trend: "down", image: "./images/yam-market.jpeg" },
        { crop: "Cassava", location: "Makurdi Modern Market", price: "₦25,000/bag", trend: "up", image: "./images/cassava-market.jpg" },
        { crop: "Soya Beans", location: "Adikpo Market", price: "₦18,000/bag", trend: "up", image: "./images/soya-beans.jpg" },
    ];

    const recentActivities = [
        { action: "Planted rice seeds", date: "2 days ago", icon: <Leaf className="h-4 w-4" /> },
        { action: "Applied fertilizer to yam", date: "5 days ago", icon: <Droplets className="h-4 w-4" /> },
        { action: "Harvested cassava", date: "1 week ago", icon: <TrendingUp className="h-4 w-4" /> },
    ]

    const alerts = [
        { message: "Heavy rain expected tomorrow", image: "./images/heavy-rain-alert.jpg" },
        { message: "Pest alert for rice crops", image: "./images/rice-pest-alert.jpg" },
        { message: "Fertilizer application due", image: "./images/fertilizer-application-alert.jpg" },
    ]

    if (showDetailedWeather) {
        return (
            <div className="min-h-screen bg-white">
                <header className="bg-green-600 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Button variant="ghost" size="icon" onClick={() => setShowDetailedWeather(false)}>
                        <ArrowLeft className="h-5 w-5 text-white" />
                    </Button>
                    <h1 className="text-xl font-bold text-white">Weather</h1>
                    <div className="w-8" />
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Current Weather Card */}
                    <Card className="bg-white rounded-lg shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Lekki, Lagos, Nigeria</span>
                                </div>
                                <span>Today 12:30 PM</span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center space-x-4">
                                    <Sun className="h-16 w-16 text-yellow-500" />
                                    <div>
                                        <p className="text-xl font-medium">Mostly Sunny</p>
                                        <div className="flex space-x-2 text-gray-500">
                                            <span>High {weatherData.tempHigh}°</span>
                                            <span>Low {weatherData.tempLow}°</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-6xl font-bold">{weatherData.temperature}°</div>
                            </div>
                            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Wind className="h-4 w-4" />
                                    <span>{weatherData.wind}km/h</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Droplets className="h-4 w-4" />
                                    <span>{weatherData.humidity}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <CloudRain className="h-4 w-4" />
                                    <span>{weatherData.rainProb}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hourly Forecast */}
                    <Card className="rounded-lg shadow-lg">
                        <CardHeader>
                            <CardTitle>Hourly Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4 overflow-x-auto pb-4">
                                {weatherData.hourlyForecast.map((hour, index) => (
                                    <div key={index} className="flex-shrink-0 text-center w-20">
                                        <p className="text-sm text-gray-500">{hour.time}</p>
                                        <div className="my-2">{hour.icon}</div>
                                        <p className="font-bold">{hour.temp}°</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Forecast */}
                    <Card className="rounded-lg shadow-lg">
                        <CardHeader>
                            <CardTitle>Next 7 Days</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-4">
                                {weatherData.weeklyForecast.map((day, index) => (
                                    <div key={index} className="text-center">
                                        <p className="text-sm font-medium">{day.day}</p>
                                        <div className="my-2">{day.icon}</div>
                                        <p className="font-bold">{day.temp}°</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Desktop View */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Image src="/images/header image.png" alt="BFPC Logo" width={32} height={32} className="object-contain"/>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">BFPC Dashboard</h1>
                                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
                            </div>
                        </div>

                        {/* Mobile View */}
                        <div className="flex md:hidden items-center space-x-4">
                            <div className="flex flex-col items-center">
                                
                                <Link href="/profile" >  
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name} />
                                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <p className="text-xs text-gray-500 mt-1">{user?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Desktop View */}
                            <div className="hidden md:flex items-center space-x-2">
                                {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
                                <span className="text-sm text-gray-600">{isOnline ? "Online" : "Offline"}</span>
                            </div>

                            {/* Notifications */}
                        <Link href="/notification">
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
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:block">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name} />
                                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Weather Card - Appears after the nav bar before alerts */}
                <div onClick={() => setShowDetailedWeather(true)} className="md:hidden">
                    <Card className="bg-green-600 text-white cursor-pointer rounded-lg shadow-md mb-8">
                        <CardContent className="p-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">Weather in</span>
                                    <span className="text-lg font-bold">{weatherData.location}</span>
                                </div>
                                <div className="text-3xl font-bold">
                                    {weatherData.temperature}°C
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 mt-2">
                                <span className="text-sm">{weatherData.forecast}</span>
                                <span className="text-xs">({weatherData.rainfall}mm)</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts - Sliding Carousel with background images */}
                {alerts.length > 0 && (
                    <div className="mb-8 relative overflow-hidden h-32 md:h-48">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentAlertIndex * 100}%)` }}
                        >
                            {alerts.map((alert, index) => (
                                <Card
                                    key={index}
                                    className="flex-shrink-0 w-full h-full rounded-lg shadow-md bg-cover bg-center"
                                    style={{ backgroundImage: `url(${alert.image})` }}
                                >
                                    <div className="p-4 flex items-center justify-center h-full w-full">
                    <span className="text-lg font-bold text-white text-center drop-shadow-lg">
                      {alert.message}
                    </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Dashboard Content */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="crops">My Crops</TabsTrigger>
                        <TabsTrigger value="weather">Weather</TabsTrigger>
                        <TabsTrigger value="market">Market</TabsTrigger>
                        <TabsTrigger value="community">Community</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Desktop Weather Widget */}
                        <div className="hidden md:block">
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
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Farm Area</CardTitle>
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{user?.farmDetails?.farmSize || 0} ha</div>
                                    <p className="text-xs text-muted-foreground">{user?.farmDetails?.location || "Benue State"}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
                                    <Leaf className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{user?.farmDetails?.crops?.length || 0}</div>
                                    <p className="text-xs text-muted-foreground">Different crop varieties</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">₦245,000</div>
                                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Farm Health Score</CardTitle>
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">85%</div>
                                    <Progress value={85} className="mt-2" />
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
                    </TabsContent>

                    {/* Crops Tab */}
                    <TabsContent value="crops" className="space-y-6">
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
                    </TabsContent>

                    {/* Weather Tab */}
                    <TabsContent value="weather" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>7-Day Weather Forecast</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto whitespace-nowrap scrollbar-width: none;">
                                    <div className="flex justify-between space-x-4 p-4 ">
                                        {[...Array(7)].map((_, index) => (
                                            <div key={index} className="text-center p-4 border rounded-lg min-w-[120px]">
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
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Market Tab */}
                    <TabsContent value="market" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Market Prices</CardTitle>
                                <CardDescription>Latest commodity prices from major markets in Benue State</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-2 font-semibold text-gray-700">Crop</th>
                                                <th className="text-left py-3 px-2 font-semibold text-gray-700">Market Location</th>
                                                <th className="text-right py-3 px-2 font-semibold text-gray-700">Price</th>
                                                <th className="text-center py-3 px-2 font-semibold text-gray-700">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {marketPrices.map((item, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-2">
                                                        <div className="flex items-center space-x-3">
                                                            <img src={item.image} alt={item.crop} className="h-10 w-10 rounded-lg object-cover" />
                                                            <span className="font-medium text-gray-900">{item.crop}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-gray-600">{item.location}</td>
                                                    <td className="py-4 px-2 text-right font-bold text-lg">{item.price}</td>
                                                    <td className="py-4 px-2 text-center">
                                                        <div className="flex items-center justify-center">
                                                            {item.trend === 'up' ? (
                                                                <div className="flex items-center space-x-1 text-green-600">
                                                                    <TrendingUp className="h-4 w-4" />
                                                                    <span className="text-sm font-medium">Up</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-1 text-red-600">
                                                                    <TrendingDown className="h-4 w-4" />
                                                                    <span className="text-sm font-medium">Down</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-sm text-gray-500 text-center">
                                    Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Community Tab */}
                    <TabsContent value="community" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Users className="h-5 w-5" />
                                        <span>Farmer Network</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span>Connected Farmers</span>
                                            <Badge>1,247</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Local Groups</span>
                                            <Badge>23</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Active Discussions</span>
                                            <Badge>156</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MessageSquare className="h-5 w-5" />
                                        <span>Recent Discussions</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium">Best fertilizer for yam cultivation?</p>
                                            <p className="text-xs text-gray-500">12 replies • 2 hours ago</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium">Rice pest control methods</p>
                                            <p className="text-xs text-gray-500">8 replies • 5 hours ago</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium">Market prices in Makurdi</p>
                                            <p className="text-xs text-gray-500">15 replies • 1 day ago</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
// "use client"
//
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Leaf,
//   TrendingUp,
//   CloudRain,
//   Thermometer,
//   Droplets,
//   Sun,
//   AlertTriangle,
//   Users,
//   MessageSquare,
//   Bell,
//   Settings,
//   LogOut,
//   Calendar,
//   MapPin,
//   DollarSign,
//   BarChart3,
//   Wifi,
//   WifiOff,
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import {useAuth} from "@/app/contexts/AuthContext";
//
// export default function Dashboard() {
//   const { user, logout } = useAuth()
//   const router = useRouter()
//   const [isOnline, setIsOnline] = useState(true)
//   const [notifications, setNotifications] = useState(3)
//
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)
//
//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)
//
//     return () => {
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])
//
//   const handleLogout = () => {
//     logout()
//     router.push("/")
//   }
//
//   const weatherData = {
//     temperature: 28,
//     humidity: 65,
//     rainfall: 12,
//     forecast: "Partly cloudy with chance of rain",
//   }
//
//   const cropData = [
//     { name: "Rice", planted: "2 hectares", status: "Growing", health: 85 },
//     { name: "Yam", planted: "1.5 hectares", status: "Harvesting", health: 92 },
//     { name: "Cassava", planted: "1 hectare", status: "Mature", health: 78 },
//   ]
//
//   const marketPrices = [
//     { crop: "Rice", price: "₦450/kg", change: "+5%", trend: "up" },
//     { crop: "Yam", price: "₦300/kg", change: "-2%", trend: "down" },
//     { crop: "Cassava", price: "₦180/kg", change: "+8%", trend: "up" },
//   ]
//
//   const recentActivities = [
//     { action: "Planted rice seeds", date: "2 days ago", icon: <Leaf className="h-4 w-4" /> },
//     { action: "Applied fertilizer to yam", date: "5 days ago", icon: <Droplets className="h-4 w-4" /> },
//     { action: "Harvested cassava", date: "1 week ago", icon: <TrendingUp className="h-4 w-4" /> },
//   ]
//
//   const alerts = [
//     { message: "Heavy rain expected tomorrow", type: "warning", icon: <CloudRain className="h-4 w-4" /> },
//     { message: "Pest alert for rice crops", type: "danger", icon: <AlertTriangle className="h-4 w-4" /> },
//     { message: "Fertilizer application due", type: "info", icon: <Calendar className="h-4 w-4" /> },
//   ]
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <Leaf className="h-8 w-8 text-green-600" />
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">BFPC Dashboard</h1>
//                 <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
//               </div>
//             </div>
//
//             <div className="flex items-center space-x-4">
//               {/* Connection Status */}
//               <div className="flex items-center space-x-2">
//                 {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
//                 <span className="text-sm text-gray-600">{isOnline ? "Online" : "Offline"}</span>
//               </div>
//
//               {/* Notifications */}
//               <Button variant="ghost" size="sm" className="relative">
//                 <Bell className="h-5 w-5" />
//                 {notifications > 0 && (
//                   <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
//                     {notifications}
//                   </Badge>
//                 )}
//               </Button>
//
//               {/* User Menu */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name} />
//                       <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56" align="end" forceMount>
//                   <DropdownMenuLabel className="font-normal">
//                     <div className="flex flex-col space-y-1">
//                       <p className="text-sm font-medium leading-none">{user?.name}</p>
//                       <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>
//                     <Settings className="mr-2 h-4 w-4" />
//                     <span>Settings</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Log out</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </header>
//
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Alerts */}
//         {alerts.length > 0 && (
//           <div className="mb-8 space-y-2">
//             {alerts.map((alert, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center space-x-3 p-3 rounded-lg ${
//                   alert.type === "warning"
//                     ? "bg-yellow-50 border border-yellow-200"
//                     : alert.type === "danger"
//                       ? "bg-red-50 border border-red-200"
//                       : "bg-blue-50 border border-blue-200"
//                 }`}
//               >
//                 <div
//                   className={`${
//                     alert.type === "warning"
//                       ? "text-yellow-600"
//                       : alert.type === "danger"
//                         ? "text-red-600"
//                         : "text-blue-600"
//                   }`}
//                 >
//                   {alert.icon}
//                 </div>
//                 <span
//                   className={`text-sm font-medium ${
//                     alert.type === "warning"
//                       ? "text-yellow-800"
//                       : alert.type === "danger"
//                         ? "text-red-800"
//                         : "text-blue-800"
//                   }`}
//                 >
//                   {alert.message}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//
//         {/* Main Dashboard Content */}
//         <Tabs defaultValue="overview" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-5">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="crops">My Crops</TabsTrigger>
//             <TabsTrigger value="weather">Weather</TabsTrigger>
//             <TabsTrigger value="market">Market</TabsTrigger>
//             <TabsTrigger value="community">Community</TabsTrigger>
//           </TabsList>
//
//           {/* Overview Tab */}
//           <TabsContent value="overview" className="space-y-6">
//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Farm Area</CardTitle>
//                   <MapPin className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{user?.farmDetails?.farmSize || 0} ha</div>
//                   <p className="text-xs text-muted-foreground">{user?.farmDetails?.location || "Location not set"}</p>
//                 </CardContent>
//               </Card>
//
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
//                   <Leaf className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{user?.farmDetails?.crops?.length || 0}</div>
//                   <p className="text-xs text-muted-foreground">Different crop varieties</p>
//                 </CardContent>
//               </Card>
//
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">This Month Revenue</CardTitle>
//                   <DollarSign className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">₦245,000</div>
//                   <p className="text-xs text-muted-foreground">+12% from last month</p>
//                 </CardContent>
//               </Card>
//
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Farm Health Score</CardTitle>
//                   <BarChart3 className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">85%</div>
//                   <Progress value={85} className="mt-2" />
//                 </CardContent>
//               </Card>
//             </div>
//
//             {/* Weather Widget */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <CloudRain className="h-5 w-5" />
//                   <span>Today's Weather</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="flex items-center space-x-2">
//                     <Thermometer className="h-5 w-5 text-orange-500" />
//                     <div>
//                       <p className="text-sm text-gray-600">Temperature</p>
//                       <p className="text-lg font-semibold">{weatherData.temperature}°C</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Droplets className="h-5 w-5 text-blue-500" />
//                     <div>
//                       <p className="text-sm text-gray-600">Humidity</p>
//                       <p className="text-lg font-semibold">{weatherData.humidity}%</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <CloudRain className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <p className="text-sm text-gray-600">Rainfall</p>
//                       <p className="text-lg font-semibold">{weatherData.rainfall}mm</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Sun className="h-5 w-5 text-yellow-500" />
//                     <div>
//                       <p className="text-sm text-gray-600">Forecast</p>
//                       <p className="text-sm">{weatherData.forecast}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//
//             {/* Recent Activities */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Activities</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {recentActivities.map((activity, index) => (
//                     <div key={index} className="flex items-center space-x-3">
//                       <div className="text-green-600">{activity.icon}</div>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium">{activity.action}</p>
//                         <p className="text-xs text-gray-500">{activity.date}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* Crops Tab */}
//           <TabsContent value="crops" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {cropData.map((crop, index) => (
//                 <Card key={index}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       <span>{crop.name}</span>
//                       <Badge
//                         variant={
//                           crop.status === "Growing" ? "default" : crop.status === "Harvesting" ? "secondary" : "outline"
//                         }
//                       >
//                         {crop.status}
//                       </Badge>
//                     </CardTitle>
//                     <CardDescription>Planted: {crop.planted}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span>Health Score</span>
//                         <span>{crop.health}%</span>
//                       </div>
//                       <Progress value={crop.health} />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//
//           {/* Weather Tab */}
//           <TabsContent value="weather" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>7-Day Weather Forecast</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//                   {[...Array(7)].map((_, index) => (
//                     <div key={index} className="text-center p-4 border rounded-lg">
//                       <p className="text-sm font-medium">
//                         {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
//                           weekday: "short",
//                         })}
//                       </p>
//                       <Sun className="h-8 w-8 text-yellow-500 mx-auto my-2" />
//                       <p className="text-lg font-bold">{28 + Math.floor(Math.random() * 6)}°C</p>
//                       <p className="text-xs text-gray-500">{Math.floor(Math.random() * 30)}% rain</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* Market Tab */}
//           <TabsContent value="market" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Current Market Prices</CardTitle>
//                 <CardDescription>Live prices from local markets</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {marketPrices.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div>
//                         <p className="font-medium">{item.crop}</p>
//                         <p className="text-2xl font-bold text-green-600">{item.price}</p>
//                       </div>
//                       <div className="text-right">
//                         <Badge variant={item.trend === "up" ? "default" : "destructive"}>{item.change}</Badge>
//                         <p className="text-xs text-gray-500 mt-1">vs last week</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//
//           {/* Community Tab */}
//           <TabsContent value="community" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                     <Users className="h-5 w-5" />
//                     <span>Farmer Network</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span>Connected Farmers</span>
//                       <Badge>1,247</Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Local Groups</span>
//                       <Badge>23</Badge>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Active Discussions</span>
//                       <Badge>156</Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                     <MessageSquare className="h-5 w-5" />
//                     <span>Recent Discussions</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm font-medium">Best fertilizer for yam cultivation?</p>
//                       <p className="text-xs text-gray-500">12 replies • 2 hours ago</p>
//                     </div>
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm font-medium">Rice pest control methods</p>
//                       <p className="text-xs text-gray-500">8 replies • 5 hours ago</p>
//                     </div>
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm font-medium">Market prices in Makurdi</p>
//                       <p className="text-xs text-gray-500">15 replies • 1 day ago</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }