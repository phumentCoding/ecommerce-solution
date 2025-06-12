const API_BASE_URL = "http://localhost:3001"

// Generic API functions
const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  patch: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const users = await api.get("/users")
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Update last login
    await api.patch(`/users/${user.id}`, {
      lastLogin: new Date().toISOString(),
    })

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  register: async (userData) => {
    const users = await api.get("/users")
    const existingUser = users.find((u) => u.email === userData.email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      role: "user",
      status: "active",
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    }

    const createdUser = await api.post("/users", newUser)
    const { password: _, ...userWithoutPassword } = createdUser
    return userWithoutPassword
  },
}

// Products API
export const productsAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) =>
    api.post("/products", {
      ...productData,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      featured: false,
    }),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getByCategory: (category) => api.get(`/products?category=${category}`),
  search: (query) => api.get(`/products?q=${query}`),
}

// Orders API
export const ordersAPI = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getByUserId: (userId) => api.get(`/orders?userId=${userId}`),
  create: (orderData) =>
    api.post("/orders", {
      ...orderData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
  updateStatus: (id, status) =>
    api.patch(`/orders/${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    }),
  delete: (id) => api.delete(`/orders/${id}`),
}

// Users API
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
}

export default api
