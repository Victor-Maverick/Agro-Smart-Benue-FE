"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Camera, User as UserIcon, Mail, Phone, MapPin, Upload } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  mediaUrl: string | null
  roles: string[]
  status: string
}

export default function UserProfile() {
  const { data: session } = useSession()
  const { showToast } = useToast()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/get-profile?email=${session?.user?.email}`
      )
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
        if (data.mediaUrl) {
          setPreviewUrl(data.mediaUrl)
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      showToast('error', 'Error', 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'File Too Large', 'Please select an image under 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Invalid File', 'Please select an image file')
        return
      }

      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      showToast('error', 'No File Selected', 'Please select a photo first')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/upload-photo?email=${session?.user?.email}`,
        {
          method: 'PUT',
          body: formData,
        }
      )

      if (response.ok) {
        showToast('success', 'Success', 'Profile picture updated successfully')
        setSelectedFile(null)
        fetchUserProfile() // Refresh profile data
      } else {
        const error = await response.text()
        showToast('error', 'Upload Failed', error || 'Failed to upload photo')
      }
    } catch (error) {
      console.error("Failed to upload photo:", error)
      showToast('error', 'Error', 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const getInitials = () => {
    if (!userData) return "U"
    return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  if (!userData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600">Unable to load your profile information</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600">Manage your account information and profile picture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-green-100">
                  <AvatarImage src={previewUrl || undefined} alt={userData.firstName} />
                  <AvatarFallback className="text-2xl bg-green-600 text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 w-full space-y-2">
                  <p className="text-sm text-gray-600 text-center truncate">
                    {selectedFile.name}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUploadPhoto}
                      disabled={uploading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(userData.mediaUrl)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                JPG, PNG or GIF (Max 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">First Name</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.firstName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.lastName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Account Status</p>
                  <p className="text-xs text-gray-500 mt-1">Your account verification status</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userData.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {userData.status}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Account Type</p>
                  <p className="text-xs text-gray-500 mt-1">Your role in the platform</p>
                </div>
                <div className="flex gap-2">
                  {userData.roles.map((role) => (
                    <span key={role} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                      {role.toLowerCase().replace('[', '').replace(']', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
