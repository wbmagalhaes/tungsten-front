import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Boxes,
  Server,
  Cog,
  Network,
  HardDrive,
  Workflow,
  Layers,
  Cpu,
} from 'lucide-react';
import { StackCard } from './StackCard';

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

const ICONS = [Boxes, Server, Cog, Network, HardDrive, Workflow, Layers, Cpu];

const meta: Meta<typeof StackCard> = {
  title: 'Components/Stack Card',
  component: StackCard,
  parameters: { layout: 'centered' },
  argTypes: {
    color: { control: 'select', options: COLORS },
    icon: { control: false },
  },
  args: {
    icon: <Boxes className='w-7 h-7' />,
    title: 'Containers',
    description: 'Orchestration',
    color: 'violet',
  },
};

export default meta;

type Story = StoryObj<typeof StackCard>;

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className='w-48'>
        <Story />
      </div>
    ),
  ],
};

export const AllAccents: Story = {
  render: () => (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl'>
      {COLORS.map((color, i) => {
        const Icon = ICONS[i];
        return (
          <StackCard
            key={color}
            icon={<Icon className='w-7 h-7' />}
            color={color}
            title={color}
            description='module'
          />
        );
      })}
    </div>
  ),
};
