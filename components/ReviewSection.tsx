"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Sparkles } from 'lucide-react'

export default function ReviewSection() {
  const { data: session } = useSession()
  const [hasReviewed, setHasReviewed] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingReview, setCheckingReview] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      checkExistingReview()
    } else {
      setCheckingReview(false)
    }
  }, [session])

  const checkExistingReview = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/check-existing?email=${session?.user?.email}`
      )
      const exists = await res.json()
      setHasReviewed(exists)
    } catch (error) {
      console.error('Error checking review:', error)
    } finally {
      setCheckingReview(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      alert('You must be logged in to submit a review')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/create?email=${session.user.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating,
            comment
          })
        }
      )

      if (res.ok) {
        alert('Thank you for your review!')
        setHasReviewed(true)
        setRating(0)
        setComment('')
      } else {
        const error = await res.text()
        alert(error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Don't show if not logged in or already reviewed
  if (!session || hasReviewed || checkingReview) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-green-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-50 to-orange-50 px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-center text-gray-600 text-sm">
                Help us improve by sharing your thoughts
              </p>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-all duration-200 hover:scale-125"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                            : 'text-gray-300'
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs text-green-600 mt-2 font-medium">
                    {rating === 5 ? '⭐ Excellent!' : rating === 4 ? '👍 Great!' : rating === 3 ? '😊 Good' : rating === 2 ? '😐 Fair' : '😕 Needs improvement'}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-sm"
                  rows={3}
                  placeholder="What did you like? What could be better?"
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
