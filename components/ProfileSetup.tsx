"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, User, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileSetupProps {
  onComplete: () => void
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    location: "",
    lga: "",
    state: "Benue",
    farmingExperience: "",
    primaryCrop: "",
    farmSize: "",
    farmingType: "",
  })

  const { toast } = useToast()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.location || !formData.lga || !formData.farmingExperience || !formData.primaryCrop) {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          farmSize: formData.farmSize ? parseFloat(formData.farmSize) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Profile Created!",
          description: "Your farming profile has been set up successfully.",
        })
        onComplete()
      } else {
        throw new Error("Failed to create profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const lgaOptions = [
    "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West",
    "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo",
    "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"
  ]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Help us understand your farming background to provide personalized recommendations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location/Village *</Label>
              <Input
                id="location"
                placeholder="Enter your village/town"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lga">Local Government Area *</Label>
              <Select value={formData.lga} onValueChange={(value) => handleInputChange("lga", value)}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select your LGA" />
                </SelectTrigger>
                <SelectContent>
                  {lgaOptions.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmingExperience">Farming Experience *</Label>
              <Select value={formData.farmingExperience} onValueChange={(value) => handleInputChange("farmingExperience", value)}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                  <SelectItem value="experienced">Experienced (6-10 years)</SelectItem>
                  <SelectItem value="expert">Expert (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryCrop">Primary Crop *</Label>
              <Select value={formData.primaryCrop} onValueChange={(value) => handleInputChange("primaryCrop", value)}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select primary crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="yam">Yam</SelectItem>
                  <SelectItem value="cassava">Cassava</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="soybean">Soybean</SelectItem>
                  <SelectItem value="sesame">Sesame</SelectItem>
                  <SelectItem value="groundnut">Groundnut</SelectItem>
                  <SelectItem value="sweet_potato">Sweet Potato</SelectItem>
                  <SelectItem value="millet">Millet</SelectItem>
                  <SelectItem value="sorghum">Sorghum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (hectares)</Label>
              <Input
                id="farmSize"
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
                value={formData.farmSize}
                onChange={(e) => handleInputChange("farmSize", e.target.value)}
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmingType">Farming Type</Label>
              <Select value={formData.farmingType} onValueChange={(value) => handleInputChange("farmingType", value)}>
                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select farming type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subsistence">Subsistence</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              <span>{loading ? "Setting up profile..." : "Complete Profile Setup"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}