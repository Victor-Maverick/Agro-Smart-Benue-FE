"use client"

import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center space-y-4">
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
        
        {/* Loading Text with Animated Ellipses Dropping One After Another */}
        <div className="flex items-center space-x-1">
          <span className="text-lg font-medium text-gray-700">Loading</span>
          <div className="flex space-x-1">
            <span className="animate-dot-1 text-lg font-medium text-gray-700">.</span>
            <span className="animate-dot-2 text-lg font-medium text-gray-700">.</span>
            <span className="animate-dot-3 text-lg font-medium text-gray-700">.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
