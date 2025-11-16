"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star } from 'lucide-react'

export default function ReviewSection() {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      checkExistingReview()
    }
  }, [session])

  const checkExistingReview = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/check-existing?email=${session?.user?.email}`
      )
      const exists = await res.json()
      setHasReviewed(exists)
      setShowForm(!exists)
    } catch (error) {
      console.error('Error checking review:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/create?email=${session?.user?.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
          },
          body: JSON.stringify({
            rating,
            comment
          })
        }
      )

      if (res.ok) {
        alert('Thank you for your review!')
        setShowForm(false)
        setHasReviewed(true)
        setRating(0)
        setComment('')
      } else {
        const error = await res.text()
        alert(error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (!session || hasReviewed) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Leave Us a Review</h2>
          <p className="text-gray-600 text-center mb-6">
            We'd love to hear about your experience with our platform
          </p>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Rating
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    You rated {rating} out of 5 stars
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about your experience..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
