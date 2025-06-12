"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme
} from "@mui/material"
import {
  ShoppingCart,
  People,
  Inventory,
  TrendingUp,
  ArrowForwardIos,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Logout as LogoutIcon
} from "@mui/icons-material"
import { fetchProducts } from "@/store/slices/productsSlice"

const drawerWidth = 220

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { products } = useSelector((state) => state.products)
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Modern stats cards
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: <Inventory fontSize="large" />,
      color: "#1976d2",
      bg: "linear-gradient(135deg, #e3f0ff 0%, #f7fafc 100%)",
    },
    {
      title: "Total Orders",
      value: "156",
      icon: <ShoppingCart fontSize="large" />,
      color: "#388e3c",
      bg: "linear-gradient(135deg, #e3ffe6 0%, #f7fafc 100%)",
    },
    {
      title: "Total Users",
      value: "89",
      icon: <People fontSize="large" />,
      color: "#f57c00",
      bg: "linear-gradient(135deg, #fff8e1 0%, #f7fafc 100%)",
    },
    {
      title: "Revenue",
      value: "$12,450",
      icon: <TrendingUp fontSize="large" />,
      color: "#7b1fa2",
      bg: "linear-gradient(135deg, #f1e9ff 0%, #f7fafc 100%)",
    },
  ]

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin/dashboard",
    },
    {
      label: "Products",
      icon: <CategoryIcon />,
      path: "/admin/products",
    },
    {
      label: "Orders",
      icon: <AssignmentIcon />,
      path: "/admin/orders",
    },
    {
      label: "Users",
      icon: <GroupIcon />,
      path: "/admin/users",
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      action: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        router.push("/login")
      },
    },
  ]

  const handleSidebarClick = (item) => {
    if (item.action) {
      item.action()
    } else {
      router.push(item.path)
      setMobileOpen(false)
    }
  }

  // Sidebar content
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        borderRight: `1px solid ${theme.palette.divider}`,
        pt: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 2 }}>
        <Avatar
          src="/admin-avatar.png"
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#f7fafc",
            color: "primary.main",
            mb: 1,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </Avatar>
        <Typography variant="subtitle2" color="text.primary">
          {user?.name || "Admin"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => handleSidebarClick(item)}
            selected={router?.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: "background 0.2s",
              "&.Mui-selected": {
                bgcolor: "rgba(25, 118, 210, 0.10)",
                color: "primary.main",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "rgba(245, 249, 255, 0.9)" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
        aria-label="admin sidebar"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* AppBar for mobile */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          bgcolor: "#fff",
          zIndex: 1201,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          alignItems: "center",
          p: 1,
        }}
      >
        <IconButton color="primary" onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Admin Dashboard
        </Typography>
      </Box>
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 5 },
          mt: { xs: 6, md: 0 },
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 0, md: 2 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Avatar
              src="/admin-avatar.png"
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary.dark">
                Welcome, {user?.name || "Admin"}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Supercharge your store with insights & control
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                    p: 2,
                    bgcolor: stat.bg,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#fff",
                        color: stat.color,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* Left: Quick Actions */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  minHeight: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: "#f6f8fb",
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 2px 12px rgba(25,118,210,0.10)" },
                    }}
                    onClick={() => router.push("/admin/products")}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">Manage Products</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add, edit, or remove products from your inventory
                        </Typography>
                      </Box>
                      <ArrowForwardIos sx={{ color: "#1976d2" }} />
                    </CardContent>
                  </Card>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: "#f6f8fb",
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 2px 12px rgba(56,142,60,0.10)" },
                    }}
                    onClick={() => router.push("/admin/orders")}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">Manage Orders</Typography>
                        <Typography variant="body2" color="text.secondary">
                          View and update order statuses
                        </Typography>
                      </Box>
                      <ArrowForwardIos sx={{ color: "#388e3c" }} />
                    </CardContent>
                  </Card>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: "#f6f8fb",
                      borderRadius: 3,
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 2px 12px rgba(245,124,0,0.10)" },
                    }}
                    onClick={() => router.push("/admin/users")}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">Manage Users</Typography>
                        <Typography variant="body2" color="text.secondary">
                          View and manage user accounts
                        </Typography>
                      </Box>
                      <ArrowForwardIos sx={{ color: "#f57c00" }} />
                    </CardContent>
                  </Card>
                </Box>
              </Paper>
            </Grid>

            {/* Right: Recent Activity */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  minHeight: 340,
                }}
              >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f6f8fb",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(25,118,210,0.04)",
                    }}
                  >
                    <Typography variant="body2">New order #1234 received</Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 minutes ago
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f6f8fb",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(25,118,210,0.04)",
                    }}
                  >
                    <Typography variant="body2">
                      Product <b>Wireless Headphones</b> updated
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      1 hour ago
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f6f8fb",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(25,118,210,0.04)",
                    }}
                  >
                    <Typography variant="body2">New user registered</Typography>
                    <Typography variant="caption" color="text.secondary">
                      3 hours ago
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}