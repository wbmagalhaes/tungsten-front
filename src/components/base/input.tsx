import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '@utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <InputPrimitive
      type={type}
      data-slot='input'
      className={cn(
        'w-full min-w-0 h-10 px-3 py-2 text-sm bg-input border border-border rounded-sm text-main-fg placeholder-gray-500 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
        'disabled:bg-background disabled:text-muted-fg disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-main-fg',
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
