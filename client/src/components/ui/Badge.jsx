const variantMap = {
  blue:   'bg-blue-50 text-blue-700 border border-blue-200',
  green:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200',
  gray:   'bg-gray-100 text-gray-600 border border-gray-200',
  navy:   'bg-indigo-50 text-indigo-800 border border-indigo-200',
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
