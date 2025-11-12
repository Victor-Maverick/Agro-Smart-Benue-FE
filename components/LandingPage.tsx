"use client"

import {
  ArrowRight,
  BarChart3,
  Calendar,
  Globe,
  Handshake,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import EnhancedEventsHero from "./EnhancedEventsHero"
import WeatherForecast from "./WeatherForecast"

// Updated hero section with organic shapes - v2.0
export default function BFPCLanding() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  const heroImages = [
    "https://res.cloudinary.com/dgswwi2ye/image/upload/v1760965630/shutterstock_2246506733_editorial-use-only_Elen-Marlen_av2wsz.jpg",
    "https://res.cloudinary.com/dgswwi2ye/image/upload/v1760965630/delicious-dried-fruits-prunes-apricot-selling-rich-harvest-farm-produce-market-rich-harvesting-healthy-eating-fitness-sup-197752703_dsxdr1.jpg",
    "https://res.cloudinary.com/dgswwi2ye/image/upload/v1760965513/Image_fx_1_so6pyz.jpg",
    "https://res.cloudinary.com/dgswwi2ye/image/upload/v1760965493/Image_fx_xtb9lh.jpg",
  ]

  const testimonials = [
    {
      name: "Amina Ibrahim",
      location: "Makurdi, Benue State",
      crop: "Rice Farmer",
      quote: "BFPC helped me increase my rice yield by 40% using their soil analysis and fertilizer recommendations.",
      rating: 5,
    },
    {
      name: "Joseph Terver",
      location: "Gboko, Benue State",
      crop: "Yam Farmer",
      quote: "The market price alerts saved me from selling my yams too early. I made 60% more profit this season!",
      rating: 5,
    },
    {
      name: "Grace Oche",
      location: "Otukpo, Benue State",
      crop: "Cassava Farmer",
      quote: "The weather forecasts are so accurate. I can now plan my farming activities better and avoid losses.",
      rating: 5,
    },
  ]



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[80px]">
            <div className="flex items-center space-x-2">
              <a href="#hero"
                className="flex items-center space-x-2 text-green-800 hover:text-green-900 transition-colors">
                <Image src="/images/header image.png" alt="BFPC Logo" width={64} height={64} />
                <p className="font-bold leading-tight">Benue <span className="text-orange-600">Farmers</span> <br />Peace Corps</p>
              </a>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-green-700 hover:text-green-900 transition-colors">
                Features
              </a>
              <Link href="/market" className="text-green-700 hover:text-green-900 transition-colors">
                Market
              </Link>
              <Link href="/market-prices" className="text-green-700 hover:text-green-900 transition-colors">
                Market Prices
              </Link>
              <a href="#about" className="text-green-700 hover:text-green-900 transition-colors">
                About
              </a>
              <a href="#partnerships" className="text-green-700 hover:text-green-900 transition-colors">
                Partners
              </a>
              <a href="#contact" className="text-green-700 hover:text-green-900 transition-colors">
                Contact
              </a>
            </div>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Organic Shapes */}
      <section
        key="hero-organic-v2"
        id="hero"
        className="relative py-20 lg:py-12 overflow-hidden min-h-screen"
        style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 25%, #ffffff 100%)" }}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-7xl lg:text-7xl font-bold leading-tight">
                  <span className="text-orange-600 block">Viability for Small</span>
                  <span className="text-orange-600 block">and Large Farms,</span>
                  <span className="text-gray-800 block mt-4">Vitality for</span>
                  <span className="text-gray-800 block">Farmers.</span>
                </h1>
              </div>

              <div className="pt-4">
                <Link href="/signup">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Organic Shapes with Images */}
            <div className="relative h-[600px] lg:h-[700px]">
              {/* Main Large Organic Shape */}
              <div className="absolute top-0 right-0 w-[500px] h-[400px] lg:w-[600px] lg:h-[500px]">
                <div
                  className="w-full h-full bg-cover bg-center shadow-2xl transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${heroImages[currentImageIndex]})`,
                    clipPath: "polygon(20% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 85%, 0% 25%)",
                  }}
                ></div>
              </div>

              {/* Top Right Circle */}
              <div className="absolute top-8 right-8 w-32 h-32 lg:w-40 lg:h-40">
                <div
                  className="w-full h-full bg-cover bg-center rounded-full shadow-xl border-4 border-white transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${heroImages[(currentImageIndex + 1) % heroImages.length]})`,
                  }}
                ></div>
              </div>

              {/* Bottom Left Circle */}
              <div className="absolute bottom-32 left-0 w-36 h-36 lg:w-44 lg:h-44">
                <div
                  className="w-full h-full bg-cover bg-center rounded-full shadow-xl border-4 border-white transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${heroImages[(currentImageIndex + 2) % heroImages.length]})`,
                  }}
                ></div>
              </div>

              {/* Small Accent Circle */}
              <div className="absolute top-1/2 left-1/4 w-20 h-20 lg:w-24 lg:h-24">
                <div
                  className="w-full h-full bg-cover bg-center rounded-full shadow-lg border-3 border-white opacity-90 transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${heroImages[(currentImageIndex + 3) % heroImages.length]})`,
                  }}
                ></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-orange-400 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-orange-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Forecast Section */}
      <WeatherForecast />

      {/* Events Hero Section */}
      <EnhancedEventsHero />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">Comprehensive Agricultural Solutions</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              From personalized farming insights to direct market connections, BFPC provides everything farmers need to
              succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle className="text-green-900">Farmer Dashboard</CardTitle>
                <CardDescription className="text-green-600">
                  Personalized dashboard showing farm goals, crops, training recommendations, and buyer leads.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle className="text-green-900">Yield Optimization</CardTitle>
                <CardDescription className="text-green-600">
                  Customized farming tips using local climate data, best practices, and soil analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle className="text-green-900">Market Monitor</CardTitle>
                <CardDescription className="text-green-600">
                  Real-time price trends and demand analysis with alerts on fast-moving crops.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle className="text-green-900">Live Program Feed</CardTitle>
                <CardDescription className="text-green-600">
                  Calendar with reminders for government programs, grants, and agricultural events.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Handshake className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle className="text-green-900">Buyer Marketplace</CardTitle>
                <CardDescription className="text-green-600">
                  Secure buyer-seller connections with verified listings and escrow payments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle className="text-green-900">Community Support</CardTitle>
                <CardDescription className="text-green-600">
                  Farmer groups by LGA for collaboration with multilingual chat support.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-green-900">Our Mission & Vision</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-green-700">
                    <strong>Increase annual crop yields</strong> by disseminating timely farming techniques and best
                    practices.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-green-700">
                    <strong>Connect farmers directly</strong> with verified buyers and processing companies for better
                    market access.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-green-700">
                    <strong>Provide data analytics</strong> to measure how farming practices and events influence yield
                    outcomes.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-green-700">
                    <strong>Empower farmers</strong> through sponsored conference attendance and professional
                    development opportunities.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-900 mb-6">Target Users</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">Smallholder and mid-scale farmers in Benue</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">Agricultural extension officers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">NGOs and government partners</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Handshake className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">Buyers and food processing companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Title and Avatar Stack */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                {/* Avatar Stack */}
                <div className="flex -space-x-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold border-1 border-white shadow-lg">
                    A
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold border-1 border-white shadow-lg">
                    J
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold border-1 border-white shadow-lg">
                    G
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Farmer's Feedback</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  What our happy<br />
                  <span>farmers are saying</span>
                </h2>
              </div>
            </div>

            {/* Right Side - Testimonial Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 min-h-[300px] flex flex-col justify-between transition-all duration-500 transform"
                key={currentTestimonialIndex}>
                <div className="space-y-6">
                  {/* Stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonials[currentTestimonialIndex]?.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    "{testimonials[currentTestimonialIndex]?.quote || ''}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {testimonials[currentTestimonialIndex]?.name || ''}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {testimonials[currentTestimonialIndex]?.crop || ''}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentTestimonialIndex]?.location || ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonialIndex
                      ? "bg-green-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section id="partnerships" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">Trusted Partnerships</h2>
            <p className="text-lg text-green-700 max-w-3xl mx-auto">
              We collaborate with leading organizations to provide comprehensive support to farmers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-green-900 mb-2">Government</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>Federal Ministry of Agriculture</li>
                <li>Benue State Ministry of Agriculture</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-green-900 mb-2">International</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>IFAD</li>
                <li>FAO</li>
                <li>USAID Feed the Future</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-green-900 mb-2">Agribusiness</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>AgroMall</li>
                <li>Thrive Agric</li>
                <li>Hello Tractor</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="font-semibold text-green-900 mb-2">Academic</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>University of Agriculture, Makurdi</li>
                <li>Local cooperatives</li>
                <li>Commodity boards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Farming?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers already benefiting from BFPC's comprehensive agricultural platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-white text-green-600 hover:bg-green-50">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                    <a href="#" className="hover:text-white text-[14px] transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white text-[14px] transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white text-[14px] transition-colors">
                      Mobile App
                    </a>
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
                    <a href="#" className="hover:text-white text-[14px] transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white text-[14px] transition-colors">
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
    </div>
  )
}
