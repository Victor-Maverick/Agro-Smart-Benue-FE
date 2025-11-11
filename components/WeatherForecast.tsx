"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, CloudDrizzle, CloudSnow } from "lucide-react"
import Image from "next/image"

interface WeatherCondition {
  text: string
  icon: string
  code: number
}

interface CurrentWeather {
  last_updated: string
  temp_c: number
  temp_f: number
  is_day: number
  condition: WeatherCondition
  wind_kph: number
  wind_mph: number
  wind_degree: number
  wind_dir: string
  humidity: number
  cloud: number
  feelslike_c: number
}

interface ForecastDay {
  date: string
  date_epoch: number
  day: {
    maxtemp_c: number
    mintemp_c: number
    avgtemp_c: number
    maxwind_kph: number
    totalprecip_mm: number
    avghumidity: number
    daily_chance_of_rain: number
    condition: WeatherCondition
  }
}

interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    localtime: string
  }
  current: CurrentWeather
  forecast: {
    forecastday: ForecastDay[]
  }
}

export default function WeatherForecast() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      setLoading(true)
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || process.env.WEATHER_API_KEY
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Makurdi&days=4&aqi=no`
      )
      
      if (response.ok) {
        const data = await response.json()
        setWeather(data)
        setError(false)
      } else {
        setError(true)
      }
    } catch (err) {
      console.error("Failed to fetch weather:", err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: WeatherCondition, size: string = "h-8 w-8") => {
    const code = condition.code
    const text = condition.text.toLowerCase()
    
    if (text.includes("sunny") || text.includes("clear")) {
      return <Sun className={`${size} text-yellow-500`} />
    }
    if (text.includes("rain") || text.includes("drizzle")) {
      return <CloudRain className={`${size} text-blue-600`} />
    }
    if (text.includes("snow") || text.includes("sleet")) {
      return <CloudSnow className={`${size} text-blue-300`} />
    }
    if (text.includes("fog") || text.includes("mist")) {
      return <Cloud className={`${size} text-gray-500`} />
    }
    if (text.includes("cloud") || text.includes("overcast")) {
      return <Cloud className={`${size} text-gray-400`} />
    }
    return <Cloud className={`${size} text-gray-400`} />
  }

  const formatDate = (dateString: string, index: number) => {
    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return null
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Weather Forecast for {weather.location.name}, {weather.location.region}
          </h2>
          <p className="text-lg text-gray-600">
            Plan your farming activities with accurate weather information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Current Weather - Larger Card */}
          <Card className="lg:col-span-1 border-blue-200 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                {weather.current.condition.icon ? (
                  <Image
                    src={`https:${weather.current.condition.icon}`}
                    alt={weather.current.condition.text}
                    width={80}
                    height={80}
                    className="drop-shadow-lg"
                  />
                ) : (
                  getWeatherIcon(weather.current.condition, "h-16 w-16")
                )}
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">
                  {Math.round(weather.current.temp_c)}°C
                </p>
                <p className="text-blue-100 text-lg">
                  {weather.current.condition.text}
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  Feels like {Math.round(weather.current.feelslike_c)}°C
                </p>
              </div>
              <div className="space-y-2 pt-4 border-t border-blue-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm">Wind</span>
                  </div>
                  <span className="font-semibold">{Math.round(weather.current.wind_kph)} km/h {weather.current.wind_dir}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="font-semibold">{weather.current.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    <span className="text-sm">Cloud Cover</span>
                  </div>
                  <span className="font-semibold">{weather.current.cloud}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next 3 Days Forecast */}
          {weather.forecast?.forecastday?.slice(1, 4).map((day, index) => {
            if (!day?.day) return null
            
            return (
              <Card key={day.date} className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    {formatDate(day.date, index + 1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center">
                    {day.day.condition?.icon ? (
                      <Image
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text || "Weather"}
                        width={64}
                        height={64}
                        className="drop-shadow-md"
                      />
                    ) : (
                      getWeatherIcon(day.day.condition || { text: "Cloudy", icon: "", code: 1003 }, "h-12 w-12")
                    )}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {Math.round(day.day.maxtemp_c || 0)}°
                      </span>
                      <span className="text-xl text-gray-500">
                        {Math.round(day.day.mintemp_c || 0)}°
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {day.day.condition?.text || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CloudRain className="h-4 w-4" />
                        <span>Rain</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {Math.round(day.day.totalprecip_mm || 0)} mm ({day.day.daily_chance_of_rain || 0}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Droplets className="h-4 w-4" />
                        <span>Humidity</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {day.day.avghumidity || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Farming Tips Based on Weather */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                  <Sun className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Farming Tip for Today
                </h3>
                <p className="text-gray-700">
                  {weather.current.temp_c > 30
                    ? "High temperatures expected. Ensure adequate irrigation for your crops and provide shade for livestock."
                    : weather.forecast.forecastday[0].day.totalprecip_mm > 5
                    ? "Rain expected today. Good time for planting but avoid harvesting. Ensure proper drainage in your fields."
                    : weather.current.wind_kph > 20
                    ? "Strong winds expected. Secure loose items and check crop support structures."
                    : "Good weather conditions for farming activities. Perfect time for planting, weeding, or harvesting."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Weather data provided by{" "}
            <a
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              WeatherAPI.com
            </a>
            {" "}• Last updated: {new Date(weather.current.last_updated).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
