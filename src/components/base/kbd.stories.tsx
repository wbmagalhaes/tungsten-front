import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, KbdGroup } from './kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Components/Kbd',
  component: Kbd,
  parameters: { layout: 'centered' },
  args: {
    children: 'K',
  },
};

export default meta;

type Story = StoryObj<typeof Kbd>;

export const Playground: Story = {};

export const Keys: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Shift</Kbd>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span className='text-muted-fg text-xs'>+</span>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};
