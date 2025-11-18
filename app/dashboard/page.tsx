"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import UserDashboard from "@/components/UserDashboard"
import Loading from "@/components/Loading"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  // Let middleware handle auth redirect - don't redirect here
  // This prevents race conditions in production
  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return <Loading />
  }

  return <UserDashboard />
}
