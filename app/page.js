"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material"
import { fetchProducts } from "@/store/slices/productsSlice"
import { addToCart } from "@/store/slices/cartSlice"
import Link from "next/link"

export default function HomePage() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }),
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          Error loading products: {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Welcome to Our Store
      </Typography>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Featured Products
      </Typography>

      <Grid container spacing={3}>
        {products.slice(0, 8).map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button size="small" variant="contained" fullWidth onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
                <Link href={`/products/${product.id}`} passHref>
                  <Button size="small" variant="outlined" fullWidth sx={{ ml: 1 }}>
                    View Details
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" sx={{ mt: 4 }}>
        <Link href="/products" passHref>
          <Button variant="outlined" size="large">
            View All Products
          </Button>
        </Link>
      </Box>
    </Container>
  )
}
