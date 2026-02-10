import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';
import { Link } from 'react-router-dom';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none outline-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-main-gradient text-white hover:shadow-lg font-semibold',
        outline:
          'border border-border bg-background text-foreground hover:bg-secondary',
        secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted text-secondary-foreground',
        destructive:
          'bg-destructive/20 text-red-400 hover:bg-destructive/30 border border-destructive/30',
        link: 'text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 gap-2 [&_svg:not([class*="size-"])]:size-4',
        sm: 'h-8 px-3 py-1.5 gap-1.5 text-xs [&_svg:not([class*="size-"])]:size-3.5',
        lg: 'h-12 px-6 py-3 gap-2.5 text-base [&_svg:not([class*="size-"])]:size-5',
        icon: 'size-10 p-0 [&_svg:not([class*="size-"])]:size-4',
        'icon-sm': 'size-8 p-0 [&_svg:not([class*="size-"])]:size-3.5',
        'icon-lg': 'size-12 p-0 [&_svg:not([class*="size-"])]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot='button'
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

interface ButtonLinkProps
  extends
    Omit<ButtonPrimitive.Props, 'nativeButton'>,
    VariantProps<typeof buttonVariants> {
  to: string;
}

function ButtonLink({
  to,
  children,
  variant,
  size,
  className,
  render,
  ...props
}: ButtonLinkProps) {
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      nativeButton={false}
      render={(buttonProps, state) => {
        if (render) {
          return typeof render === 'function' ? (
            <Link to={to}>{render(buttonProps, state)}</Link>
          ) : (
            <Link to={to}>{render}</Link>
          );
        }

        return <Link {...buttonProps} {...state} to={to} />;
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export { Button, ButtonLink };
