import { NavLink } from 'react-router-dom';

const Sidebar = ({ links = [], title = '', footer = null }) => {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-[calc(100vh-64px)] py-6 px-3">
      {title && (
        <p className="px-3 mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {title}
        </p>
      )}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
              ${isActive
                ? 'bg-brand-light text-brand-navy font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {icon && <span className="text-lg leading-none">{icon}</span>}
            {label}
          </NavLink>
        ))}
      </nav>
      {footer && <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>}
    </aside>
  );
};

export default Sidebar;
