import { HomeIcon, PlusIcon, SearchIcon } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@components/base/command';
import { useState } from 'react';
import { Button } from '@components/base/button';
import { Kbd, KbdGroup } from '@components/base/kbd';
import { useHotkeys } from '@hooks/use-hotkeys';
import { useIsMobile } from '@hooks/use-mobile';

export function HeaderCommands() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useHotkeys('ctrl+k', () => setOpen(true));

  return (
    <div>
      <Button
        className='md:border md:border-gray-500'
        onClick={() => setOpen(true)}
      >
        <SearchIcon className='h-4 w-4 text-muted-foreground' />
        {!isMobile && (
          <>
            <span>Search or type a command...</span>
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>K</Kbd>
            </KbdGroup>
          </>
        )}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} className='bg-gray-200'>
        <Command>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Navigation'>
              <CommandItem>
                <HomeIcon />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Actions'>
              <CommandItem>
                <PlusIcon />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
