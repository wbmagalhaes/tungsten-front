import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Zap,
  Shield,
  Database,
  Cpu,
  Cloud,
  Lock,
  Gauge,
  Radio,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const COLORS = [
  'blue',
  'green',
  'orange',
  'purple',
  'yellow',
  'violet',
  'fuchsia',
  'cyan',
] as const;

const ICONS = [Zap, Shield, Database, Cpu, Cloud, Lock, Gauge, Radio];

const meta: Meta<typeof FeatureCard> = {
  title: 'Components/Feature Card',
  component: FeatureCard,
  parameters: { layout: 'centered' },
  argTypes: {
    color: { control: 'select', options: COLORS },
    icon: { control: false },
  },
  args: {
    icon: <Zap />,
    title: 'Realtime Streams',
    description: 'Low-latency event delivery across every node in the mesh.',
    color: 'cyan',
  },
};

export default meta;

type Story = StoryObj<typeof FeatureCard>;

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className='max-w-md'>
        <Story />
      </div>
    ),
  ],
};

export const AllAccents: Story = {
  render: () => (
    <div className='grid gap-4 sm:grid-cols-2 max-w-3xl'>
      {COLORS.map((color, i) => {
        const Icon = ICONS[i];
        return (
          <FeatureCard
            key={color}
            icon={<Icon />}
            color={color}
            title={`Accent ${color}`}
            description='Hover to see the accent glow and title shift.'
          />
        );
      })}
    </div>
  ),
};
