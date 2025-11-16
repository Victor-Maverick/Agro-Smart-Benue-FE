"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, Check, Trash2 } from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (session?.user?.email) {
      fetchNotifications()
    }
  }, [session, filter])

  const fetchNotifications = async () => {
    try {
      const endpoint = filter === 'unread' 
        ? `/api/notification/getUserAllUnRead?email=${session?.user?.email}`
        : `/api/notification/getUserAll?email=${session?.user?.email}`
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notification/readNotification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ notificationId: id })
      })

      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notification/readAllNotification?email=${session?.user?.email}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      )

      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notification/deleteById?id=${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      )

      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const deleteAllNotifications = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notification/deleteAllUser?email=${session?.user?.email}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`
          }
        }
      )

      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="text-green-600" />
          Notifications
        </h1>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Check size={18} />
            Mark All Read
          </button>
          <button
            onClick={deleteAllNotifications}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 size={18} />
            Delete All
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded ${
            filter === 'unread' ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Unread
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                    {!notification.read && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      <Check size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
