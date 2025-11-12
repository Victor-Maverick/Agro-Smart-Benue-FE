"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import SlidingMarketPrices from "./SlidingMarketPrices"

interface Event {
  id: number
  title: string
  description: string
  eventDate: string
  location: string
  organizer: string
  eventType: string
  imageUrl?: string
}

interface MarketPrice {
  id: number
  crop: {
    name: string
  }
  price: number
  unit: string
  market: string
  priceDate: string
}

export default function EnhancedEventsHero() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prevIndex) => 
          prevIndex === events.length - 1 ? 0 : prevIndex + 1
        )
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [events.length])

  const fetchData = async () => {
    try {
      // Fetch ALL events from database
      const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/upcoming`)
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "workshop":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "seminar":
        return "bg-green-100 text-green-800 border-green-200"
      case "conference":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "training":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case "rising":
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "falling":
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <span className="text-gray-500">—</span>
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const currentEvent = events[currentEventIndex]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
            Agricultural Events & Market Updates
          </h2>
          <p className="text-lg text-green-700 max-w-3xl mx-auto">
            Stay informed with upcoming events and real-time market prices for your crops.
          </p>
        </div>

        {/* Market Prices Section - Display First */}
        <div className="mb-12">
          <SlidingMarketPrices />
        </div>

        {/* Events Section - Display Below Market Prices */}
        <div className="w-full">
          {events.length > 0 && currentEvent ? (
            <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
              <div className="bg-gradient-to-r from-green-600 to-green-800 relative">
                <div className="absolute inset-0">
                  {currentEvent.imageUrl && (
                    <img
                      src={currentEvent.imageUrl}
                      alt={currentEvent.title}
                      className="w-full h-full object-cover opacity-20"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                <div className="relative z-10 px-8 py-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Badge className={`${getEventTypeColor(currentEvent.eventType)} bg-white/90`}>
                        {currentEvent.eventType}
                      </Badge>
                      <Badge className="bg-orange-500 text-white">
                        Featured Event
                      </Badge>
                    </div>

                    <h3 className="text-3xl font-bold text-white leading-tight">
                      {currentEvent.title}
                    </h3>

                    <p className="text-lg text-white/90 leading-relaxed">
                      {currentEvent.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{formatDate(currentEvent.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span className="truncate">{currentEvent.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Link href="/events">
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                        >
                          View All Events
                          <ExternalLink className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Navigation Dots */}
              {events.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentEventIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentEventIndex 
                          ? "bg-white scale-110" 
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card className="border-green-200">
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h3>
                <p className="text-gray-600">Check back soon for new agricultural events and training programs.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* All Event Cards */}
        {events.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {events.map((event, index) => (
              <Card
                key={event.id}
                className={`border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  index === currentEventIndex ? "ring-2 ring-green-500 ring-offset-2" : ""
                }`}
                onClick={() => setCurrentEventIndex(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getEventTypeColor(event.eventType)}>
                      {event.eventType}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {formatDate(event.eventDate)}
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}