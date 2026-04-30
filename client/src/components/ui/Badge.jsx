const variantMap = {
  blue:   'bg-blue-50/50 text-blue-600 border-blue-100/50 shadow-sm shadow-blue-500/5',
  green:  'bg-emerald-50/50 text-emerald-600 border-emerald-100/50 shadow-sm shadow-emerald-500/5',
  orange: 'bg-orange-50/50 text-orange-600 border-orange-100/50 shadow-sm shadow-orange-500/5',
  gray:   'bg-slate-50 text-slate-500 border-slate-100 shadow-sm shadow-slate-500/5',
  navy:   'bg-brand-navy/5 text-brand-navy border-brand-navy/10 shadow-sm shadow-brand-navy/5',
};

const Badge = ({ children, variant = 'gray', className = '' }) => (
  <span
    className={`
      inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border
      ${variantMap[variant] || variantMap.gray}
      ${className}
    `}
  >
    {children}
  </span>
);

export default Badge;

