"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  mediaUrl?: string
  createdAt: string
  roles: string[]
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      } else {
        // If API call fails, use session data
        if (session?.user) {
          setProfile({
            firstName: session.user.firstName || '',
            lastName: session.user.lastName || '',
            email: session.user.email || '',
            mediaUrl: session.user.mediaUrl || undefined,
            createdAt: new Date().toISOString(),
            roles: session.user.roles || ['FARMER']
          })
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Fallback to session data
      if (session?.user) {
        setProfile({
          firstName: session.user.firstName || '',
          lastName: session.user.lastName || '',
          email: session.user.email || '',
          mediaUrl: session.user.mediaUrl || undefined,
          createdAt: new Date().toISOString(),
          roles: session.user.roles || ['FARMER']
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                {profile.mediaUrl ? (
                  <img
                    src={profile.mediaUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center">
                    <User size={40} className="text-green-600" />
                  </div>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-green-100 text-lg">
                  {profile.roles.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Edit size={18} />
                Edit Profile
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <div className="flex gap-2 mt-1">
                      {profile.roles.map((role) => (
                        <span
                          key={role}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Account Status</h3>
              <p className="text-blue-700">
                Your account is active and verified. You have access to all platform features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}