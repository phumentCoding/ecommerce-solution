"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  Alert,
} from "@mui/material"
import { createOrder } from "@/store/slices/ordersSlice"
import { clearCart } from "@/store/slices/cartSlice"

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items, total } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const orderData = {
        userId: user.id,
        items: items,
        total: total + 10 + total * 0.08, // Including shipping and tax
        shippingAddress: shippingInfo,
        paymentMethod: "Credit Card",
      }

      await dispatch(createOrder(orderData)).unwrap()
      dispatch(clearCart())
      router.push("/orders?success=true")
    } catch (err) {
      setError("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shipping Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={shippingInfo.street}
                  onChange={handleShippingChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Payment Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  name="cardholderName"
                  value={paymentInfo.cardholderName}
                  onChange={handlePaymentChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                  placeholder="123"
                  required
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>

              {items.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>$10.00</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography>Tax:</Typography>
                <Typography>${(total * 0.08).toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${(total + 10 + total * 0.08).toFixed(2)}</Typography>
              </Box>

              <Button variant="contained" fullWidth size="large" onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
