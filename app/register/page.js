"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material"
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            boxShadow: "0 2px 16px rgba(60,72,88,0.04)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            align="center"
            color="text.primary"
            sx={{ mb: 1, letterSpacing: 0.5 }}
          >
            Create your account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Register for an E-Shop account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
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
              sx={{
                mb: 2,
                background: "#fff",
              }}
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
              sx={{
                mb: 2,
                background: "#fff",
              }}
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
              sx={{
                mb: 2,
                background: "#fff",
              }}
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
              sx={{
                mb: 2,
                background: "#fff",
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                mb: 2,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                background: "#222f3e",
                boxShadow: "none",
                "&:hover": {
                  background: "#1c2531",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
            </Button>
          </Box>

          <Box textAlign="center" my={1}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/login" passHref legacyBehavior>
                <Button variant="text" sx={{ fontWeight: 500, color: "#222f3e" }}>
                  Login
                </Button>
              </Link>
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              bgcolor: "#f4f6f8",
              borderRadius: 2,
              py: 1.5,
              px: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Use demo to explore
            </Typography>
            <Typography variant="body2" color="text.primary">
              Admin: <b>admin@example.com</b> / <b>admin123</b>
            </Typography>
            <Typography variant="body2" color="text.primary">
              User: <b>user@example.com</b> / <b>user123</b>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}