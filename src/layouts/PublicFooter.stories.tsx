import type { Meta, StoryObj } from '@storybook/react-vite';
import { PublicFooter } from './PublicLayout';
import '@styles/layout.css';

const meta: Meta<typeof PublicFooter> = {
  title: 'Layout/Public Footer',
  component: PublicFooter,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof PublicFooter>;

export const Default: Story = {};
