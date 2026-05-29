import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Playground: Story = {
  render: (args) => (
    <div className='w-64'>
      <Separator {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className='flex w-64 flex-col gap-3 text-sm'>
      <span>Profile</span>
      <Separator orientation='horizontal' />
      <span>Settings</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className='flex h-8 items-center gap-3 text-sm'>
      <span>Docs</span>
      <Separator orientation='vertical' />
      <span>Source</span>
      <Separator orientation='vertical' />
      <span>About</span>
    </div>
  ),
};
