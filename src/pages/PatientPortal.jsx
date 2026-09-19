import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateVitalsAsync } from '../store/userSlice';
import { cancelAppointmentAsync } from '../store/appointmentsSlice';
import { 
  Heart, 
  Activity, 
  Droplet, 
  Thermometer, 
  Calendar, 
  FileText, 
  Video, 
  Download, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function PatientPortal() {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.user);
  const vitals = useSelector((state) => state.user.vitals);
  const vitalsStatus = useSelector((state) => state.user.vitalsStatus);
  const vitalsError = useSelector((state) => state.user.vitalsError);
  const prescriptions = useSelector((state) => state.user.prescriptions);
  const appointments = useSelector((state) => state.appointments.appointments);

  const [newHeartRate, setNewHeartRate] = useState('');
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  const handleUpdateHeartRate = async (e) => {
    e.preventDefault();
    if (!newHeartRate) return;

    const payload = { heartRate: Number(newHeartRate) };
    await dispatch(updateVitalsAsync(payload));
    setNewHeartRate('');
    setShowVitalsModal(false);
  };

  const handleTriggerSimulatedRollback = async () => {
    // Dispatch abnormal heart rate to trigger rollback logic in Redux Thunk
    await dispatch(updateVitalsAsync({ heartRate: 250 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Patient Profile Banner */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
            {authUser?.name ? authUser.name.split(' ').map((n) => n[0]).join('') : 'SJ'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase mb-1">
              <ShieldCheck className="w-3 h-3" /> Redux Toolkit State Integrity • {authUser?.role || 'Patient'}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {authUser?.name || 'Sarah Jenkins'} ({authUser?.id || 'PAT-9921'})
            </h1>
            <p className="text-xs text-slate-500">Email: {authUser?.email} • Primary Physician: Dr. Sarah Jenkins, MD</p>
          </div>
        </div>

        <Link
          to="/book-appointment"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase flex items-center justify-center space-x-1.5 shadow-sm transition-all active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>New Appointment</span>
        </Link>
      </div>

      {vitalsError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span><strong>Optimistic Rollback Triggered:</strong> {vitalsError}</span>
          </div>
        </div>
      )}

      {/* Health Vitals Tracker Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>Real-Time Health Vitals Sync</span>
            {vitalsStatus === 'loading' && <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVitalsModal(true)}
              className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold hover:bg-emerald-100"
            >
              + Log Vitals
            </button>
            <button
              onClick={handleTriggerSimulatedRollback}
              className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold hover:bg-amber-100"
            >
              Simulate Rollback Error
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-rose-500">
              <Heart className="w-5 h-5" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600">
                {vitals.heartRate > 100 ? 'HIGH' : 'NORMAL'}
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{vitals.heartRate} <span className="text-xs font-semibold text-slate-400">BPM</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">Resting Heart Rate</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-blue-500">
              <Activity className="w-5 h-5" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">OPTIMAL</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{vitals.bp} <span className="text-xs font-semibold text-slate-400">mmHg</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">Blood Pressure</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-emerald-500">
              <Droplet className="w-5 h-5" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">{vitals.spo2}% SpO2</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{vitals.spo2}% <span className="text-xs font-semibold text-slate-400">O2</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">Blood Oxygen Saturation</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-amber-500">
              <Thermometer className="w-5 h-5" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600">FASTING</span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{vitals.glucose} <span className="text-xs font-semibold text-slate-400">mg/dL</span></div>
              <div className="text-[11px] text-slate-500 mt-0.5">Blood Glucose Level</div>
            </div>
          </div>
        </div>
      </section>

      {/* Log Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 border shadow-xl">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Log Heart Rate Vitals</h3>
            <form onSubmit={handleUpdateHeartRate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">New Heart Rate (BPM)</label>
                <input
                  type="number"
                  required
                  value={newHeartRate}
                  onChange={(e) => setNewHeartRate(e.target.value)}
                  placeholder="e.g. 75"
                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Optimistic Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Appointments & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Upcoming Consultations ({appointments.length})
            </div>
          </h3>

          {appointments.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No upcoming appointments found.</div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-emerald-600">{apt.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {apt.status}
                    </span>
                    <button
                      onClick={() => dispatch(cancelAppointmentAsync(apt.id))}
                      className="text-rose-500 hover:text-rose-700"
                      title="Cancel Appointment"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{apt.doctorName}</div>
                <div className="text-slate-500 text-[11px]">{apt.specialty} • {apt.date} at {apt.timeSlot}</div>
                <div className="pt-2 flex gap-2">
                  {apt.meetingUrl ? (
                    <a
                      href={apt.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Video Call Room
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px] italic">In-Clinic Visit</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Digital Prescriptions ({prescriptions.length})
          </h3>

          {prescriptions.map((rx) => (
            <div key={rx.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{rx.medication}</span>
                <span className="text-[10px] text-slate-400">{rx.date}</span>
              </div>
              <div className="text-slate-500 text-[11px]">{rx.doctorName} • {rx.frequency}</div>
              <div className="pt-2 flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800 font-bold text-[11px] flex items-center gap-1.5">
                  <Download className="w-3 h-3" /> Download Digital Rx ({rx.id})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
