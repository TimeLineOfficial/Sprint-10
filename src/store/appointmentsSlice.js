import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const bookAppointmentAsync = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { dispatch, rejectWithValue }) => {
    // Generate temporary ID for optimistic UI injection
    const tempId = `APT-${Date.now()}`;
    const newAppointment = {
      id: tempId,
      doctorName: appointmentData.doctor.name,
      doctorTitle: appointmentData.doctor.title,
      specialty: appointmentData.doctor.specialty,
      hospital: appointmentData.doctor.hospital,
      doctorImage: appointmentData.doctor.image,
      date: appointmentData.date || 'Today',
      timeSlot: appointmentData.timeSlot || '11:00 AM',
      consultationType: appointmentData.consultationType || 'HD Video Consult',
      patientName: appointmentData.patientName || 'Sarah Jenkins',
      status: 'Confirmed',
      meetingUrl: `https://medipulse.telehealth.live/room/video-${Math.random().toString(36).substring(7)}`
    };

    // Optimistically add to state
    dispatch(appointmentsSlice.actions.addAppointmentOptimistic(newAppointment));

    try {
      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (appointmentData.failSimulation) {
        throw new Error('Slot conflict: Selected time slot was just booked by another patient.');
      }

      return newAppointment;
    } catch (err) {
      // Rollback optimistic appointment on failure
      dispatch(appointmentsSlice.actions.removeAppointmentOptimistic(tempId));
      return rejectWithValue(err.message);
    }
  }
);

export const cancelAppointmentAsync = createAsyncThunk(
  'appointments/cancelAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return appointmentId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [
      {
        id: 'APT-1001',
        doctorName: 'Dr. Sarah Jenkins, MD',
        doctorTitle: 'Senior Consultant Cardiologist',
        specialty: 'Cardiology',
        hospital: 'MediPulse Heart & Vascular Institute',
        doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        date: 'Today',
        timeSlot: '02:30 PM',
        consultationType: 'HD Video Consult',
        patientName: 'Sarah Jenkins',
        status: 'Confirmed',
        meetingUrl: 'https://medipulse.telehealth.live/room/video-cardio-991'
      },
      {
        id: 'APT-1002',
        doctorName: 'Dr. Robert Chen, MD',
        doctorTitle: 'Chief Neurologist',
        specialty: 'Neurology',
        hospital: 'NeuroCare Academic Hospital',
        doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        date: 'Tomorrow',
        timeSlot: '10:00 AM',
        consultationType: 'In-Clinic Visit',
        patientName: 'Sarah Jenkins',
        status: 'Confirmed',
        meetingUrl: null
      }
    ],
    bookingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    bookingError: null,
    activeVideoCall: null
  },
  reducers: {
    addAppointmentOptimistic: (state, action) => {
      state.appointments.unshift(action.payload);
      state.bookingStatus = 'loading';
      state.bookingError = null;
    },
    removeAppointmentOptimistic: (state, action) => {
      state.appointments = state.appointments.filter((apt) => apt.id !== action.payload);
      state.bookingStatus = 'failed';
    },
    setActiveVideoCall: (state, action) => {
      state.activeVideoCall = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointmentAsync.pending, (state) => {
        state.bookingStatus = 'loading';
        state.bookingError = null;
      })
      .addCase(bookAppointmentAsync.fulfilled, (state) => {
        state.bookingStatus = 'succeeded';
      })
      .addCase(bookAppointmentAsync.rejected, (state, action) => {
        state.bookingStatus = 'failed';
        state.bookingError = action.payload || 'Booking failed';
      })
      .addCase(cancelAppointmentAsync.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter((apt) => apt.id !== action.payload);
      });
  }
});

export const { addAppointmentOptimistic, removeAppointmentOptimistic, setActiveVideoCall } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
