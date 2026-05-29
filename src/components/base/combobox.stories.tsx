import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from './combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Combobox>;

const FRAMEWORKS = [
  'React',
  'Vue',
  'Svelte',
  'Angular',
  'Solid',
  'Qwik',
  'Preact',
];

export const Playground: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <Combobox items={FRAMEWORKS} value={value} onValueChange={setValue}>
        <ComboboxInput placeholder='Select a framework' className='w-64' />
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

export const WithClear: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('React');
    return (
      <Combobox items={FRAMEWORKS} value={value} onValueChange={setValue}>
        <ComboboxInput
          placeholder='Select a framework'
          className='w-64'
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};
