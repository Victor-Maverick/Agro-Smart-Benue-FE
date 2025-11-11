"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, Search, Filter, Plus, MoreVertical, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { useToast } from "@/contexts/ToastContext"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  imageUrl?: string
  roles: string[]
  createdAt: string
}

export default function AdminUserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

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

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/delete-user?id=${userId}`, {
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
    }
  }

  const handleDisableUser = async (userId: number) => {
    if (!confirm("Are you sure you want to disable this user?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/disable-user?id=${userId}`, {
        method: "PUT"
      })

      if (response.ok) {
        showToast('success', 'User Disabled', 'User has been disabled successfully.')
        fetchUsers()
      } else {
        showToast('error', 'Error', 'Failed to disable user.')
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to disable user. Please try again.')
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
      </div>

      {/* Search and Filter */}
      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-green-300 text-green-700 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Role: {roleFilter === "all" ? "All" : roleFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("admin")}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter("farmer")}>Farmer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                            <p className="text-xs text-gray-500">ID: {user.id}</p>
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
                      <TableCell className="text-sm">{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDisableUser(user.id)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Disable User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
    </div>
  )
}