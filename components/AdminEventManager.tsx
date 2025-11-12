"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Calendar, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"

interface Event {
  id: number
  title: string
  description: string
  eventDate: string
  endDate?: string
  location: string
  organizer: string
  eventType: string
  targetAudience: string
  imageUrl?: string
  registrationUrl?: string
  meetingLink?: string
  isActive: boolean
}

export default function AdminEventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    endDate: "",
    location: "",
    organizer: "",
    eventMode: "PHYSICAL",
    eventType: "",
    targetAudience: "",
    imageUrl: "",
    meetingLink: "",
    maxParticipants: "",
    isUnlimited: true,
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const { showToast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/all`)
      
      if (response.ok) {
        const data = await response.json()
        setEvents(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      eventDate: "",
      endDate: "",
      location: "",
      organizer: "",
      eventMode: "PHYSICAL",
      eventType: "",
      targetAudience: "",
      imageUrl: "",
      meetingLink: "",
      maxParticipants: "",
      isUnlimited: true,
    })
    setEditingEvent(null)
    setSelectedImage(null)
    setImagePreview("")
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.eventDate || !formData.location) {
      showToast('error', 'Missing Information', 'Please fill in all required fields.')
      return
    }

    // Validate meeting link for virtual/hybrid events
    if ((formData.eventMode === "VIRTUAL" || formData.eventMode === "HYBRID") && !formData.meetingLink) {
      showToast('error', 'Missing Meeting Link', 'Meeting link is required for virtual and hybrid events.')
      return
    }

    setSubmitting(true)
    try {
      const url = editingEvent 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${editingEvent.id}` 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`
      const method = editingEvent ? "PUT" : "POST"

      // Create FormData for multipart upload
      const formDataToSend = new FormData()
      
      // Add all form fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('eventDate', new Date(formData.eventDate).toISOString())
      if (formData.endDate) {
        formDataToSend.append('endDate', new Date(formData.endDate).toISOString())
      }
      formDataToSend.append('location', formData.location)
      formDataToSend.append('organizer', formData.organizer)
      formDataToSend.append('eventMode', formData.eventMode)
      formDataToSend.append('eventType', formData.eventType)
      formDataToSend.append('targetAudience', formData.targetAudience)
      
      // Add meeting link if provided (required for VIRTUAL/HYBRID)
      if (formData.meetingLink) {
        formDataToSend.append('meetingLink', formData.meetingLink)
      }
      
      // Add max participants if not unlimited
      if (!formData.isUnlimited && formData.maxParticipants) {
        formDataToSend.append('maxParticipants', formData.maxParticipants)
      }
      
      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage)
      }

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        showToast('success', 
          editingEvent ? 'Event Updated!' : 'Event Created!', 
          `Event has been ${editingEvent ? "updated" : "created"} successfully.`
        )
        fetchEvents()
        setIsDialogOpen(false)
        resetForm()
      } else {
        throw new Error("Failed to save event")
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to save event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      location: event.location,
      organizer: event.organizer,
      eventMode: (event as any).eventMode || "PHYSICAL",
      eventType: event.eventType,
      targetAudience: event.targetAudience,
      imageUrl: event.imageUrl || "",
      meetingLink: event.registrationUrl || "",
      maxParticipants: (event as any).maxParticipants?.toString() || "",
      isUnlimited: !(event as any).maxParticipants,
    })
    if (event.imageUrl) {
      setImagePreview(event.imageUrl)
    }
    setIsDialogOpen(true)
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        showToast('success', 'Event Deleted', 'Event has been deleted successfully.')
        fetchEvents()
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete event. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading events...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600">Create and manage agricultural events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update event details" : "Fill in the event information"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="market_day">Market Day</SelectItem>
                      <SelectItem value="field_day">Field Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the event"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Start Date & Time *</Label>
                  <Input
                    id="eventDate"
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange("eventDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Event location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => handleInputChange("organizer", e.target.value)}
                    placeholder="Event organizer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventMode">Event Mode *</Label>
                  <Select value={formData.eventMode} onValueChange={(value) => handleInputChange("eventMode", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHYSICAL">Physical</SelectItem>
                      <SelectItem value="VIRTUAL">Virtual</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange("targetAudience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmers">Farmers</SelectItem>
                      <SelectItem value="buyers">Buyers</SelectItem>
                      <SelectItem value="extension_officers">Extension Officers</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conditional Meeting Link - Only show for VIRTUAL or HYBRID events */}
              {(formData.eventMode === "VIRTUAL" || formData.eventMode === "HYBRID") && (
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link *</Label>
                  <Input
                    id="meetingLink"
                    value={formData.meetingLink}
                    onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                    placeholder="Enter virtual meeting link (e.g., Zoom, Google Meet)"
                  />
                  <p className="text-sm text-gray-500">
                    Required for virtual and hybrid events
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Max Participants</Label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isUnlimited}
                      onChange={(e) => {
                        handleInputChange("isUnlimited", e.target.checked)
                        if (e.target.checked) {
                          handleInputChange("maxParticipants", "")
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Unlimited</span>
                  </label>
                  {!formData.isUnlimited && (
                    <Input
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                      placeholder="Enter max participants"
                      className="w-48"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventImage">Event Image (Optional)</Label>
                <div className="space-y-2">
                  <Input
                    id="eventImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {event.title}
                      <Badge variant={event.isActive ? "default" : "secondary"}>
                        {event.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {event.description}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Date & Time</p>
                    <p className="text-gray-600">{formatDate(event.eventDate)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Mode</p>
                    <Badge variant="outline" className="capitalize">
                      {(event as any).eventMode || "Physical"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Type</p>
                    <p className="text-gray-600 capitalize">{event.eventType}</p>
                  </div>
                </div>
                {event.registrationUrl && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-medium text-gray-700 text-sm">Meeting Link</p>
                    <a 
                      href={event.registrationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {event.registrationUrl}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Created</h3>
              <p className="text-gray-600 mb-4">Create your first agricultural event to get started.</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}