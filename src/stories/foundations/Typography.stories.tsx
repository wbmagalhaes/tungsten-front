import type { Meta, StoryObj } from '@storybook/react-vite';

const ROLES: { role: string; token: string; family: string; usage: string }[] =
  [
    {
      role: 'Base',
      token: '--font-mono',
      family: 'Share Tech Mono',
      usage: 'Default font for all text and UI (font-mono class).',
    },
    {
      role: 'Display',
      token: '--font-cyber',
      family: 'Orbitron',
      usage: 'Titles and headings in the public layout (font-cyber class).',
    },
  ];

const SCALE: { cls: string; label: string }[] = [
  { cls: 'text-xs', label: 'text-xs' },
  { cls: 'text-sm', label: 'text-sm' },
  { cls: 'text-base', label: 'text-base' },
  { cls: 'text-lg', label: 'text-lg' },
  { cls: 'text-xl', label: 'text-xl' },
  { cls: 'text-2xl', label: 'text-2xl' },
  { cls: 'text-3xl', label: 'text-3xl' },
  { cls: 'text-5xl', label: 'text-5xl' },
];

function Type() {
  return (
    <div className='flex flex-col gap-12 max-w-4xl'>
      <div>
        <h2 className='text-xl font-cyber font-bold text-main-fg mb-1'>
          Type roles
        </h2>
        <p className='text-sm text-muted-fg mb-6'>
          The two system fonts. Tokens in{' '}
          <span className='font-mono'>@theme</span> of global.css.
        </p>
        <div className='flex flex-col divide-y divide-border'>
          {ROLES.map((r) => (
            <div key={r.token} className='py-5 flex flex-col gap-2'>
              <div className='flex items-baseline justify-between gap-4'>
                <span
                  className='text-4xl text-main-fg'
                  style={{ fontFamily: `var(${r.token})` }}
                >
                  Tungsten 0123
                </span>
                <span className='text-xs text-muted-fg shrink-0'>
                  {r.family}
                </span>
              </div>
              <div className='flex items-baseline gap-3'>
                <span className='text-sm font-medium text-main-fg'>
                  {r.role}
                </span>
                <span className='text-xs text-muted-fg'>{r.token}</span>
              </div>
              <span className='text-xs text-muted-fg'>{r.usage}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className='text-lg font-cyber font-semibold text-main-fg mb-1'>
          Type scale
        </h3>
        <p className='text-sm text-muted-fg mb-4'>
          Rendered in the base font (font-mono).
        </p>
        <div className='flex flex-col gap-3'>
          {SCALE.map((s) => (
            <div key={s.cls} className='flex items-baseline gap-4'>
              <span className='text-xs text-muted-fg w-20 shrink-0'>
                {s.label}
              </span>
              <span className={`${s.cls} text-main-fg font-mono`}>
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Type> = {
  title: 'Foundations/Typography',
  component: Type,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof Type>;

export const Fonts: Story = {};
