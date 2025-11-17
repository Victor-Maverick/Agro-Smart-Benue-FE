"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPricesPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/admin?tab=prices")
  }, [router])
  
  return null
}
