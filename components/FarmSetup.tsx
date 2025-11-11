"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Tractor, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FarmSetupProps {
  onComplete: () => void
}

export default function FarmSetup({ onComplete }: FarmSetupProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    coordinates: "",
    size: "",
    soilType: "",
    description: "",
  })

  const { toast } = useToast()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.farmName || !formData.location || !formData.size) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/farms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          size: parseFloat(formData.size),
        }),
      })

      if (response.ok) {
        toast({
          title: "Farm Created!",
          description: "Your farm has been set up successfully.",
        })
        onComplete()
      } else {
        throw new Error("Failed to create farm")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create farm. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Tractor className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Set Up Your Farm</CardTitle>
          <CardDescription>
            Add your farm details to start tracking your agricultural activities
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name *</Label>
              <Input
                id="farmName"
                placeholder="e.g., Green Valley Farm"
                value={formData.farmName}
                onChange={(e) => handleInputChange("farmName", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Farm Size (hectares) *</Label>
              <Input
                id="size"
                type="number"
                step="0.1"
                placeholder="e.g., 5.0"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Farm Location *</Label>
            <Input
              id="location"
              placeholder="Enter farm location/address"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coordinates">GPS Coordinates (Optional)</Label>
              <Input
                id="coordinates"
                placeholder="e.g., 7.7319° N, 8.5324° E"
                value={formData.coordinates}
                onChange={(e) => handleInputChange("coordinates", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={formData.soilType} onValueChange={(value) => handleInputChange("soilType", value)}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="silty">Silty</SelectItem>
                  <SelectItem value="peaty">Peaty</SelectItem>
                  <SelectItem value="chalky">Chalky</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Farm Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your farm, crops grown, farming methods, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              rows={3}
            />
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>{loading ? "Creating farm..." : "Create Farm"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}