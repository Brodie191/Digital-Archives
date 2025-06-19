// src/components/ui/button.tsx
import * as React from 'react';

export function Button({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      {...props}
      className={`bg-creme text-black inline-block font-display uppercase font-bold py-2 px-4 rounded transition ease-retro hover:shadow-retro ${className}`}
    >
      {children}
    </button>
  );
}