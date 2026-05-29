import type { Meta, StoryObj } from '@storybook/react-vite';

const PAIRS: { name: string; bg: string; fg?: string }[] = [
  { name: 'background', bg: '--color-background', fg: '--color-main-fg' },
  { name: 'card', bg: '--color-card', fg: '--color-card-fg' },
  { name: 'popover', bg: '--color-popover', fg: '--color-popover-fg' },
  { name: 'primary', bg: '--color-primary', fg: '--color-primary-fg' },
  { name: 'secondary', bg: '--color-secondary', fg: '--color-secondary-fg' },
  { name: 'muted', bg: '--color-muted', fg: '--color-muted-fg' },
  { name: 'accent', bg: '--color-accent', fg: '--color-accent-fg' },
  { name: 'destructive', bg: '--color-destructive', fg: '--color-destructive-fg' },
  { name: 'success', bg: '--color-success', fg: '--color-success-fg' },
  { name: 'warning', bg: '--color-warning', fg: '--color-warning-fg' },
  { name: 'info', bg: '--color-info', fg: '--color-info-fg' },
];

const SOLIDS = ['--color-border', '--color-input', '--color-ring'];

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className='flex flex-col gap-2'>
      <div
        className='h-20 w-full rounded-sm border border-border shadow-inner'
        style={{ background: `var(${token})` }}
      />
      <div className='flex flex-col'>
        <span className='text-sm text-main-fg'>{label}</span>
        <span className='text-xs text-muted-fg'>{token}</span>
      </div>
    </div>
  );
}

function PairSwatch({ name, bg, fg }: { name: string; bg: string; fg?: string }) {
  return (
    <div className='flex flex-col gap-2'>
      <div
        className='h-20 w-full rounded-sm border border-border flex items-center justify-center'
        style={{ background: `var(${bg})`, color: fg ? `var(${fg})` : undefined }}
      >
        {fg && <span className='text-sm font-medium'>{name}-fg</span>}
      </div>
      <div className='flex flex-col'>
        <span className='text-sm text-main-fg'>{name}</span>
        <span className='text-xs text-muted-fg'>{bg}</span>
      </div>
    </div>
  );
}

function Palette() {
  return (
    <div className='flex flex-col gap-10 max-w-5xl'>
      <div>
        <h2 className='text-xl font-cyber font-bold text-main-fg mb-1'>Color tokens</h2>
        <p className='text-sm text-muted-fg mb-6'>
          Switching the theme in the toolbar (Cyberpunk / Dark / Light / Neon) updates every value.
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
          {PAIRS.map((p) => (
            <PairSwatch key={p.name} {...p} />
          ))}
        </div>
      </div>
      <div>
        <h3 className='text-lg font-cyber font-semibold text-main-fg mb-4'>Utility</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
          {SOLIDS.map((token) => (
            <Swatch key={token} token={token} label={token.replace('--color-', '')} />
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Palette> = {
  title: 'Foundations/Colors',
  component: Palette,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof Palette>;

export const Palette_: Story = { name: 'Palette' };
