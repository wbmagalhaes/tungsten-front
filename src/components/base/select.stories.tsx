import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Select>;

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'pineapple', label: 'Pineapple' },
];

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='Select a fruit' />
        </SelectTrigger>
        <SelectContent>
          {FRUITS.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('apple');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger size='sm' className='w-48'>
          <SelectValue placeholder='Select a fruit' />
        </SelectTrigger>
        <SelectContent>
          {FRUITS.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

export const Grouped: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className='w-48'>
          <SelectValue placeholder='Select a food' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value='apple'>Apple</SelectItem>
            <SelectItem value='banana'>Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value='carrot'>Carrot</SelectItem>
            <SelectItem value='potato'>Potato</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};
