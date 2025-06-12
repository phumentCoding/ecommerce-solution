"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Container, Grid, Paper, Typography, Box, Card, CardContent } from "@mui/material"
import { ShoppingCart, People, Inventory, TrendingUp } from "@mui/icons-material"
import { fetchProducts } from "../../store/slices/productsSlice"
import { fetchAllOrders } from "../../store/slices/ordersSlice"

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { products } = useSelector((state) => state.products)
  const { allOrders } = useSelector((state) => state.orders)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login")
      return
    }
    dispatch(fetchProducts())
    dispatch(fetchAllOrders())
  }, [isAuthenticated, user, navigate, dispatch])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: <Inventory fontSize="large" />,
      color: "#1976d2",
    },
    {
      title: "Total Orders",
      value: allOrders.length,
      icon: <ShoppingCart fontSize="large" />,
      color: "#388e3c",
    },
    {
      title: "Total Users",
      value: "89",
      icon: <People fontSize="large" />,
      color: "#f57c00",
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <TrendingUp fontSize="large" />,
      color: "#7b1fa2",
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Card sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/products")}>
                <CardContent>
                  <Typography variant="h6">Manage Products</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add, edit, or remove products from your inventory
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/orders")}>
                <CardContent>
                  <Typography variant="h6">Manage Orders</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and update order statuses
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/users")}>
                <CardContent>
                  <Typography variant="h6">Manage Users</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage user accounts
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2">New order received</Typography>
                <Typography variant="caption" color="text.secondary">
                  2 minutes ago
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2">Product "Wireless Headphones" updated</Typography>
                <Typography variant="caption" color="text.secondary">
                  1 hour ago
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2">New user registered</Typography>
                <Typography variant="caption" color="text.secondary">
                  3 hours ago
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminDashboard
