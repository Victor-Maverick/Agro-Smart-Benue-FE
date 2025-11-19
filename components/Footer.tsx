"use client"

import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#001E18] text-white pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* First column with logo and description - takes up more space */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/images/header image.png" alt="BFPC Logo" width={64} height={64} />
              <span className="text-xl font-bold">BFPC</span>
            </div>
            <p className="text-[#c6eb5f]">
              Empowering farmers across Benue State<br /> with digital agricultural solutions.
            </p>
          </div>

          {/* Group the three columns closer together on the right side */}
          <div className="md:col-span-7 md:ml-8 grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-4 text-[#c6eb5f]">Platform</h3>
              <ul className="space-y-2 text-green-200">
                <li>
                  <Link href="/market" className="hover:text-white text-[14px] transition-colors">
                    Market
                  </Link>
                </li>
                <li>
                  <Link href="/market-prices" className="hover:text-white text-[14px] transition-colors">
                    Market Prices
                  </Link>
                </li>
                <li>
                  <Link href="/crop-tips" className="hover:text-white text-[14px] transition-colors">
                    Crop Tips
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-white text-[14px] transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#c6eb5f] mb-4">Support</h3>
              <ul className="space-y-2 text-green-200">
                <li>
                  <a href="#" className="hover:text-white text-[14px] transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white text-[14px] transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white text-[14px] transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#c6eb5f] mb-4">Company</h3>
              <ul className="space-y-2 text-green-200">
                <li>
                  <a href="/#about" className="hover:text-white text-[14px] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/#partnerships" className="hover:text-white text-[14px] transition-colors">
                    Partnerships
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white text-[14px] transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-green-800 text-[12px] mt-28 pt-3 text-center text-green-200">
          <p>&copy; 2024 Benue Farmers Peace Corps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
