import { NavLink } from 'react-router-dom';

const Sidebar = ({ links = [], title = '', footer = null }) => {
  return (
    <aside className="w-64 lg:w-72 shrink-0 flex flex-col bg-white/40 backdrop-blur-xl border-r border-slate-200/50 min-h-[calc(100vh-80px)] py-10 px-6 sticky top-20">
      {title && (
        <p className="px-4 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          {title}
        </p>
      )}
      <nav className="flex flex-col gap-3 flex-1">
        {links.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-400 ease-out
              ${isActive
                ? 'bg-white text-brand-blue shadow-card shadow-brand-blue/5 translate-x-1'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60 hover:translate-x-1 hover:shadow-soft'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Bar */}
                <div className={`absolute left-0 w-1 bg-brand-blue rounded-full transition-all duration-500 ease-spring ${isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}></div>
                
                {icon && (
                  <span className={`transition-all duration-300 ${isActive ? 'text-brand-blue scale-110' : 'text-slate-400 group-hover:text-brand-blue group-hover:scale-110'}`}>
                    {icon}
                  </span>
                )}
                <span className="relative z-10 tracking-tight">{label}</span>

                {/* Subtle Glow for Active */}
                {isActive && (
                  <div className="absolute inset-0 bg-brand-blue/5 rounded-2xl blur-md -z-10"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {footer && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
