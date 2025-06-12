"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress } from "@mui/material"
import { registerUser, clearError } from "@/store/slices/authSlice"
import Link from "next/link"

export default function RegisterPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      const { confirmPassword, ...userData } = formData
      dispatch(registerUser(userData))
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.name}
            helperText={formErrors.name}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.email}
            helperText={formErrors.email}
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
            error={!!formErrors.password}
            helperText={formErrors.password}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Button variant="text">Login here</Button>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
