import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock API calls
export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data
    const mockUsers = [
      { id: 1, email: "admin@example.com", password: "admin123", role: "admin", name: "Admin User" },
      { id: 2, email: "user@example.com", password: "user123", role: "user", name: "Regular User" },
    ]

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration
      const newUser = {
        id: Date.now(),
        name,
        email,
        role: "user",
      }

      return newUser
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
