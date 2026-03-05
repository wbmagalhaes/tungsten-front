import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';
import { Link } from 'react-router-dom';

const buttonVariants = cva(
  'group inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 select-none outline-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-main-gradient text-white hover:shadow-lg font-semibold',
        outline:
          'border border-border bg-background text-foreground hover:bg-secondary',
        secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted text-secondary-foreground',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/30 border border-destructive/30',
        link: 'text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline',
        glitch:
          'group relative text-ring hover:text-ring/80 overflow-hidden transition-all duration-150 underline-offset-4 hover:underline',
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
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot='button'
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {variant === 'glitch' ? <GlitchText>{children}</GlitchText> : children}
    </ButtonPrimitive>
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
      className={cn(className)}
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

        return (
          <Link {...buttonProps} {...state} to={to}>
            {variant === 'glitch' ? (
              <GlitchText>{children}</GlitchText>
            ) : (
              children
            )}
          </Link>
        );
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

function GlitchText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className='
        relative inline-block
        before:absolute before:inset-0
        before:pointer-events-none before:select-none
        before:opacity-0 before:content-[attr(data-text)]
        before:text-[#ff0040] before:translate-x-px
        before:mix-blend-screen

        after:absolute after:inset-0
        after:pointer-events-none after:select-none
        after:opacity-0 after:content-[attr(data-text)]
        after:text-[#00e5ff] after:-translate-x-px
        after:mix-blend-screen

        group-hover:before:animate-[tg-glitch-1_0.2s_steps(1)_1]
        group-hover:after:animate-[tg-glitch-2_0.2s_steps(1)_1]
      '
      data-text={children}
    >
      {children}
    </span>
  );
}

export { Button, ButtonLink };
