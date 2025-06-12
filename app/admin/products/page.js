"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Alert,
  Chip,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../../../store/slices/productsSlice"

export default function AdminProductsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth)
  const { products, loading } = useSelector((state) => state.products)

  const [open, setOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  })
  const [error, setError] = useState("")

  // Fix: Only fetch products if not already loading (prevents infinite loading)
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role === "admin" &&
      !loading &&
      products.length === 0 // Prevent refetch if already loaded
    ) {
      dispatch(fetchProducts())
    }
  }, [isAuthenticated, user, dispatch, loading, products.length])

  // Redirect to login if not authenticated or not admin (do this in useEffect!)
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.replace("/login")
    }
  }, [isAuthenticated, user, authLoading, router])

  // Show loading or nothing while checking auth
  if (authLoading || (!isAuthenticated && !user)) {
    return <div>Loading...</div>
  }

  // Don't render the page if not admin (redirect will happen in useEffect)
  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        image: product.image,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      })
    }
    setOpen(true)
    setError("")
  }

  const handleClose = () => {
    setOpen(false)
    setEditingProduct(null)
    setError("")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        image:
          formData.image ||
          `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(formData.name)}`,
      }

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, ...productData })).unwrap()
      } else {
        await dispatch(addProduct(productData)).unwrap()
      }

      handleClose()
    } catch (err) {
      setError("Failed to save product. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap()
      } catch (err) {
        setError("Failed to delete product. Please try again.")
      }
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Products
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <Chip label={product.category} size="small" />
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Chip
                    label={product.stock}
                    color={
                      product.stock > 10
                        ? "success"
                        : product.stock > 0
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ step: 0.01, min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                name="image"
                value={formData.image}
                onChange={handleChange}
                helperText="Leave empty to auto-generate placeholder image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? "Update" : "Add"} Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}