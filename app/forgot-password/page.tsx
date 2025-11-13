"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp" | "password">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.data?.success) {
        setSuccess("Password reset code sent to your email!")
        setStep("otp")
      } else {
        setError(data.data?.message || "Failed to send reset code")
      }
    } catch (error) {
      setError("Failed to send reset code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-password-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const data = await response.json()

      if (response.ok && data.data?.success) {
        setSuccess("OTP verified! Please enter your new password.")
        setStep("password")
      } else {
        setError(data.data?.message || "Invalid OTP. Please try again.")
      }
    } catch (error) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password-with-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp: otp.join(""), 
          newPassword 
        }),
      })

      const data = await response.json()

      if (response.ok && data.data?.success) {
        setSuccess("Password reset successfully! Redirecting to login...")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setError(data.data?.message || "Failed to reset password")
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center text-[#022B23] hover:text-[#034A3A] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>

          <Card className="border-[#022B23]/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#022B23]/10 rounded-full flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-[#022B23]" />
              </div>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                {step === "email" && "Enter your email to receive a reset code"}
                {step === "otp" && "Enter the 6-digit code sent to your email"}
                {step === "password" && "Create a new password for your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Email */}
              {step === "email" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-[#022B23]/30 focus:border-[#022B23]"
                    />
                  </div>

                  <Button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>
                </>
              )}

              {/* Step 2: OTP */}
              {step === "otp" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Enter Reset Code
                    </label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-semibold border-[#022B23]/30 focus:border-[#022B23]"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.some(d => !d)}
                    className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                </>
              )}

              {/* Step 3: New Password */}
              {step === "password" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-[#022B23]/30 focus:border-[#022B23] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-[#022B23]/30 focus:border-[#022B23]"
                    />
                  </div>

                  <Button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-[#022B23]/5 border border-[#022B23]/20 text-[#022B23] px-4 py-3 rounded">
                  {success}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/farmer image.png"
          alt="Benue Farmer"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
