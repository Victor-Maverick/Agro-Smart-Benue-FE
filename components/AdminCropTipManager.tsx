"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Eye, Edit, Trash2, X } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"
import ConfirmationModal from "@/components/ConfirmationModal"
import Image from "next/image"

interface CropTip {
  id: number
  title: string
  description: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminCropTipManager() {
  const [cropTips, setCropTips] = useState<CropTip[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [viewingTip, setViewingTip] = useState<CropTip | null>(null)
  const [editingTip, setEditingTip] = useState<CropTip | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [] as File[],
    existingImages: [] as string[]
  })
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    tipId?: number;
  }>({
    isOpen: false
  })

  const { showToast } = useToast()

  const isFormValid = formData.title.trim() !== '' && formData.description.trim() !== ''

  useEffect(() => {
    fetchCropTips()
  }, [])

  const fetchCropTips = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips/all`)
      const data = await res.json()
      console.log("Tips ",data)
      console.log("Tips ",data.data)
      if (data.status==true) {
        setCropTips(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching crop tips:', error)
      showToast('error', 'Error', 'Failed to load crop tips')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid || submitting) return

    setSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    
    // Add new images
    formData.images.forEach((image) => {
      formDataToSend.append('images', image)
    })

    // Add existing images if editing
    if (editingTip) {
      formData.existingImages.forEach((url) => {
        formDataToSend.append('existingImageUrls', url)
      })
    }

    try {
      const url = editingTip 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips/${editingTip.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips`
      
      const res = await fetch(url, {
        method: editingTip ? 'PUT' : 'POST',
        body: formDataToSend
      })

      if (res.ok) {
        showToast('success', editingTip ? 'Crop Tip Updated' : 'Crop Tip Created', 
          `Crop tip has been ${editingTip ? 'updated' : 'created'} successfully`)
        setShowForm(false)
        setEditingTip(null)
        setFormData({ title: '', description: '', images: [], existingImages: [] })
        fetchCropTips()
      } else {
        showToast('error', 'Error', 'Failed to save crop tip')
      }
    } catch (error) {
      console.error('Error saving crop tip:', error)
      showToast('error', 'Error', 'Failed to save crop tip')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (tip: CropTip) => {
    setEditingTip(tip)
    setFormData({
      title: tip.title,
      description: tip.description,
      images: [],
      existingImages: tip.imageUrls || []
    })
    setShowForm(true)
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/crop-tips/${confirmModal.tipId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        showToast('success', 'Crop Tip Deleted', 'Crop tip has been deleted successfully')
        fetchCropTips()
      } else {
        showToast('error', 'Error', 'Failed to delete crop tip')
      }
    } catch (error) {
      console.error('Error deleting crop tip:', error)
      showToast('error', 'Error', 'Failed to delete crop tip')
    } finally {
      setConfirmModal({ isOpen: false })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) })
    }
  }

  const removeExistingImage = (url: string) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter(img => img !== url)
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading crop tips...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crop Tips Management</h2>
          <p className="text-gray-600">Manage agricultural tips and best practices</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setShowForm(true)
              setEditingTip(null)
              setFormData({ title: '', description: '', images: [], existingImages: [] })
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Add New Crop Tip
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-green-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingTip ? 'Edit Crop Tip' : 'Add New Crop Tip'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              
              {/* Existing Images */}
              {editingTip && formData.existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                  <div className="flex gap-2 flex-wrap">
                    {formData.existingImages.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt="Crop tip" className="w-20 h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(url)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingTip ? 'Add More Images' : 'Images (Multiple)'}
                </label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can select multiple images at once. Hold Ctrl/Cmd to select multiple files.
                </p>
                {formData.images.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {formData.images.length} new image(s) selected
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingTip(null)
                    setFormData({ title: '', description: '', images: [], existingImages: [] })
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className={`${isFormValid && !submitting ? 'bg-green-600 hover:bg-green-700' : ''} min-w-[120px]`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {editingTip ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingTip ? 'Update' : 'Create'} Crop Tip</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Crop Tips Table */}
      <Card className="border-green-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cropTips.length > 0 ? (
                  cropTips.map((tip) => (
                    <TableRow key={tip.id}>
                      <TableCell className="font-medium">{tip.title}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{tip.description}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {tip.imageUrls && tip.imageUrls.slice(0, 3).map((url, idx) => (
                            <img key={idx} src={url} alt={tip.title} className="w-10 h-10 object-cover rounded" />
                          ))}
                          {tip.imageUrls && tip.imageUrls.length > 3 && (
                            <span className="text-xs text-gray-500">+{tip.imageUrls.length - 3}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(tip.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingTip(tip)}
                            className="px-3"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(tip)}
                            className="px-3"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmModal({ isOpen: true, tipId: tip.id })}
                            className="border-red-300 text-red-600 hover:bg-red-50 px-3"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">No crop tips found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewingTip} onOpenChange={() => setViewingTip(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingTip?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-700 whitespace-pre-wrap">{viewingTip?.description}</p>
            {viewingTip?.imageUrls && viewingTip.imageUrls.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Images ({viewingTip.imageUrls.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingTip.imageUrls.map((url, idx) => (
                    <img 
                      key={idx} 
                      src={url} 
                      alt={`${viewingTip.title} - Image ${idx + 1}`} 
                      className="w-full h-64 object-cover rounded-lg border border-gray-200" 
                    />
                  ))}
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Created: {viewingTip && formatDate(viewingTip.createdAt)}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDelete}
        title="Sure you want to delete?"
        message="Be sure you want to delete this crop tip as this action cannot be undone"
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  )
}
