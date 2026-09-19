import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const checkoutPharmacyAsync = createAsyncThunk(
  'pharmacy/checkoutOrder',
  async (orderPayload, { dispatch, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (orderPayload.cartItems.length === 0) {
        throw new Error('Cart is empty.');
      }
      return {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items: orderPayload.cartItems,
        totalAmount: orderPayload.totalAmount,
        date: new Date().toLocaleDateString(),
        status: 'Processing Delivery'
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    cartItems: [],
    orders: [],
    checkoutStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    checkoutError: null
  },
  reducers: {
    addToCartOptimistic: (state, action) => {
      const existing = state.cartItems.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i.id !== id);
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutPharmacyAsync.pending, (state) => {
        state.checkoutStatus = 'loading';
        state.checkoutError = null;
      })
      .addCase(checkoutPharmacyAsync.fulfilled, (state, action) => {
        state.checkoutStatus = 'succeeded';
        state.orders.unshift(action.payload);
        state.cartItems = [];
      })
      .addCase(checkoutPharmacyAsync.rejected, (state, action) => {
        state.checkoutStatus = 'failed';
        state.checkoutError = action.payload || 'Checkout failed';
      });
  }
});

export const { addToCartOptimistic, removeFromCart, updateQuantity, clearCart } = pharmacySlice.actions;
export default pharmacySlice.reducer;
