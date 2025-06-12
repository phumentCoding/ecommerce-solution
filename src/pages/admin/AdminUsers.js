"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
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
import { usersAPI } from "../../services/api"

const AdminUsers = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login")
      return
    }

    const fetchUsers = async () => {
      try {
        const userData = await usersAPI.getAll()
        setUsers(userData)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isAuthenticated, user, navigate])

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

export default AdminUsers
