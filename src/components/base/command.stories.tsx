import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  FileText,
  FolderPlus,
  Search,
} from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './command';

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className='w-96 border-border border rounded-sm'>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Suggestions'>
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Settings'>
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Documents: Story = {
  render: () => (
    <Command className='w-96 border-border border rounded-sm'>
      <CommandInput placeholder='Search documents...' />
      <CommandList>
        <CommandEmpty>No documents found.</CommandEmpty>
        <CommandGroup heading='Actions'>
          <CommandItem>
            <FolderPlus />
            <span>New Folder</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileText />
            <span>New Document</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Recent'>
          <CommandItem>
            <FileText />
            <span>Roadmap 2026</span>
          </CommandItem>
          <CommandItem>
            <FileText />
            <span>Design Spec</span>
          </CommandItem>
          <CommandItem disabled>
            <Search />
            <span>Archived (unavailable)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Command className='w-96 border-border border rounded-sm'>
        <CommandInput
          placeholder='Filter fruit...'
          value={value}
          onValueChange={setValue}
        />
        <CommandList>
          <CommandEmpty>Nothing matches your search.</CommandEmpty>
          <CommandGroup heading='Fruit'>
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
            <CommandItem>Cherry</CommandItem>
            <CommandItem>Mango</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};
