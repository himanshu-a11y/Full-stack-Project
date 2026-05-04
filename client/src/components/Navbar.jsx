import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './ui/Button';

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token'));
  const [role, setRole] = useState(localStorage.getItem('skillbridge_role'));
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem('skillbridge_token'));
      setRole(localStorage.getItem('skillbridge_role'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_role');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/home';
  };

  const navLinkClasses = ({ isActive }) => 
    `relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-blue ${
      isActive ? 'text-brand-blue' : 'text-slate-500'
    }`;

  const isDashboardArea = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/post-job') || 
                          location.pathname.includes('/candidates') ||
                          location.pathname.includes('/profile');

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100] flex items-center px-6 lg:px-12 justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-brand-blue text-white p-2 rounded-xl shadow-lg shadow-brand-blue/20 transition-transform duration-500 group-hover:rotate-12">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Skill<span className="text-brand-blue">Bridge</span>
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">Future of Work</span>
        </div>
      </Link>

      {/* Guest Navigation */}
      {!token && (
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/home" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Home
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <NavLink to="/jobs" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Browse Jobs
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-4">
            <Link to="/student/login">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest px-6">Student</Button>
            </Link>
            <Link to="/employer/login">
              <Button className="text-[10px] font-black uppercase tracking-widest px-8 shadow-xl shadow-brand-blue/20">Hire Talent</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Student Navigation */}
      {token && role === 'student' && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse"></span>
            <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest">Student Portal</span>
          </div>
          <NavLink to="/student/dashboard" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Dashboard
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <NavLink to="/student/profile" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Profile
                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-brand-blue rounded-full transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </>
            )}
          </NavLink>
          <NavLink to="/jobs" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Browse Jobs
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}

      {/* Employer Navigation */}
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
          <NavLink to="/employer/profile" className={navLinkClasses}>
            {({ isActive }) => (
              <>
                Profile
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}

      {/* Admin Navigation */}
      {token && role === 'admin' && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-rose-500 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
