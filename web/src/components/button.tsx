import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

const baseStyles =
  'w-full max-w-xs flex items-center justify-center gap-2 rounded-md px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

const variants = {
  primary: {
    default: 'bg-blue-base text-white hover:bg-blue-dark cursor-pointer',
    disabled: 'bg-blue-base text-white opacity-50 cursor-not-allowed',
  },
  secondary: {
    default:
      'bg-gray-200 text-gray-500 border border-transparent hover:border-blue-700',
    disabled:
      'bg-gray-200 text-gray-400 border border-transparent opacity-50 cursor-not-allowed',
  },
};

export function Button({ variant = 'primary', icon, ...props }: ButtonProps) {
  const state = props.disabled ? 'disabled' : 'default';
  const variantClass = variants[variant][state];

  return (
    <button className={`${baseStyles} ${variantClass} ${props.className}`}>
      {icon && <span className='mr-2 flex items-center'>{icon}</span>}
      {props.children}
    </button>
  );
}

export default Button;
