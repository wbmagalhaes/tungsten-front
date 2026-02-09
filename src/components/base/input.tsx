import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '@utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot='input'
      className={cn(
        'w-full min-w-0 h-10 px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent',
        'disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-red-600 aria-invalid:ring-2 aria-invalid:ring-red-600/20',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-200',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
