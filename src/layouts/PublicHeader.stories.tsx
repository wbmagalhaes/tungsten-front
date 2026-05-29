import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { PublicHeader } from './PublicLayout';
import '@styles/layout.css';

const meta: Meta<typeof PublicHeader> = {
  title: 'Layout/Public Header',
  component: PublicHeader,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className='min-h-[40vh]'>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PublicHeader>;

export const Default: Story = {};
