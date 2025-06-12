"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
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
  Select,
  MenuItem,
  FormControl,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import { updateOrderStatus } from "@/store/slices/ordersSlice"

// Mock orders data for admin view
const mockAdminOrders = [
  {
    id: 1,
    userId: 2,
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [{ id: 1, name: "Wireless Headphones", price: 199.99, quantity: 1 }],
    total: 217.99,
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
  },
  {
    id: 2,
    userId: 3,
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
      { id: 2, name: "Smart Watch", price: 299.99, quantity: 1 },
      { id: 3, name: "Running Shoes", price: 129.99, quantity: 1 },
    ],
    total: 463.98,
    status: "processing",
    createdAt: "2024-01-14T15:45:00Z",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
    },
  },
  {
    id: 3,
    userId: 4,
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    items: [{ id: 4, name: "Coffee Maker", price: 89.99, quantity: 2 }],
    total: 193.98,
    status: "shipped",
    createdAt: "2024-01-13T09:20:00Z",
    shippingAddress: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    },
  },
]

export default function AdminOrdersPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState(mockAdminOrders)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
      return
    }
  }, [isAuthenticated, user, router])

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "shipped":
        return "primary"
      case "delivered":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Orders
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {orderStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="warning.main">
                {orderStats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="info.main">
                {orderStats.processing}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Processing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary.main">
                {orderStats.shipped}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shipped
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {orderStats.delivered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delivered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {order.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customerEmail}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    {order.items.map((item, index) => (
                      <Typography key={index} variant="body2">
                        {item.name} x {item.quantity}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={order.status.toUpperCase()} color={getStatusColor(order.status)} size="small" />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
