"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminEventsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/admin?tab=events")
  }, [router])
  
  return null
}
