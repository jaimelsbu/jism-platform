// app/components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const base =
    'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60';

  const variants = {
    primary:
      'text-white hover:opacity-90 hover:shadow-[0_0_28px_rgba(78,140,255,0.45)]',
    secondary:
      'bg-transparent text-white border border-white/[0.14] hover:bg-white/[0.05] hover:border-blue-400/40',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={
        variant === 'primary'
          ? { background: 'linear-gradient(135deg, #4d8eff 0%, #9b59ff 100%)' }
          : undefined
      }
      {...props}
    >
      {children}
    </button>
  );
};
