// Centralized configuration for API endpoints
// This ensures we always have a fallback and proper error handling

// Determine if we're in production based on the hostname
const isProduction = typeof window !== 'undefined' 
  ? (window.location.hostname === 'agrosmartbenue.com' || 
     window.location.hostname === 'www.agrosmartbenue.com')
  : process.env.NODE_ENV === 'production'

// Get API base URL with proper fallback
const getApiBaseUrl = () => {
  // First, try environment variable (this is set during build)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL
  }
  
  // If in production or hostname is production, use production API
  if (isProduction) {
    return 'https://api.agrosmartbenue.com'
  }
  
  // Otherwise use localhost for development
  return 'http://localhost:8080'
}

export const config = {
  // API Base URL - smart fallback based on environment
  apiBaseUrl: getApiBaseUrl(),
  
  // Frontend URL
  appUrl: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 
    (isProduction ? 'https://agrosmartbenue.com' : 'http://localhost:3000'),
  
  // Weather API
  weatherApiKey: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '84a36ddea24d4e23b61115004250811',
  
  // ReCAPTCHA
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeRVQssAAAAAFFVrXBgCpPNyDPb1SqD1sI4Ywqm',
  
  // Environment info
  isProduction,
} as const

// Helper function to get API URL
export function getApiUrl(endpoint: string): string {
  const baseUrl = config.apiBaseUrl
  
  if (!baseUrl) {
    console.error('API_BASE_URL is not defined!')
    throw new Error('API configuration error: Base URL is missing')
  }
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  return `${baseUrl}${cleanEndpoint}`
}

// Log configuration (always log to help debug production issues)
if (typeof window !== 'undefined') {
  console.log('App Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    appUrl: config.appUrl,
    environment: process.env.NODE_ENV,
    isProduction: config.isProduction,
    hostname: window.location.hostname,
    envVar: process.env.NEXT_PUBLIC_API_BASE_URL,
  })
}
