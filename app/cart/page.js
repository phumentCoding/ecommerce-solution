"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Box,
  Divider,
  TextField,
} from "@mui/material"
import { Add, Remove, Delete } from "@mui/icons-material"
import { updateQuantity, removeFromCart } from "@/store/slices/cartSlice"
import Link from "next/link"

export default function CartPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items, total } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Add some products to your cart to get started.
        </Typography>
        <Link href="/products" passHref>
          <Button variant="contained" size="large">
            Continue Shopping
          </Button>
        </Link>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      style={{ width: "100%", height: 100, objectFit: "cover" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price} each
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>

                      <TextField
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                        type="number"
                        inputProps={{ min: 1 }}
                        sx={{ width: 80 }}
                        size="small"
                      />

                      <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <Add />
                      </IconButton>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="h6">${(item.price * item.quantity).toFixed(2)}</Typography>
                      <IconButton onClick={() => handleRemoveItem(item.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${total.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography>$10.00</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>${(total * 0.08).toFixed(2)}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${(total + 10 + total * 0.08).toFixed(2)}</Typography>
              </Box>

              <Button variant="contained" fullWidth size="large" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>

              <Link href="/products" passHref>
                <Button variant="outlined" fullWidth size="large" sx={{ mt: 2 }}>
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
