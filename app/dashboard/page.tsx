"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import UserDashboard from "@/components/UserDashboard"
import Loading from "@/components/Loading"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (status === "loading" || !session) {
    return <Loading />
  }

  return <UserDashboard />
}
