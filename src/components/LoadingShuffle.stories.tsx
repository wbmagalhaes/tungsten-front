import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingShuffle } from './LoadingShuffle';

const meta: Meta<typeof LoadingShuffle> = {
  title: 'Components/Loading Shuffle',
  component: LoadingShuffle,
  parameters: { layout: 'centered' },
  argTypes: {
    isLoading: { control: 'boolean' },
    speed: { control: { type: 'range', min: 5, max: 60, step: 1 } },
  },
  args: {
    target: 'LOADING SYSTEM',
    isLoading: true,
    speed: 20,
  },
  decorators: [
    (Story) => (
      <div className='text-2xl font-mono text-ring tracking-widest'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LoadingShuffle>;

export const Loading: Story = {};

export const Resolved: Story = {
  args: { isLoading: false },
};
