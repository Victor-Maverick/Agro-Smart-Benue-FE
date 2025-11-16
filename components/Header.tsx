"use client"

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut, BarChart3, ChevronDown } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-green-800 hover:text-green-900 transition-colors">
            <Image src="/images/header image.png" alt="BFPC Logo" width={64} height={64} />
            <p className="font-bold leading-tight">
              Benue <span className="text-orange-600">Farmers</span> <br />Peace Corps
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/market" className="text-green-700 hover:text-green-900 transition-colors">
              Market
            </Link>
            <Link href="/market-prices" className="text-green-700 hover:text-green-900 transition-colors">
              Market Prices
            </Link>
            <Link href="/crop-tips" className="text-green-700 hover:text-green-900 transition-colors">
              Crop Tips
            </Link>
            <Link href="/events" className="text-green-700 hover:text-green-900 transition-colors">
              Events
            </Link>

            {/* Authentication Section */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-green-700 hover:text-green-900 transition-colors"
                >
                  {session.user?.mediaUrl ? (
                    <img
                      src={session.user.mediaUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <ChevronDown size={16} />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <BarChart3 size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-green-700 hover:text-green-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-green-700 hover:text-green-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-green-100">
              <Link
                href="/market"
                className="block px-3 py-2 text-green-700 hover:text-green-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Market
              </Link>
              <Link
                href="/market-prices"
                className="block px-3 py-2 text-green-700 hover:text-green-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Prices
              </Link>
              <Link
                href="/crop-tips"
                className="block px-3 py-2 text-green-700 hover:text-green-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Crop Tips
              </Link>
              <Link
                href="/events"
                className="block px-3 py-2 text-green-700 hover:text-green-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>

              {/* Mobile Authentication Section */}
              {session ? (
                <div className="border-t border-green-100 pt-3">
                  <div className="flex items-center px-3 py-2">
                    {session.user?.mediaUrl ? (
                      <img
                        src={session.user.mediaUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {session.user?.firstName} {session.user?.lastName}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-green-700 hover:text-green-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-green-700 hover:text-green-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-green-700 hover:text-green-900"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-green-100 pt-3 space-y-1">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-green-700 hover:text-green-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mx-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
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