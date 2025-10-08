// src/store/cart.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    if (!auth.isLoggedIn) {
      return rejectWithValue('User not authenticated');
    }
    const headers = {
      id: localStorage.getItem('id'),
      authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    const response = await axios.get('/api/get-user-cart', { headers });
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

// Async thunk to remove item from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    if (!auth.isLoggedIn) {
      return rejectWithValue('User not authenticated');
    }
    const headers = {
      id: localStorage.getItem('id'),
      authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    const response = await axios.put(`/api/remove-book-from-cart/${id}`, {}, { headers });
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

// Async thunk to add item to cart
export const addToCart = createAsyncThunk('cart/addToCart', async (bookId, { getState, rejectWithValue, dispatch }) => {
  try {
    const { auth } = getState();
    if (!auth.isLoggedIn) {
      return rejectWithValue('User not authenticated');
    }
    const headers = {
      id: localStorage.getItem('id'),
      authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    await axios.post('/api/add-to-cart', { bookId }, { headers });
    // Refresh cart after adding
    await dispatch(fetchCart()).unwrap();
    return { bookId };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart
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
      // Remove from cart
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
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;