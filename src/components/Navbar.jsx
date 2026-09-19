import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setMobileMenuOpen } from '../store/uiSlice';
import { 
  Home, 
  Stethoscope, 
  Calendar, 
  Pill, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  PhoneCall,
  HeartPulse,
  ShoppingBag
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.ui.theme);
  const isMobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const cartItems = useSelector((state) => state.pharmacy.cartItems);
  const appointments = useSelector((state) => state.appointments.appointments);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/doctors', label: 'Find Doctors', icon: Stethoscope },
    { path: '/book-appointment', label: 'Book Consult', icon: Calendar, badge: appointments.length },
    { path: '/pharmacy', label: 'Pharmacy & Labs', icon: Pill, badge: cartCount },
    { path: '/patient-portal', label: 'Patient Portal', icon: User }
  ];

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => dispatch(setMobileMenuOpen(!isMobileMenuOpen))}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  MEDIPULSE<span className="text-emerald-600">HEALTHCARE</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5 truncate max-w-[170px] sm:max-w-none">
                  Redux Toolkit State Integrity • Telemedicine Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-extrabold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
            {/* 24/7 Hotline Badge */}
            <div className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold hidden sm:flex items-center gap-1.5">
              <PhoneCall className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>RTK Global State Active</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* Book Consult Header Button */}
            <Link
              to="/book-appointment"
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase items-center space-x-1.5 shadow-sm transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Doctor</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          />
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-800 h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">MEDIPULSE MENU</span>
              </div>
              <button 
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-1 overflow-y-auto flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Healthcare Services</div>
              {navLinks.map((link) => {
                const IconComp = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComp className="w-4 h-4 text-emerald-500" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        {link.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Theme</span>
                <button
                  onClick={handleToggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> HIPAA Compliant Telemedicine Platform
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App-Style Fixed Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5 px-2 shadow-2xl flex items-center justify-around">
        {navLinks.map((link) => {
          const IconComp = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <IconComp className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full bg-emerald-600 text-white text-[8px] font-bold leading-tight">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-none">
                {link.label.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
