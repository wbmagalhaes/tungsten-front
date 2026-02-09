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
import { Kbd, KbdGroup } from '@components/base/kbd';
import { useHotkeys } from '@hooks/use-hotkeys';
import { useIsMobile } from '@hooks/use-mobile';
import { Button } from '@components/base/button';

export function HeaderCommands() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useHotkeys('ctrl+k', () => setOpen(true));

  return (
    <>
      <div className='flex gap-2 bg-input hover:bg-background border border-border rounded-sm'>
        <Button
          variant='ghost'
          size='sm'
          className='bg-transparent hover:bg-transparent'
          onClick={() => setOpen(true)}
        >
          <SearchIcon className='size-4' />
          {!isMobile && <>Search or type a command...</>}
          {!isMobile && (
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <span>+</span>
              <Kbd>K</Kbd>
            </KbdGroup>
          )}
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
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
    </>
  );
}
