import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { productsAPI } from "../../services/api"

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  return await productsAPI.getAll()
})

export const fetchProductById = createAsyncThunk("products/fetchProductById", async (id) => {
  return await productsAPI.getById(id)
})

export const addProduct = createAsyncThunk("products/addProduct", async (productData) => {
  return await productsAPI.create(productData)
})

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, ...productData }) => {
  return await productsAPI.update(id, { id, ...productData })
})

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  await productsAPI.delete(id)
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
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
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
