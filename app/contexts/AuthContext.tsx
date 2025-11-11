"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import axios from "axios"

interface User {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  farmDetails: {
    farmSize: string
    location: string
    crops: string[]
    experience: string
    soilType: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, captchaToken?: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  googleLogin: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("bfpc_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("bfpc_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, captchaToken?: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

      // Call backend login endpoint
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
        captchaToken
      })

      console.log('Login response:', response.data) // Debug log

      if (response.data && response.data.status) {
        const userData = response.data.data
        
        const user: User = {
          id: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone,
          avatar: userData.mediaUrl,
          farmDetails: {
            farmSize: "0",
            location: "",
            crops: [],
            experience: "0 years",
            soilType: "Unknown",
          },
        }

        setUser(user)
        localStorage.setItem("bfpc_user", JSON.stringify(user))

        // Sign in with NextAuth
        await signIn("credentials", {
          email,
          token: userData.token,
          redirect: false
        })

        setLoading(false)
        return { success: true }
      }
      
      setLoading(false)
      return { success: false, error: response.data?.message || 'Login failed' }
    } catch (error: any) {
      console.error("Login error:", error)
      setLoading(false)
      
      // Extract error message from backend response
      // For login errors, backend returns ErrorResponse with message field
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'An error occurred during login'
      
      return { success: false, error: errorMessage }
    }
  }

  const signup = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

      // Call backend signup endpoint
      const response = await axios.post(`${API_URL}/api/users/register`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        captchaToken: userData.captchaToken
      })

      console.log('Signup response:', response.data) // Debug log

      if (response.data && response.data.message) {
        // Registration successful - user will need to verify email
        setLoading(false)
        return { success: true }
      }
      
      setLoading(false)
      return { success: false, error: 'Registration failed' }
    } catch (error: any) {
      console.error("Signup error:", error)
      setLoading(false)
      
      // Extract error message from backend response
      // For signup errors, backend returns string message directly
      const errorMessage = typeof error.response?.data === 'string' 
                          ? error.response.data 
                          : error.response?.data?.message || 
                            'An error occurred during registration'
      
      return { success: false, error: errorMessage }
    }
  }

  const googleLogin = async (): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const googleUser: User = {
        id: "google_" + Date.now(),
        name: "Google User",
        email: "user@gmail.com",
        farmDetails: {
          farmSize: "3.0",
          location: "Benue State",
          crops: ["Rice", "Yam"],
          experience: "5 years",
          soilType: "Clay",
        },
      }

      setUser(googleUser)
      localStorage.setItem("bfpc_user", JSON.stringify(googleUser))
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("bfpc_user")
    
    // Sign out from NextAuth
    const { signOut } = await import("next-auth/react")
    await signOut({ redirect: false })
    
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
