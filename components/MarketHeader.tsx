"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function MarketHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 text-green-800 hover:text-green-900 transition-colors">
              <Image src="/images/header image.png" alt="BFPC Logo" width={64} height={64} />
              <p className="font-bold leading-tight">
                Benue <span className="text-orange-600">Farmers</span> <br />Peace Corps
              </p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/#features" className="text-green-700 hover:text-green-900 transition-colors">
              Features
            </Link>
            <Link href="/market" className="text-green-700 hover:text-green-900 font-semibold transition-colors">
              Market
            </Link>
            <Link href="/market-prices" className="text-green-700 hover:text-green-900 transition-colors">
              Market Prices
            </Link>
            <Link href="/#about" className="text-green-700 hover:text-green-900 transition-colors">
              About
            </Link>
            <Link href="/login" className="text-green-700 hover:text-green-900 transition-colors">
              Login
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link href="/login">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-md text-green-700 hover:bg-green-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-green-100">
            <Link
              href="/#features"
              className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/market"
              className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded-md font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Market
            </Link>
            <Link
              href="/market-prices"
              className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Market Prices
            </Link>
            <Link
              href="/#about"
              className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/login"
              className="block px-4 py-2 text-green-700 hover:bg-green-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <div className="px-4 space-y-2">
              <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
