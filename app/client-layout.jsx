// app/client-layout.jsx
"use client"

import { Provider } from "react-redux"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { store } from "@/store/store"
import Navbar from "@/components/Navbar"
import { Box } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
})

export default function ClientLayout({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
      </ThemeProvider>
    </Provider>
  )
}
