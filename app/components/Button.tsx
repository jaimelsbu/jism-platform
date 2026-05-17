// app/components/Button.tsx
import React from 'react';

type BaseProps = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  href?: string;           // if provided, renders as <a>
  style?: React.CSSProperties;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  style,
  ...props
}: ButtonProps) => {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const base =
    'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 no-underline';

  const variants = {
    primary:
      'text-white hover:opacity-90 hover:shadow-[0_0_28px_rgba(78,140,255,0.45)]',
    secondary:
      'bg-transparent text-white border border-white/[0.14] hover:bg-white/[0.05] hover:border-blue-400/40',
  };

  const combinedClassName = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const combinedStyle =
    variant === 'primary'
      ? { background: 'linear-gradient(135deg, #4d8eff 0%, #9b59ff 100%)', ...style }
      : style;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        style={combinedStyle}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClassName}
      style={combinedStyle}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};
