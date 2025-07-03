import { type InputHTMLAttributes, forwardRef } from 'react';
import { WarningIcon } from '../assets/warning';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const baseStyles =
  'block w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none transition';

const states = {
  default: 'border-gray-200 bg-white',
  active: 'border-blue-base bg-white ring-1 ring-blue-base',
  error: 'border-danger bg-white ring-1 ring-danger',
  disabled: 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', disabled, ...props }, ref) => {
    return (
      <div className={`w-full max-w-xs flex flex-col gap-1`}>
        <label className='text-xs font-medium text-gray-700 mb-1'>
          {label}
        </label>
        <input
          ref={ref}
          className={
            `${baseStyles} ` +
            (disabled
              ? states.disabled
              : error
              ? states.error
              : states.default) +
            ` focus:${error ? states.error : states.active} ` +
            className
          }
          disabled={disabled}
          {...props}
        />
        {error && (
          <div className='flex items-center gap-1 mt-1 text-xs text-danger'>
            <WarningIcon color='#b12c4d' width={20} height={20} />
            <small>{error}</small>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
