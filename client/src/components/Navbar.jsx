import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem('skillbridge_role'));
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboardArea = location.pathname.startsWith('/student/') || location.pathname === '/jobs';

  useEffect(() => {
    const syncAuth = () => {
      setRole(localStorage.getItem('skillbridge_role'));
      setToken(localStorage.getItem('skillbridge_token'));
    };
    window.addEventListener('storage', syncAuth);
    window.addEventListener('auth-change', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('auth-change', syncAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_role');
    setToken(null);
    setRole(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }) =>
    `relative text-sm font-bold tracking-tight px-4 py-2 transition-all duration-300 group hover:-translate-y-1 hover:scale-105 active:scale-95 ${isActive ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'
    }`;

  const ActiveIndicator = () => (
    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform origin-left transition-transform duration-300"></span>
  );

  const NavItems = () => (
    <>
      {(!token || role !== 'student') && (
        <NavLink to="/jobs" className={navLinkClasses}>
          {({ isActive }) => (
            <>
              Browse Jobs
              <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
            </>
          )}
        </NavLink>
      )}

      {!token && (
        <>
          <NavLink to="/student/login" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                For Students
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <NavLink to="/employer/login" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Employers
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <div className="ml-4 pl-4 border-l border-slate-200">
            <Link to="/student/register">
              <button className="bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Join Platform
              </button>
            </Link>
          </div>
        </>
      )}

      {token && role === 'student' && (
        <div className="flex items-center gap-6">
          {!isDashboardArea && (
            <NavLink to="/student/dashboard" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  Go to Dashboard
                  <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </>
              )}
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 px-6 py-2.5 rounded-full border border-rose-100 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            Sign Out
          </button>
        </div>
      )}

      {token && role === 'employer' && (
        <>
          <NavLink to="/employer/dashboard" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Dashboard
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="ml-4 text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 px-4 py-2 rounded-full border border-rose-100"
          >
            Sign Out
          </button>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="bg-brand-blue text-white p-2.5 rounded-2xl shadow-lg shadow-brand-blue/30 group-hover:rotate-[10deg] transition-all duration-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Skill<span className="text-brand-blue">Bridge</span></span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">Professional</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            <NavItems />
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-brand-blue focus:outline-none p-2 bg-slate-50 rounded-xl transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-4 pb-10 space-y-4 flex flex-col items-center text-center">
            <NavItems />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
