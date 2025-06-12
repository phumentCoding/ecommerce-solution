"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import { Container, Typography, Card, CardContent, Grid, Box, Chip, Alert, CircularProgress } from "@mui/material"
import { fetchOrders } from "@/store/slices/ordersSlice"

export default function OrdersPage() {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const { orders, loading } = useSelector((state) => state.orders)
  const { user } = useSelector((state) => state.auth)

  const success = searchParams.get("success")

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.id))
    }
  }, [dispatch, user])

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Orders
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your order has been placed successfully!
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box textAlign="center" sx={{ py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6">Order #{order.id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip label={order.status.toUpperCase()} color={getStatusColor(order.status)} variant="outlined" />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle1" gutterBottom>
                        Items:
                      </Typography>
                      {order.items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2">
                            {item.name} x {item.quantity}
                          </Typography>
                          <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                        <Typography variant="h6" color="primary">
                          Total: ${order.total.toFixed(2)}
                        </Typography>
                        {order.shippingAddress && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Shipping Address:</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.shippingAddress.street}
                              <br />
                              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                              {order.shippingAddress.zipCode}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
