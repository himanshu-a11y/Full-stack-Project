import { forwardRef } from 'react';

const Card = forwardRef(({ children, className = '' }, ref) => (
  <div
    ref={ref}
    className={`bg-white rounded-xl border border-gray-100 shadow-card ${className}`}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

export default Card;
