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
      className={` 
        bg-creme         /* your crème background */
        text-black       /* readable black text */
        inline-block
        font-display     /* Bebas Neue */
        uppercase        /* all-caps */
        font-bold
        py-2 px-4        /* padding */
        rounded
        transition ease-retro
        hover:shadow-retro
        focus:outline-none focus:ring-2 focus:ring-creme
        ${className}
      `}
    >
      {children}
    </button>
  );
}
