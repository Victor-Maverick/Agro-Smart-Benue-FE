"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, Search, UserCheck } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"
import ConfirmationModal from "@/components/ConfirmationModal"
import Dropdown from "@/components/Dropdown"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  imageUrl?: string
  roles: string[]
  createdAt: string
  status?: string
}

export default function AdminUserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 8
  const [showAddAdminForm, setShowAddAdminForm] = useState(false)
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  })
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'activate' | 'deactivate' | null;
    userId?: number;
    userEmail?: string;
  }>({
    isOpen: false,
    type: null
  })

  const { showToast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/all`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched users:', data)
        setUsers(data || [])
      } else {
        showToast('error', 'Error', 'Failed to fetch users')
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      showToast('error', 'Error', 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/delete-user?id=${confirmModal.userId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        showToast('success', 'User Deleted', 'User has been deleted successfully.')
        fetchUsers()
      } else {
        showToast('error', 'Error', 'Failed to delete user.')
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete user. Please try again.')
    } finally {
      setConfirmModal({ isOpen: false, type: null })
    }
  }

  const handleDisableUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/disable-user?id=${confirmModal.userId}`, {
        method: "PUT"
      })

      if (response.ok) {
        showToast('success', 'User Deactivated', 'User has been deactivated successfully.')
        fetchUsers()
      } else {
        showToast('error', 'Error', 'Failed to deactivate user.')
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to deactivate user. Please try again.')
    } finally {
      setConfirmModal({ isOpen: false, type: null })
    }
  }

  const handleActivateUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/activate?email=${encodeURIComponent(confirmModal.userEmail!)}`, {
        method: "PUT"
      })

      if (response.ok) {
        showToast('success', 'User Activated', 'User has been activated successfully.')
        fetchUsers()
      } else {
        showToast('error', 'Error', 'Failed to activate user.')
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to activate user. Please try again.')
    } finally {
      setConfirmModal({ isOpen: false, type: null })
    }
  }

  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case 'delete':
        handleDeleteUser()
        break
      case 'activate':
        handleActivateUser()
        break
      case 'deactivate':
        handleDisableUser()
        break
    }
  }

  const getStatusBadge = (status?: string) => {
    const statusValue = status || 'ACTIVE'
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      INACTIVE: 'bg-red-100 text-red-800 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[statusValue as keyof typeof colors] || colors.ACTIVE}`}>
        {statusValue}
      </span>
    )
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/add-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adminForm)
      })

      if (response.ok) {
        showToast('success', 'Admin Added', 'Admin user has been created successfully.')
        setShowAddAdminForm(false)
        setAdminForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: ''
        })
        fetchUsers()
      } else {
        const error = await response.text()
        showToast('error', 'Error', error || 'Failed to create admin.')
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to create admin. Please try again.')
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || 
      user.roles.some(role => role.toLowerCase().includes(roleFilter.toLowerCase()))

    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoleColor = (roles: string[]) => {
    if (roles.some(role => role.includes('ADMIN'))) {
      return "bg-red-100 text-red-800"
    }
    if (roles.some(role => role.includes('FARMER'))) {
      return "bg-green-100 text-green-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getRoleDisplay = (roles: string[]) => {
    // Clean up the role display - remove brackets and extra formatting
    const cleanRoles = roles.map(role => {
      const cleaned = role.replace(/[\[\]]/g, '').trim()
      return cleaned.split('.').pop() || cleaned
    })
    return cleanRoles.join(', ')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <Button
          onClick={() => setShowAddAdminForm(!showAddAdminForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          {showAddAdminForm ? 'Cancel' : 'Add Admin'}
        </Button>
      </div>

      {/* Add Admin Form */}
      {showAddAdminForm && (
        <Card className="border-green-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <Input
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Input
                    value={adminForm.lastName}
                    onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <Input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Create Admin
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddAdminForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-[58px] rounded-[14px]"
              />
            </div>
            <div>
              <Dropdown
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'farmer', label: 'Farmer' }
                ]}
                selectedOption={
                  roleFilter === 'all' 
                    ? { value: 'all', label: 'All Roles' }
                    : roleFilter === 'admin'
                    ? { value: 'admin', label: 'Admin' }
                    : { value: 'farmer', label: 'Farmer' }
                }
                onSelect={(option) => setRoleFilter(option.value)}
                placeholder="Filter by role"
                getLabel={(option) => option.label}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-green-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                            <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                              {`${user.firstName[0]}${user.lastName[0]}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell className="text-sm">{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.roles)}>
                          {getRoleDisplay(user.roles)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.status === 'INACTIVE' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmModal({ isOpen: true, type: 'activate', userEmail: user.email })}
                              className="border-green-300 text-green-600 hover:bg-green-50 px-3"
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmModal({ isOpen: true, type: 'deactivate', userId: user.id })}
                              className="border-orange-300 text-orange-600 hover:bg-orange-50 px-3"
                            >
                              Deactivate
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmModal({ isOpen: true, type: 'delete', userId: user.id })}
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
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <UserCheck className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">No users found</p>
                        <p className="text-sm text-gray-400">
                          {searchQuery || roleFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "No users have been registered yet"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete' 
            ? 'Sure you want to delete?' 
            : confirmModal.type === 'activate'
            ? 'Activate this user?'
            : 'Deactivate this user?'
        }
        message={
          confirmModal.type === 'delete'
            ? 'Be sure you want to delete as this action cannot be undone'
            : confirmModal.type === 'activate'
            ? 'This user will be able to access the system again'
            : 'This user will no longer be able to access the system'
        }
        confirmText={
          confirmModal.type === 'delete'
            ? 'Delete'
            : confirmModal.type === 'activate'
            ? 'Activate'
            : 'Deactivate'
        }
        isDestructive={confirmModal.type === 'delete' || confirmModal.type === 'deactivate'}
      />
    </div>
  )
}