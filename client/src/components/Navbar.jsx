import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './ui/Button';


const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem('skillbridge_role'));
  const [token, setToken] = useState(localStorage.getItem('skillbridge_token'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    `text-sm font-medium transition-colors hover:text-white ${
      isActive ? 'text-white' : 'text-gray-300'
    }`;

  const NavItems = () => (
    <>
      <NavLink to="/jobs" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
        Browse Jobs
      </NavLink>
      
      {!token && (
        <>
          <NavLink to="/student/login" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
            Student Login
          </NavLink>
          <div className="h-4 w-px bg-white/20 hidden md:block"></div>
          <NavLink to="/employer/login" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
            Employer Login
          </NavLink>
        </>
      )}

      {token && role === 'student' && (
        <>
          <NavLink to="/student/profile" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
            My Profile
          </NavLink>
          <Button variant="outline" onClick={handleLogout} className="ml-2 !py-1.5 border-white/30 text-white hover:bg-white/10">
            Logout
          </Button>
        </>
      )}

      {token && role === 'employer' && (
        <>
          <NavLink to="/employer/dashboard" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
            Employer Dashboard
          </NavLink>
          <Button variant="outline" onClick={handleLogout} className="ml-2 !py-1.5 border-white/30 text-white hover:bg-white/10">
            Logout
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white/10 text-white p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SkillBridge</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavItems />
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
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
        <div className="md:hidden border-t border-white/10 bg-brand-navy">
          <div className="px-4 pt-2 pb-4 space-y-3 flex flex-col">
            <NavItems />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;