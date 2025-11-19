"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/InputField"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/ToastContext"
import { validateEmail, validateRequired } from "@/lib/validation"
import { signIn } from "next-auth/react"
import farmerImg from './../public/images/farmer image.png';

export default function NewLogin() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const { login } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validate email
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!
    }

    // Validate password
    const passwordValidation = validateRequired(formData.password, 'Password')
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      console.log('[NewLogin] Starting login process...')
      
      // Get session first to check roles after login
      const { getSession } = await import('next-auth/react')
      
      // Sign in with NextAuth - use redirect: true with callbackUrl
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, // We'll handle redirect manually after getting session
      })

      console.log('[NewLogin] NextAuth result:', result)

      if (result?.ok && !result.error) {
        console.log('[NewLogin] Sign in successful, fetching session...')
        
        // Wait a bit for session to be created
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Get the session to determine redirect
        const session = await getSession()
        console.log('[NewLogin] Session retrieved:', session)
        
        if (session?.user) {
          showToast('success', 'Welcome Back!', 'You have been logged in successfully.')
          
          const roles = session.user.roles || []
          const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')
          
          console.log('[NewLogin] User roles:', roles, 'isAdmin:', isAdmin)
          
          // Redirect based on role
          const redirectUrl = isAdmin ? '/admin' : '/dashboard'
          console.log('[NewLogin] Redirecting to:', redirectUrl)
          
          // Use router.replace to avoid back button issues
          router.replace(redirectUrl)
        } else {
          console.error('[NewLogin] Session exists but no user data')
          showToast('error', 'Login Failed', 'Failed to establish session. Please try again.')
        }
      } else {
        console.error('[NewLogin] NextAuth signIn failed:', result)
        showToast('error', 'Login Failed', result?.error || 'Invalid email or password. Please try again.')
      }
    } catch (error: any) {
      console.error('[NewLogin] Login error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message ||
                          'An error occurred during login'
      showToast('error', 'Login Failed', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 lg:hidden mb-6">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-900">BFPC</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your BFPC account</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <InputField
              id="email"
              label="Email Address"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Email Address"
              type="email"
              icon="email"
              error={errors.email}
            />

            <InputField
              id="password"
              label="Password"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Password"
              type="password"
              icon="password"
              error={errors.password}
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px] flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </Button>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Farmer Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute w-full inset-0 bg-gradient-to-bl from-green-600/20 to-orange-600/20"></div>
        <Image
          src={farmerImg}
          alt="Benue Farmer"
          className="w-full"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
    </div>
  )
}