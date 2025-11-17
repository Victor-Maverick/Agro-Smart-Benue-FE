"use client"

import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        {/* Animated Logo - Shrinking and Growing */}
        <div className="relative w-24 h-24 animate-pulse-scale">
          <Image
            src="/images/header image.png"
            alt="BFPC Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
