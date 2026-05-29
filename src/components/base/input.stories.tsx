import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    type: 'text',
    placeholder: 'Enter value',
    disabled: false,
  },
  decorators: [(Story) => <div className='w-72'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        placeholder='Type something'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Disabled value' },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, value: 'Invalid value' },
};

export const Types: Story = {
  render: () => (
    <div className='flex flex-col gap-3'>
      <Input type='text' placeholder='Text' />
      <Input type='email' placeholder='Email' />
      <Input type='password' placeholder='Password' />
      <Input type='number' placeholder='Number' />
      <Input type='search' placeholder='Search' />
    </div>
  ),
};
