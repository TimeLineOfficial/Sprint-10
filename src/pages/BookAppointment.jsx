import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import { DOCTORS } from '../data/healthcareData';
import { bookAppointmentAsync } from '../store/appointmentsSlice';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function BookAppointment() {
  const location = useLocation();
  const dispatch = useDispatch();

  const preSelectedDoc = location.state?.doctor || DOCTORS[0];
  const authUser = useSelector((state) => state.auth.user);
  const bookingStatus = useSelector((state) => state.appointments.bookingStatus);
  const bookingError = useSelector((state) => state.appointments.bookingError);

  const [selectedDoc, setSelectedDoc] = useState(preSelectedDoc);
  const [consultType, setConsultType] = useState('VIDEO');
  const [selectedDate, setSelectedDate] = useState('Today, Sep 19');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [patientName, setPatientName] = useState(authUser?.name || 'Sarah Jenkins');
  const [patientPhone, setPatientPhone] = useState('+1 (555) 019-2834');
  const [symptoms, setSymptoms] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const payload = {
      doctor: selectedDoc,
      date: selectedDate,
      timeSlot: selectedTime,
      consultationType: consultType === 'VIDEO' ? 'HD Video Consult' : 'In-Clinic Visit',
      patientName,
      patientPhone,
      symptoms
    };

    const resultAction = await dispatch(bookAppointmentAsync(payload));
    if (bookAppointmentAsync.fulfilled.match(resultAction)) {
      setConfirmedAppointment(resultAction.payload);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (confirmedAppointment) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase tracking-wider">
            Optimistically Preserved in Redux Toolkit
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Virtual Consultation Scheduled!
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-left text-xs space-y-3 shadow-sm">
          <div className="flex justify-between border-b pb-2.5 font-semibold">
            <span className="text-slate-400">Booking ID:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{confirmedAppointment.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2.5">
            <span className="text-slate-400">Doctor:</span>
            <span className="font-bold text-slate-900 dark:text-white">{confirmedAppointment.doctorName}</span>
          </div>
          <div className="flex justify-between border-b pb-2.5">
            <span className="text-slate-400">Specialty:</span>
            <span>{confirmedAppointment.specialty}</span>
          </div>
          <div className="flex justify-between border-b pb-2.5">
            <span className="text-slate-400">Date &amp; Time:</span>
            <span className="font-bold text-slate-900 dark:text-white">{confirmedAppointment.date} at {confirmedAppointment.timeSlot}</span>
          </div>
          <div className="flex justify-between border-b pb-2.5">
            <span className="text-slate-400">Consultation Mode:</span>
            <span className="font-bold text-emerald-600">{confirmedAppointment.consultationType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Patient:</span>
            <span className="font-bold">{patientName} ({patientPhone})</span>
          </div>
        </div>

        {consultType === 'VIDEO' && confirmedAppointment.meetingUrl && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-left space-y-2">
            <div className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-600" /> Virtual Meeting Link Pinned
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Your encrypted HD video consultation room is ready. Access details have been dispatched to {patientPhone}.
            </p>
            <div className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded border text-emerald-600 font-bold truncate">
              {confirmedAppointment.meetingUrl}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link
            to="/patient-portal"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-md active:scale-95 transition-all"
          >
            Go To Patient Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
        <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Redux Toolkit AsyncThunks • Booking Gateway
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Book Doctor Consultation
        </h1>
      </div>

      {bookingError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{bookingError}</span>
        </div>
      )}

      <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Step 1: Select Doctor & Type */}
        <div className="md:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Specialist Doctor</label>
            <select
              value={selectedDoc.id}
              onChange={(e) => {
                const doc = DOCTORS.find((d) => d.id === e.target.value);
                if (doc) setSelectedDoc(doc);
              }}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            >
              {DOCTORS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty} (${d.fee})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Consultation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultType('VIDEO')}
                className={`p-3 rounded-xl border text-center space-y-1 font-bold transition-all ${
                  consultType === 'VIDEO'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                <Video className="w-5 h-5 mx-auto text-emerald-600" />
                <div>HD Video Call</div>
                <div className="text-[10px] text-slate-400 font-normal">Virtual Telehealth</div>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('CLINIC')}
                className={`p-3 rounded-xl border text-center space-y-1 font-bold transition-all ${
                  consultType === 'CLINIC'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                <MapPin className="w-5 h-5 mx-auto text-emerald-600" />
                <div>Clinic Visit</div>
                <div className="text-[10px] text-slate-400 font-normal">In-Person Hospital</div>
              </button>
            </div>
          </div>

          {/* Date & Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Date &amp; Time Slot</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {['Today, Sep 19', 'Tomorrow, Sep 20'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`p-2.5 rounded-xl border text-xs font-bold ${
                    selectedDate === d
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {selectedDoc.availableSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 px-2 rounded-lg border text-[11px] font-bold ${
                    selectedTime === slot
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Patient Info & Summary */}
        <div className="md:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm text-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b pb-3">Patient Details</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Full Patient Name *</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Phone Number (For SMS Confirmation) *</label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Reason for Visit / Symptoms</label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your health concern or symptoms..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
              <span>Consultation Fee:</span>
              <span>${selectedDoc.fee}</span>
            </div>
            <div className="text-[10px] text-slate-400">Includes 100% HIPAA compliant video room &amp; digital prescription</div>
          </div>

          <button
            type="submit"
            disabled={bookingStatus === 'loading'}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            {bookingStatus === 'loading' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>SYNCING WITH REDUX THUNK...</span>
              </>
            ) : (
              <>
                <span>CONFIRM &amp; BOOK NOW</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
