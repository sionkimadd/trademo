import { ButtonHTMLAttributes } from 'react';
import { THEME } from '../../constants/colors';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'buy' | 'sell' | 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const sizeClasses = {
  xs: 'btn-xs h-7 px-1 text-xs',
  sm: 'btn-sm h-10 px-4',
  md: 'btn-md h-12 px-6',
  lg: 'btn-lg h-14 px-8'
};

const variantClasses = {
  buy: `${THEME.action.buy.class} text-white`,
  sell: `${THEME.action.sell.class} text-white`,
  primary: `${THEME.action.buy.class} text-white`,
  secondary: `bg-[${THEME.chart.grid}] hover:bg-[${THEME.chart.border}] text-gray-300`
};

export default function Button({ 
  variant, 
  size = 'sm', 
  loading = false, 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`btn border-none rounded-md min-h-0 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="loading loading-spinner loading-xs"></span> : children}
    </button>
  );
} 