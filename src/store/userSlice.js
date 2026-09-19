import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateVitalsAsync = createAsyncThunk(
  'user/updateVitals',
  async (newVitals, { dispatch, rejectWithValue }) => {
    // Optimistically update vitals in state before API call
    dispatch(userSlice.actions.setVitalsOptimistic(newVitals));

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (newVitals.heartRate > 220) {
        throw new Error('Abnormal physiological range detected. Update rejected by telemetry gateway.');
      }

      return {
        ...newVitals,
        lastUpdated: 'Just Now'
      };
    } catch (err) {
      // Rollback on rejection
      dispatch(userSlice.actions.revertVitals());
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    vitals: {
      heartRate: 72,
      bp: '120/80',
      spo2: 99,
      glucose: 95,
      lastUpdated: 'Today, 09:30 AM'
    },
    previousVitals: null,
    vitalsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    vitalsError: null,
    prescriptions: [
      { id: 'RX-991', doctorName: 'Dr. Sarah Jenkins', date: 'Yesterday', medication: 'Atorvastatin 10mg', frequency: 'Once Daily', status: 'Active' },
      { id: 'RX-882', doctorName: 'Dr. David Miller', date: 'Last Week', medication: 'Amoxicillin 500mg', frequency: 'Every 8 Hours', status: 'Completed' }
    ]
  },
  reducers: {
    setVitalsOptimistic: (state, action) => {
      state.previousVitals = { ...state.vitals };
      state.vitals = { ...state.vitals, ...action.payload, lastUpdated: 'Syncing...' };
      state.vitalsStatus = 'loading';
      state.vitalsError = null;
    },
    revertVitals: (state) => {
      if (state.previousVitals) {
        state.vitals = state.previousVitals;
        state.previousVitals = null;
      }
      state.vitalsStatus = 'failed';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVitalsAsync.fulfilled, (state, action) => {
        state.vitalsStatus = 'succeeded';
        state.vitals = action.payload;
        state.previousVitals = null;
      })
      .addCase(updateVitalsAsync.rejected, (state, action) => {
        state.vitalsStatus = 'failed';
        state.vitalsError = action.payload || 'Failed to sync vitals';
      });
  }
});

export const { setVitalsOptimistic, revertVitals } = userSlice.actions;
export default userSlice.reducer;
