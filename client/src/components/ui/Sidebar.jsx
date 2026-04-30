import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ links = [], title = '', roleBadge = null, user = null, activeLink = null }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_role');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/home';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Header (Visible only on mobile/tablet) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-[60] shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-brand-blue text-white p-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <span className="text-lg font-black text-slate-900 uppercase italic">Skill<span className="text-brand-blue">Bridge</span></span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 hover:text-brand-blue transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-[80] transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:z-50 h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Branding Section */}
        <div className="p-8 border-b border-slate-50 mb-6 flex items-center justify-between">
          <Link to="/" className="flex flex-col gap-1 group">
            <div className="flex items-center gap-3">
              <div className="bg-brand-blue text-white p-2 rounded-xl shadow-lg shadow-brand-blue/20 transition-all duration-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Skill<span className="text-brand-blue">Bridge</span>
              </span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-1">Professional</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-rose-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {title && (
          <p className="px-8 mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            {title}
          </p>
        )}

        {/* Navigation Area */}
        <nav className="flex flex-col gap-2 px-4 flex-1 overflow-y-auto scrollbar-hide">
          {links.map(({ label, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={!activeLink}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => {
                const isCurrentActive = activeLink === to || isActive;
                return `group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 ease-out
                ${isCurrentActive
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 -translate-y-0.5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1'
                  }`;
              }}
            >
              {({ isActive }) => {
                const isCurrentActive = activeLink === to || isActive;
                return (
                  <>
                    {icon && (
                      <span className={`transition-all duration-500 ${isCurrentActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
                        {icon}
                      </span>
                    )}
                    <span className="tracking-tight whitespace-nowrap">{label}</span>
                    {isCurrentActive && (
                      <div className="absolute left-0 w-1 h-6 bg-brand-blue rounded-r-full" />
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 mt-auto border-t border-slate-50 bg-slate-50/30">
          {roleBadge && (
            <div className={`mb-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all ${roleBadge.type === 'student' ? 'bg-blue-50 border-blue-100 text-brand-blue' : roleBadge.type === 'employer' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' : 'bg-purple-50 border-purple-100 text-purple-500'}`}>
              <span className={`h-2 w-2 rounded-full animate-pulse ${roleBadge.type === 'student' ? 'bg-brand-blue' : roleBadge.type === 'employer' ? 'bg-indigo-500' : 'bg-purple-500'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{roleBadge.label}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between gap-4 p-3.5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm group transition-all duration-500 hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-100 hover:bg-white hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {roleBadge?.type !== 'employer' && (
                <div className="w-11 h-11 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-sm shadow-lg shadow-brand-blue/20 transition-all duration-700 ease-out shrink-0">
                  {getInitials(user?.name)}
                </div>
              )}
              <p className={`text-[13px] font-black text-slate-900 uppercase tracking-[0.25em] group-hover:text-rose-600 transition-colors leading-none truncate ${roleBadge?.type === 'employer' ? 'ml-4' : ''}`}>
                Sign Out
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
