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
  login: (email: string, password: string, captchaToken?: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }>
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  googleLogin: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // No longer using localStorage - rely on NextAuth session
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, captchaToken?: string): Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }> => {
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
        
        // Sign in with NextAuth - this will store everything in the session
        await signIn("credentials", {
          email,
          password,
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
      
      // Check if error is due to unverified account
      if (errorMessage.toLowerCase().includes('not verified') || 
          errorMessage.toLowerCase().includes('verify your account') ||
          error.response?.data?.error === 'AccountNotVerified') {
        return { success: false, error: errorMessage, needsVerification: true, email }
      }
      
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

      // Google OAuth would be handled by NextAuth provider
      // For now, this is a placeholder
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      // Get the session to retrieve the access token
      const { getSession, signOut } = await import("next-auth/react")
      const session = await getSession()
      
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
      
      // Clear local state
      setUser(null)
      
      // Clear all localStorage items
      localStorage.removeItem('BFPCAuthToken')
      localStorage.removeItem('userEmail')
      localStorage.clear()
      
      // Clear session storage as well
      sessionStorage.clear()
      
      // Sign out from NextAuth - this clears the session completely
      await signOut({ redirect: false })
      
      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Force page reload to clear all cached data and state
      window.location.href = "/"
    } catch (error) {
      console.error("Error during logout:", error)
      // Even if there's an error, try to clear everything
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = "/"
    }
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
