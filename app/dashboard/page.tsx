"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard/overview")
    }
  }, [status, router])

  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return <Loading />
  }

  return <Loading />
}
