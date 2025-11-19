"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/InputField"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "../app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/ToastContext"
import { validateEmail, validateRequired } from "@/lib/validation"
import { signIn } from "next-auth/react"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [captchaToken, setCaptchaToken] = useState("")

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

    // Validate captcha only if the captcha widget is shown
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken) {
      showToast('error', 'Captcha Required', 'Please complete the captcha challenge.')
      return false
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token || "")
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      console.log('[Login] Starting login process...')
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('[Login] NextAuth result:', result)

      if (result?.error) {
        console.error('[Login] Login error:', result.error)
        showToast('error', 'Login Failed', result.error)
      } else if (result?.ok) {
        console.log('[Login] Sign in successful, fetching session...')
        
        // Fetch session via API endpoint (more reliable than getSession)
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        console.log('[Login] Session retrieved:', session)
        
        if (session?.user) {
          showToast('success', 'Welcome Back!', 'You have been logged in successfully.')
          
          const roles = session.user.roles || []
          const isAdmin = roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')
          
          console.log('[Login] User roles:', roles, 'isAdmin:', isAdmin)
          
          // Small delay to ensure toast is visible
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Redirect based on role
          if (isAdmin) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        } else {
          console.error('[Login] No user data in session')
          showToast('error', 'Login Failed', 'Failed to establish session. Please try again.')
        }
      }
    } catch (error: any) {
      console.error('[Login] Login error:', error)
      const errorMessage = error.message || 'An error occurred during login'
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

            {/* reCAPTCHA */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px] flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
              <span>{loading ? "Signing In..." : "Sign In"}</span>
            </Button>

            {/* Additional Links */}
            <div className="space-y-3">
              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Email not verified?{" "}
                  <Link href="/verify-email" className="text-green-600 hover:text-green-700 font-semibold">
                    Verify Now
                  </Link>
                </p>
              </div>

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
      </div>

      {/* Right Side - Farmer Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/farmer image.png"
          alt="Benue Farmer"
          fill
          className="object-cover"
          priority
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center 30%'
          }}
        />
      </div>
    </div>
  )
}