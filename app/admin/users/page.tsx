"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminUsersPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push("/admin?tab=users")
  }, [router])
  
  return null
}
