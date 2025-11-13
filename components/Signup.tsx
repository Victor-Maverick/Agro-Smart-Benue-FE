"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/InputField"
import { Checkbox } from "@/components/ui/checkbox"
import { Leaf, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ReCAPTCHA from "react-google-recaptcha"
import { useAuth } from "../app/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useToast } from "@/contexts/ToastContext"
import { validateEmail, validatePhone, validatePassword, validateName, validateConfirmPassword } from "@/lib/validation"

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [captchaToken, setCaptchaToken] = useState("")

  const { signup } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validate first name
    const firstNameValidation = validateName(formData.firstName, 'First name')
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error!
    }

    // Validate last name
    const lastNameValidation = validateName(formData.lastName, 'Last name')
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error!
    }

    // Validate email
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!
    }

    // Validate phone
    const phoneValidation = validatePhone(formData.phone)
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error!
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!
    }

    // Validate confirm password
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword)
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error!
    }

    // Validate terms
    if (!formData.terms) {
      showToast('error', 'Terms Required', 'Please accept the terms and conditions.')
      return false
    }

    // Validate captcha
    if (!captchaToken) {
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
      const result = await signup({ ...formData, captchaToken })
      if (result.success) {
        showToast('success', 'Account Created!', 'Please check your email for verification code.')
        // Redirect to verification page with email
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      } else {
        showToast('error', 'Signup Failed', result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      showToast('error', 'Error', 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Farmer Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/farmer image.png"
          alt="Benue Farmer"
          fill
          className="object-cover"
          priority
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center top'
          }}
        />
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 lg:hidden mb-6">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-900">BFPC</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join BFPC and start your farming journey today</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(value) => handleInputChange("firstName", value)}
                placeholder="First Name"
                error={errors.firstName}
              />
              <InputField
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(value) => handleInputChange("lastName", value)}
                placeholder="Last Name"
                error={errors.lastName}
              />
            </div>

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
              id="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              placeholder="Phone Number"
              type="tel"
              icon="phone"
              error={errors.phone}
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

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange("confirmPassword", value)}
              placeholder="Confirm Password"
              type="password"
              icon="password"
              error={errors.confirmPassword}
            />

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => handleInputChange("terms", checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* reCAPTCHA */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex justify-start">
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
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}