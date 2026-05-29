import type { Meta, StoryObj } from '@storybook/react-vite';
import { MainHeader } from './MainHeader';

const meta: Meta<typeof MainHeader> = {
  title: 'Components/Hero Title',
  component: MainHeader,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className='min-h-[60vh] flex items-center justify-center px-6 py-20'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MainHeader>;

export const Glitch: Story = {};
