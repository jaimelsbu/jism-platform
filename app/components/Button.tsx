import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-6 py-3 font-medium text-sm transition-all duration-300 rounded-lg flex items-center gap-2 ${
        variant === 'primary'
          ? 'bg-brand-gradient text-black font-semibold hover:opacity-90 hover:shadow-[0_0_20px_rgba(173,198,255,0.4)]'
          : 'bg-surface-container-highest border border-white/10 hover:bg-white/5 text-white'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};