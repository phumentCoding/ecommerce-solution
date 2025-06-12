"use client"

import { useEffect, useState } from "react"
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import { fetchProducts } from "@/store/slices/productsSlice"
import { addToCart } from "@/store/slices/cartSlice"
import Link from "next/link"

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.products)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map((product) => product.category))]

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
        All Products
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search products..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={(e) => setCategoryFilter(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
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
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.stock}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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

      {filteredProducts.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria.
          </Typography>
        </Box>
      )}
    </Container>
  )
}
