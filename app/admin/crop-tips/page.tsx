"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminCropTipsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/admin?tab=crop-tips")
  }, [router])
  
  return null
}
