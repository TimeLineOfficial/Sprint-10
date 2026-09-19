import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (credentials?.email === 'error@medipulse.org') {
        return rejectWithValue('Invalid medical credentials or inactive profile.');
      }
      return {
        id: 'PAT-9921',
        name: credentials?.name || 'Sarah Jenkins',
        email: credentials?.email || 'patient@medipulse.org',
        role: 'Patient',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        token: 'jwt-medipulse-session-token-2026'
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUserAsync = createAsyncThunk('auth/logoutUser', async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      id: 'PAT-9921',
      name: 'Sarah Jenkins',
      email: 'patient@medipulse.org',
      role: 'Patient',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      token: 'jwt-medipulse-session-token-2026'
    },
    isAuthenticated: true,
    status: 'idle',
    error: null
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'idle';
      });
  }
});

export const { setUserProfile } = authSlice.actions;
export default authSlice.reducer;
