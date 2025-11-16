import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/contexts/ToastContext"


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "BFPC - Benue Farmers Peace Corps",
  description: "Empowering farmers across Benue State with digital agricultural solutions",
  keywords: ["farming", "agriculture", "Benue", "Nigeria", "crops", "farmers"],
  authors: [{ name: "BFPC Team" }],
  creator: "Benue Farmers Peace Corps",
  publisher: "BFPC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bfpc.ng"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BFPC - Benue Farmers Peace Corps",
    description: "Empowering farmers across Benue State with digital agricultural solutions",
    url: "https://bfpc.ng",
    siteName: "BFPC",
    images: [
      {
        url: "https://res.cloudinary.com/dgswwi2ye/image/upload/v1760965630/shutterstock_2246506733_editorial-use-only_Elen-Marlen_av2wsz.jpg",
        width: 1200,
        height: 630,
        alt: "BFPC - Empowering Farmers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BFPC - Benue Farmers Peace Corps",
    description: "Empowering farmers across Benue State with digital agricultural solutions",
    images: ["https://res.cloudinary.com/dgswwi2ye/image/upload/v1760965630/shutterstock_2246506733_editorial-use-only_Elen-Marlen_av2wsz.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BFPC" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
