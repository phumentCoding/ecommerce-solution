"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    joinDate: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-10T00:00:00Z",
    lastLogin: "2024-01-15T09:20:00Z",
    totalOrders: 3,
    totalSpent: 567.89,
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-12T00:00:00Z",
    lastLogin: "2024-01-14T15:45:00Z",
    totalOrders: 1,
    totalSpent: 299.99,
  },
  {
    id: 4,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2024-01-05T00:00:00Z",
    lastLogin: "2024-01-08T12:00:00Z",
    totalOrders: 2,
    totalSpent: 189.98,
  },
]

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [users] = useState(mockUsers)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
      return
    }
  }, [isAuthenticated, user, router])

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    admins: users.filter((u) => u.role === "admin").length,
  }

  const getRoleColor = (role) => {
    return role === "admin" ? "error" : "primary"
  }

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "default"
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Users
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {userStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {userStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="text.secondary">
                {userStats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inactive Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="error.main">
                {userStats.admins}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrators
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((userData) => (
              <TableRow key={userData.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>{userData.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {userData.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userData.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={userData.role.toUpperCase()} color={getRoleColor(userData.role)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={userData.status.toUpperCase()} color={getStatusColor(userData.status)} size="small" />
                </TableCell>
                <TableCell>{new Date(userData.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(userData.lastLogin).toLocaleDateString()}</TableCell>
                <TableCell>{userData.totalOrders}</TableCell>
                <TableCell>${userData.totalSpent.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
