const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-xl border border-gray-100 shadow-card ${className}`}
  >
    {children}
  </div>
);

export default Card;
