"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, Box } from "@mui/material"
import { ShoppingCart, AccountCircle } from "@mui/icons-material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout } from "@/store/slices/authSlice"

export default function Navbar() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const [anchorEl, setAnchorEl] = useState(null)

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleClose()
    router.push("/")
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            E-Commerce Store
          </Link>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/products" passHref>
            <Button color="inherit">Products</Button>
          </Link>

          <Link href="/cart" passHref>
            <IconButton color="inherit">
              <Badge badgeContent={cartItemsCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Link>

          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link href="/orders" style={{ textDecoration: "none", color: "inherit" }}>
                    My Orders
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                    Profile
                  </Link>
                </MenuItem>
                {user?.role === "admin" && (
                  <MenuItem onClick={handleClose}>
                    <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                      Admin Dashboard
                    </Link>
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
