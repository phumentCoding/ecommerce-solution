import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { ordersAPI } from "../../services/api"

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (userId) => {
  return await ordersAPI.getByUserId(userId)
})

export const fetchAllOrders = createAsyncThunk("orders/fetchAllOrders", async () => {
  return await ordersAPI.getAll()
})

export const createOrder = createAsyncThunk("orders/createOrder", async (orderData) => {
  return await ordersAPI.create(orderData)
})

export const updateOrderStatus = createAsyncThunk("orders/updateOrderStatus", async ({ orderId, status }) => {
  return await ordersAPI.updateStatus(orderId, status)
})

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    allOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload)
        state.allOrders.push(action.payload)
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const orderIndex = state.allOrders.findIndex((order) => order.id === action.payload.id)
        if (orderIndex !== -1) {
          state.allOrders[orderIndex] = action.payload
        }
      })
  },
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
