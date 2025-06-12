"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
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
  Select,
  MenuItem,
  FormControl,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material"
import { fetchAllOrders, updateOrderStatus } from "../../store/slices/ordersSlice"

const AdminOrders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { allOrders } = useSelector((state) => state.orders)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login")
      return
    }
    dispatch(fetchAllOrders())
  }, [isAuthenticated, user, navigate, dispatch])

  const handleStatusChange = (orderId, newStatus) => {
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
    total: allOrders.length,
    pending: allOrders.filter((o) => o.status === "pending").length,
    processing: allOrders.filter((o) => o.status === "processing").length,
    shipped: allOrders.filter((o) => o.status === "shipped").length,
    delivered: allOrders.filter((o) => o.status === "delivered").length,
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
            {allOrders.map((order) => (
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

export default AdminOrders
