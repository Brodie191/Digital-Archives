import * as React from 'react';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    {...props}              // here's where onClick, aria-*, etc. get passed through
  >
    {children}
  </div>
));

Card.displayName = 'Card';