// src/store/cart.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


import api from "../api/axios";

// Fetch Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!auth.isLoggedIn) {
        return rejectWithValue("User not authenticated");
      }
      if (!token) {
        return rejectWithValue("No token found — please login again");
      }

      const headers = {
        id: userId,
        authorization: `Bearer ${token}`, // ✅ real token
      };

      const response = await api.get("/api/get-user-cart", { headers });

      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load cart");
    }
  }
);

// Remove Item From Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!auth.isLoggedIn) {
        return rejectWithValue("User not authenticated");
      }
      if (!token || !userId) {
        return rejectWithValue("Missing credentials — login again");
      }

      const headers = {
        id: userId,
        authorization: `Bearer ${token}`,
      };

      const response = await api.put(
        `/api/remove-book-from-cart/${id}`,
        {},
        { headers }
      );

      // Refresh cart after delete
      dispatch(fetchCart()); // 🔄

      return { id, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// Add Item To Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (bookid, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      if (!auth.isLoggedIn) {
        return rejectWithValue("User not authenticated");
      }
      if (!token || !userId) {
        return rejectWithValue("Please login again");
      }

      const headers = {
        id: userId,
        authorization: `Bearer ${token}`,
      };

      const res = await api.put(`/api/add-to-cart`, { bookid }, { headers });

      // Refresh cart after add
      dispatch(fetchCart()); // 🔄

      return { bookid, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add to cart failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((sum, item) => sum + (item.price || 0), 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.items = [];
        state.total = 0;
      })

      // Remove Item
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload.id);
        state.total = state.items.reduce((sum, item) => sum + (item.price || 0), 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Item
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
