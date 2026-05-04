import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem('skillbridge_role'));
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinDropdownOpen, setJoinDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (joinDropdownOpen && !event.target.closest('.join-dropdown-container')) {
        setJoinDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [joinDropdownOpen]);

  const navLinkClasses = ({ isActive }) =>
    `relative text-sm font-bold tracking-tight px-4 py-2 transition-all duration-300 group hover:-translate-y-1 hover:scale-105 active:scale-95 ${isActive ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'
    }`;

  const ActiveIndicator = () => (
    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform origin-left transition-transform duration-300"></span>
  );

  const NavItems = () => (
    <>
      {/* Removed Browse Jobs from here as it's now in the Sidebar */}

      {!token && (
        <>
          {/* Redundant individual links removed - Options are now in Join Platform dropdown */}
          <div className="ml-4 pl-4 border-l border-slate-200 relative join-dropdown-container">
            <button
              onClick={() => setJoinDropdownOpen(!joinDropdownOpen)}
              className="bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Join Platform
              <svg className={`w-3 h-3 transition-transform duration-300 ${joinDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Premium Join Dropdown */}
            <div className={`absolute right-0 mt-3 w-56 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 origin-top-right z-[110] ${joinDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="p-2 space-y-1">
                <Link
                  to="/student/register"
                  onClick={() => setJoinDropdownOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-brand-blue transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Student</span>
                </Link>
                <Link
                  to="/employer/register"
                  onClick={() => setJoinDropdownOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Employer</span>
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setJoinDropdownOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-600 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {token && role === 'student' && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse"></span>
            <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest">Student Portal</span>
          </div>
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
            className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-rose-50 hover:text-rose-600 transition-all group shadow-sm border border-slate-100 active:scale-95"
          >
            <span>Sign Out</span>
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}

      {token && role === 'employer' && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Employer Hub</span>
          </div>
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
            className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-rose-50 hover:text-rose-600 transition-all group shadow-sm border border-slate-100 active:scale-95"
          >
            <span>Sign Out</span>
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}

      {token && role === 'admin' && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Admin Panel</span>
          </div>
          <NavLink to="/admin/dashboard" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Admin Dash
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-rose-50 hover:text-rose-600 transition-all group shadow-sm border border-slate-100 active:scale-95"
          >
            <span>Sign Out</span>
            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
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
