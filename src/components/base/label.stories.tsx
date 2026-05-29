import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail } from 'lucide-react';
import { Label } from './label';
import { Input } from './input';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  args: {
    children: 'Email address',
  },
  decorators: [(Story) => <div className='w-72'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Playground: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className='flex flex-col gap-1'>
      <Label htmlFor='label-email'>Email address</Label>
      <Input id='label-email' type='email' placeholder='you@example.com' />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Label>
      <Mail className='size-4' />
      Email address
    </Label>
  ),
};
