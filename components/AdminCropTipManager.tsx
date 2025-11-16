"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CropTip {
  id: number
  title: string
  description: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminCropTipManager() {
  const { data: session } = useSession()
  const [cropTips, setCropTips] = useState<CropTip[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTip, setEditingTip] = useState<CropTip | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as File[]
  })

  useEffect(() => {
    fetchCropTips()
  }, [])

  const fetchCropTips = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crop-tips/all`)
      const data = await res.json()
      if (data.successful) {
        setCropTips(data.data)
      }
    } catch (error) {
      console.error('Error fetching crop tips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formData.images.forEach((image) => {
      formDataToSend.append('images', image)
    })

    try {
      const url = editingTip 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/crop-tips/${editingTip.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/crop-tips`
      
      const res = await fetch(url, {
        method: editingTip ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: formDataToSend
      })

      if (res.ok) {
        alert(editingTip ? 'Crop tip updated successfully' : 'Crop tip created successfully')
        setShowForm(false)
        setEditingTip(null)
        setFormData({ title: '', description: '', images: [] })
        fetchCropTips()
      }
    } catch (error) {
      console.error('Error saving crop tip:', error)
      alert('Failed to save crop tip')
    }
  }

  const handleEdit = (tip: CropTip) => {
    setEditingTip(tip)
    setFormData({
      title: tip.title,
      description: tip.description,
      images: []
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this crop tip?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crop-tips/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })

      if (res.ok) {
        alert('Crop tip deleted successfully')
        fetchCropTips()
      }
    } catch (error) {
      console.error('Error deleting crop tip:', error)
      alert('Failed to delete crop tip')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) })
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Crop Tips Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingTip(null)
            setFormData({ title: '', description: '', images: [] })
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancel' : 'Add New Crop Tip'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {editingTip ? 'Update' : 'Create'} Crop Tip
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {cropTips.map((tip) => (
          <div key={tip.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                <p className="text-gray-600 mb-2">{tip.description}</p>
                {tip.imageUrls && tip.imageUrls.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {tip.imageUrls.map((url, idx) => (
                      <img key={idx} src={url} alt={tip.title} className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Created: {new Date(tip.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tip)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tip.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
