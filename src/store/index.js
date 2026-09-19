import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import appointmentsReducer from './appointmentsSlice';
import pharmacyReducer from './pharmacySlice';
import uiReducer from './uiSlice';
import { doctorsApi } from './doctorsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    appointments: appointmentsReducer,
    pharmacy: pharmacyReducer,
    ui: uiReducer,
    [doctorsApi.reducerPath]: doctorsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(doctorsApi.middleware)
});

export default store;
