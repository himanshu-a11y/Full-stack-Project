const config = {
  error: {
    wrap: 'bg-red-50 border border-red-200 text-red-700',
    icon: (
      <svg className="h-4 w-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0V9a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  success: {
    wrap: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    icon: (
      <svg className="h-4 w-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  info: {
    wrap: 'bg-blue-50 border border-blue-200 text-blue-700',
    icon: (
      <svg className="h-4 w-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
      </svg>
    ),
  },
};

const Alert = ({ children, variant = 'info', className = '' }) => {
  if (!children) return null;
  const { wrap, icon } = config[variant] || config.info;
  return (
    <div className={`flex gap-2.5 items-start p-3.5 rounded-lg text-sm ${wrap} ${className}`}>
      {icon}
      <span>{children}</span>
    </div>
  );
};

export default Alert;
