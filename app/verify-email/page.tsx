"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  
  const [email, setEmail] = useState(emailParam)
  const [showEmailInput, setShowEmailInput] = useState(!emailParam)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSendVerificationOTP = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setSendingOtp(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/send-verification-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.data?.success) {
        setSuccess("Verification code sent to your email!")
        setShowEmailInput(false)
      } else {
        setError(data.data?.message || "Failed to send verification code")
      }
    } catch (error) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    
    const nextEmptyIndex = newOtp.findIndex(val => !val)
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const data = await response.json()

      if (response.ok && data.data?.success) {
        setSuccess("Email verified successfully! Redirecting to login...")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setError(data.data?.message || "Invalid OTP. Please try again.")
      }
    } catch (error) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.data?.success) {
        setSuccess("OTP sent successfully! Check your email.")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      } else {
        setError(data.data?.message || "Failed to resend OTP")
      }
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Link href="/signup" className="inline-flex items-center text-[#022B23] hover:text-[#034A3A] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign Up
          </Link>

          <Card className="border-[#022B23]/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#022B23]/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-[#022B23]" />
              </div>
              <CardTitle className="text-2xl">Verify Your Email</CardTitle>
              <CardDescription>
                {showEmailInput 
                  ? "Enter your email to receive a verification code"
                  : <>We've sent a 6-digit code to<br /><strong className="text-gray-900">{email}</strong></>
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Input (if coming from login) */}
              {showEmailInput && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !sendingOtp) {
                          handleSendVerificationOTP()
                        }
                      }}
                      className="border-[#022B23]/30 focus:border-[#022B23]"
                    />
                  </div>

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

                  <Button
                    onClick={handleSendVerificationOTP}
                    disabled={sendingOtp || !email}
                    className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px]"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                </>
              )}

              {/* OTP Input */}
              {!showEmailInput && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Enter Verification Code
                    </label>
                    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-semibold border-[#022B23]/30 focus:border-[#022B23]"
                        />
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <button
                        onClick={() => {
                          setShowEmailInput(true)
                          setOtp(["", "", "", "", "", ""])
                          setError("")
                          setSuccess("")
                        }}
                        className="text-sm text-gray-600 hover:text-[#022B23]"
                      >
                        Change email address
                      </button>
                    </div>
                  </div>

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

                  {/* Verify Button */}
                  <Button
                    onClick={handleVerify}
                    disabled={loading || otp.some(d => !d)}
                    className="w-full h-[58px] bg-[#022B23] hover:bg-[#034A3A] text-white font-semibold rounded-[14px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Email"
                    )}
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Didn't receive the code?
                    </p>
                    <Button
                      variant="link"
                      onClick={handleResend}
                      disabled={resending}
                      className="text-[#022B23] hover:text-[#034A3A]"
                    >
                      {resending ? "Sending..." : "Resend Code"}
                    </Button>
                  </div>
                </>
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
