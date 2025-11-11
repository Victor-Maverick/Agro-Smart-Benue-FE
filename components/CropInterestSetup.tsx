"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Wheat, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CropInterestSetupProps {
  onComplete: () => void
}

interface Crop {
  id: number
  name: string
  category: string
  description: string
}

export default function CropInterestSetup({ onComplete }: CropInterestSetupProps) {
  const [loading, setLoading] = useState(false)
  const [crops, setCrops] = useState<Crop[]>([])
  const [selectedCrops, setSelectedCrops] = useState<number[]>([])
  const [loadingCrops, setLoadingCrops] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      const response = await fetch("/api/crops")
      if (response.ok) {
        const data = await response.json()
        setCrops(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch crops:", error)
    } finally {
      setLoadingCrops(false)
    }
  }

  const handleCropToggle = (cropId: number) => {
    setSelectedCrops(prev => 
      prev.includes(cropId) 
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    )
  }

  const handleSubmit = async () => {
    if (selectedCrops.length === 0) {
      toast({
        title: "No Crops Selected",
        description: "Please select at least one crop to get price updates for.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Create crop interests for each selected crop
      const promises = selectedCrops.map(cropId =>
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-crop-interests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            cropId,
            priceAlerts: true,
            marketUpdates: true,
          }),
        })
      )

      await Promise.all(promises)

      toast({
        title: "Crop Interests Set!",
        description: "You'll now receive price updates for your selected crops.",
      })
      onComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set crop interests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cropCategories = crops.reduce((acc, crop) => {
    if (!acc[crop.category]) {
      acc[crop.category] = []
    }
    acc[crop.category].push(crop)
    return acc
  }, {} as Record<string, Crop[]>)

  if (loadingCrops) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2">Loading crops...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Wheat className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Select Your Crop Interests</CardTitle>
          <CardDescription>
            Choose crops you want to receive price updates and market information for
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {Object.entries(cropCategories).map(([category, categorycrops]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg text-green-800 capitalize">
                {category} Crops
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categorycrops.map((crop) => (
                  <div key={crop.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`crop-${crop.id}`}
                      checked={selectedCrops.includes(crop.id)}
                      onCheckedChange={() => handleCropToggle(crop.id)}
                    />
                    <Label
                      htmlFor={`crop-${crop.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {crop.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {crops.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No crops available. Please contact support.</p>
            </div>
          )}

          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading || selectedCrops.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
              <span>{loading ? "Setting up interests..." : `Set Interests (${selectedCrops.length} selected)`}</span>
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-green-600 hover:text-green-700"
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}