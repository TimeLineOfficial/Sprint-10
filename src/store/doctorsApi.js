import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { DOCTORS } from '../data/healthcareData';

export const doctorsApi = createApi({
  reducerPath: 'doctorsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Doctors', 'Doctor'],
  endpoints: (builder) => ({
    getDoctors: builder.query({
      async queryFn(searchParams = {}) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let results = [...DOCTORS];

        if (searchParams.specialty) {
          results = results.filter(
            (doc) => doc.specialty.toLowerCase() === searchParams.specialty.toLowerCase()
          );
        }
        if (searchParams.search) {
          const q = searchParams.search.toLowerCase();
          results = results.filter(
            (doc) =>
              doc.name.toLowerCase().includes(q) ||
              doc.specialty.toLowerCase().includes(q) ||
              doc.hospital.toLowerCase().includes(q)
          );
        }
        return { data: results };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Doctor', id })),
              { type: 'Doctors', id: 'LIST' }
            ]
          : [{ type: 'Doctors', id: 'LIST' }]
    }),
    getDoctorById: builder.query({
      async queryFn(id) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const doctor = DOCTORS.find((d) => d.id === id);
        if (!doctor) {
          return { error: { status: 404, data: 'Doctor not found' } };
        }
        return { data: doctor };
      },
      providesTags: (result, error, id) => [{ type: 'Doctor', id }]
    }),
    reserveSlot: builder.mutation({
      async queryFn({ doctorId, slot }) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const doctor = DOCTORS.find((d) => d.id === doctorId);
        if (doctor) {
          doctor.availableSlots = doctor.availableSlots.filter((s) => s !== slot);
        }
        return { data: { success: true, doctorId, slot } };
      },
      invalidatesTags: (result, error, { doctorId }) => [
        { type: 'Doctor', id: doctorId },
        { type: 'Doctors', id: 'LIST' }
      ]
    })
  })
});

export const { useGetDoctorsQuery, useGetDoctorByIdQuery, useReserveSlotMutation } = doctorsApi;
