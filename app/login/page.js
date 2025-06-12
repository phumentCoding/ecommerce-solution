"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material"
import { loginUser, clearError } from "@/store/slices/authSlice"
import Link from "next/link"

export default function LoginPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const redirect = searchParams.get("redirect") || "/"

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData))
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link href="/register" style={{ textDecoration: "none" }}>
              <Button variant="text">Register here</Button>
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Demo Accounts:</strong>
          </Typography>
          <Typography variant="body2">Admin: admin@example.com / admin123</Typography>
          <Typography variant="body2">User: user@example.com / user123</Typography>
        </Box>
      </Paper>
    </Container>
  )
}
