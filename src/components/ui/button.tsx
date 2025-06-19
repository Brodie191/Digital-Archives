import React from 'react';

export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded font-medium ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
