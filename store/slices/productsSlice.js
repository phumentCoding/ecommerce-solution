import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock products data
const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    image: "/wireless-headphones.png",
    category: "Electronics",
    stock: 50,
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring",
    price: 299.99,
    image: "/smartwatch-lifestyle.png",
    category: "Electronics",
    stock: 30,
    rating: 4.3,
  },
  {
    id: 3,
    name: "Running Shoes",
    description: "Comfortable running shoes for all terrains",
    price: 129.99,
    image: "/running-shoes-on-track.png",
    category: "Sports",
    stock: 75,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Coffee Maker",
    description: "Automatic coffee maker with programmable settings",
    price: 89.99,
    image: "/modern-coffee-maker.png",
    category: "Home",
    stock: 25,
    rating: 4.2,
  },
  {
    id: 5,
    name: "Laptop Backpack",
    description: "Durable laptop backpack with multiple compartments",
    price: 59.99,
    image: "/laptop-backpack.png",
    category: "Accessories",
    stock: 40,
    rating: 4.4,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with excellent sound quality",
    price: 79.99,
    image: "/bluetooth-speaker.png",
    category: "Electronics",
    stock: 60,
    rating: 4.6,
  },
]

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockProducts
})

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockProducts.find((product) => product.id === Number.parseInt(id))
})

export const addProduct = createAsyncThunk("products/addProduct", async (productData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newProduct = {
    ...productData,
    id: Date.now(),
    rating: 0,
  }
  return newProduct
})

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, ...productData }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { id, ...productData }
})

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return id
})

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload)
      })
  },
})

export const { clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer
