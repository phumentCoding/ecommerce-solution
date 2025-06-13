"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { loginUser, clearError } from "../../store/slices/authSlice"
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
  const [showPassword, setShowPassword] = useState(false)

  const redirect = searchParams.get("redirect") || "/"

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push(redirect)
  //   }
  // }, [isAuthenticated, router, redirect])

  useEffect(() => {
    if (error) {
      setFormData((prev) => ({ ...prev, password: "" }));
    }
    dispatch(clearError())
  }, [error, dispatch])

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

  const handleClickShowPassword = () => setShowPassword((show) => !show)

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
            Sign in to your account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Welcome back to E-Shop
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              disabled={loading}
              sx={{ mb: 2, background: "#fff" }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      tabIndex={-1}
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, background: "#fff" }}
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
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
            </Button>
          </Box>

          <Box textAlign="center" my={1}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link href="/register" passHref legacyBehavior>
                <Button variant="text" sx={{ fontWeight: 500, color: "#222f3e" }}>
                  Register
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
              Demo Accounts
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