import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SPECIALTIES, DOCTORS } from '../data/healthcareData';
import { DoctorCard } from '../components/DoctorCard';
import { useGetDoctorsQuery } from '../store/doctorsApi';
import { Search, Filter, X, ChevronDown, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Doctors() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSpec = queryParams.get('specialty') || 'All';

  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpec);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // RTK Query hook consuming cached store data
  const { data: doctors = [], isLoading, isFetching } = useGetDoctorsQuery({
    specialty: selectedSpecialty === 'All' ? undefined : selectedSpecialty,
    search: searchQuery
  });

  const handleSelectDoctor = (doctor) => {
    navigate('/book-appointment', { state: { doctor } });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> RTK Query Cached Directory
            {isFetching && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Find &amp; Book Specialists ({doctors.length})
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, hospitals..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2.5 sm:py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="sm:hidden px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 flex-shrink-0 active:scale-95"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 snap-x snap-mandatory">
        <button
          onClick={() => setSelectedSpecialty('All')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 snap-start active:scale-95 ${
            selectedSpecialty === 'All'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          All Specialties ({DOCTORS.length})
        </button>

        {SPECIALTIES.map((spec) => (
          <button
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec.name)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 snap-start active:scale-95 ${
              selectedSpecialty === spec.name
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {spec.name}
          </button>
        ))}
      </div>

      {/* Mobile Specialty Select Drawer */}
      {isCategoryModalOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="relative w-full bg-white dark:bg-slate-800 rounded-t-3xl p-5 shadow-2xl z-10 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" /> Select Medical Specialty
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  setSelectedSpecialty('All');
                  setIsCategoryModalOpen(false);
                }}
                className={`w-full p-3 rounded-xl text-left font-bold text-xs flex items-center justify-between ${
                  selectedSpecialty === 'All'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>All Specialties</span>
                <span>({DOCTORS.length})</span>
              </button>

              {SPECIALTIES.map((spec) => {
                const isSel = selectedSpecialty === spec.name;
                return (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpecialty(spec.name);
                      setIsCategoryModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left font-bold text-xs flex items-center justify-between ${
                      isSel
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{spec.name}</span>
                    <span className={isSel ? 'text-white' : 'text-slate-400'}>({spec.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        /* Doctor Grid - 2 columns on Mobile */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} onSelectDoctor={handleSelectDoctor} />
          ))}
        </div>
      )}
    </div>
  );
}
