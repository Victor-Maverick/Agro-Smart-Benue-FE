"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "../app/contexts/AuthContext"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/header image.png" alt="BFPC Logo" width={64} height={64} className="object-contain"/>
            <p className="font-bold leading-tight text-green-800">Benue <span className="text-orange-600">Farmers</span> <br />Peace Corps</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </a>
            <Link href="/events" className="text-gray-700 hover:text-green-600 transition-colors">
              Events
            </Link>
            <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </a>

            {user ? (
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Join BFPC</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-green-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-100">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
                About
              </a>
              <Link href="/events" className="text-gray-700 hover:text-green-600 transition-colors">
                Events
              </Link>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </a>

              {user ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Dashboard</Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Join BFPC</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
