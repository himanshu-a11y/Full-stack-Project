const Input = ({
  label,
  error,
  id,
  className = '',
  inputClassName = '',
  ...rest
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent
          transition duration-150
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}
          ${inputClassName}
        `}
        {...rest}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
