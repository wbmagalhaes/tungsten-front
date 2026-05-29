import type { Meta, StoryObj } from '@storybook/react-vite';

const FONTS: { token: string; name: string; family: string }[] = [
  { token: '--font-cyber', name: 'cyber', family: 'Orbitron' },
  { token: '--font-mono-tech', name: 'mono-tech', family: 'Share Tech Mono' },
  { token: '--font-russo', name: 'russo', family: 'Russo One' },
  { token: '--font-black-ops', name: 'black-ops', family: 'Black Ops One' },
  { token: '--font-vt', name: 'vt', family: 'VT323' },
  { token: '--font-chakra', name: 'chakra', family: 'Chakra Petch' },
  { token: '--font-raj', name: 'raj', family: 'Rajdhani' },
  { token: '--font-nova', name: 'nova', family: 'Nova Mono' },
  { token: '--font-mono', name: 'mono', family: 'Share Tech Mono (alias)' },
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
    <div className='flex flex-col gap-10 max-w-4xl'>
      <div>
        <h2 className='text-xl font-cyber font-bold text-main-fg mb-1'>Font families</h2>
        <p className='text-sm text-muted-fg mb-6'>
          Tokens definidos no <span className='font-mono'>@theme</span> de global.css.
        </p>
        <div className='flex flex-col divide-y divide-border'>
          {FONTS.map((f) => (
            <div key={f.token} className='py-5 flex flex-col gap-1'>
              <div className='flex items-baseline justify-between gap-4'>
                <span
                  className='text-3xl text-main-fg'
                  style={{ fontFamily: `var(${f.token})` }}
                >
                  Tungsten 0123
                </span>
                <span className='text-xs text-muted-fg shrink-0'>{f.family}</span>
              </div>
              <span className='text-xs text-muted-fg'>
                font-{f.name} · {f.token}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className='text-lg font-cyber font-semibold text-main-fg mb-4'>Type scale</h3>
        <div className='flex flex-col gap-3'>
          {SCALE.map((s) => (
            <div key={s.cls} className='flex items-baseline gap-4'>
              <span className='text-xs text-muted-fg w-20 shrink-0'>{s.label}</span>
              <span className={`${s.cls} text-main-fg font-cyber`}>The quick brown fox</span>
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
