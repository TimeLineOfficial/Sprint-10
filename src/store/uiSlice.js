import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'light',
    mobileMenuOpen: false,
    toast: null, // { type: 'success' | 'error' | 'info', message: '' }
    specialtyFilter: '',
    searchQuery: ''
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    setSpecialtyFilter: (state, action) => {
      state.specialtyFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  setMobileMenuOpen,
  showToast,
  clearToast,
  setSpecialtyFilter,
  setSearchQuery
} = uiSlice.actions;

export default uiSlice.reducer;
