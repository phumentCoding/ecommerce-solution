"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "next/navigation"
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  TextField,
  Rating,
  Chip,
  CircularProgress,
} from "@mui/material"
import { fetchProductById } from "@/store/slices/productsSlice"
import { addToCart } from "@/store/slices/cartSlice"

export default function ProductDetailPage() {
  const dispatch = useDispatch()
  const params = useParams()
  const { currentProduct: product, loading } = useSelector((state) => state.products)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductById(params.id))
    }
  }, [dispatch, params.id])

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
        }),
      )
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Product not found
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{ height: 400, objectFit: "cover" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.1} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.rating})
              </Typography>
            </Box>

            <Chip label={product.category} color="primary" sx={{ mb: 2 }} />

            <Typography variant="h4" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stock: {product.stock} available
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100 }}
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ px: 4 }}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
