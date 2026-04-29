const variantMap = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  green:  'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  gray:   'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  navy:   'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
};

const Badge = ({ children, variant = 'gray', className = '' }) => (
  <span
    className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variantMap[variant] || variantMap.gray}
      ${className}
    `}
  >
    {children}
  </span>
);

export default Badge;
