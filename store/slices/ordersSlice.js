import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const createOrder = createAsyncThunk("orders/createOrder", async (orderData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newOrder = {
    id: Date.now(),
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  return newOrder
})

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (userId) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock orders data
  const mockOrders = [
    {
      id: 1,
      userId: userId,
      items: [{ id: 1, name: "Wireless Headphones", price: 199.99, quantity: 1 }],
      total: 199.99,
      status: "delivered",
      createdAt: "2024-01-15T10:30:00Z",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
    },
  ]

  return mockOrders
})

export const updateOrderStatus = createAsyncThunk("orders/updateOrderStatus", async ({ orderId, status }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { orderId, status }
})

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders.push(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload
        const order = state.orders.find((o) => o.id === orderId)
        if (order) {
          order.status = status
        }
      })
  },
})

export default ordersSlice.reducer
