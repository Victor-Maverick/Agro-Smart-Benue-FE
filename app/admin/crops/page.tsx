"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminCropsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/admin?tab=crops")
  }, [router])
  
  return null
}
