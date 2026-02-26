import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 justify-center w-fit whitespace-nowrap shrink-0 px-2 py-1 rounded-xs text-xs font-medium transition-all [&>svg]:size-3 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-[color-mix(in_srgb,var(--color-info)_15%,transparent)] text-[var(--color-info)] border border-[color-mix(in_srgb,var(--color-info)_40%,transparent)]',
        secondary:
          'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-transparent',
        success:
          'bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_40%,transparent)]',
        warning:
          'bg-[color-mix(in_srgb,var(--color-warning)_15%,transparent)] text-[var(--color-warning)] border border-[color-mix(in_srgb,var(--color-warning)_40%,transparent)]',
        destructive:
          'bg-[color-mix(in_srgb,var(--color-destructive)_15%,transparent)] text-[var(--color-destructive)] border border-[color-mix(in_srgb,var(--color-destructive)_40%,transparent)]',
        purple:
          'bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)] border border-[color-mix(in_srgb,var(--color-primary)_40%,transparent)]',
        outline:
          'bg-transparent text-[var(--color-secondary-foreground)] border border-[var(--color-border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge };
