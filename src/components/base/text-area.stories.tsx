import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from './text-area';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
  args: {
    placeholder: 'Enter your message',
    disabled: false,
  },
  decorators: [(Story) => <div className='w-80'><Story /></div>],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        placeholder='Write a comment'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
      />
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Disabled content' },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, value: 'Invalid content' },
};
