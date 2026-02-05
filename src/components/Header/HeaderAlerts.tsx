import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@components/base/button';
import { Kbd, KbdGroup } from '@components/base/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@components/base/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@components/base/popover';
import { useHotkeys } from '@hooks/use-hotkeys';

export function HeaderAlerts() {
  const [open, setOpen] = useState(false);

  useHotkeys('ctrl+.', () => setOpen(true));

  return (
    <Tooltip>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button onClick={() => setOpen(true)}>
                  <BellIcon />
                </Button>
              }
            />
          }
        />

        <PopoverContent
          side='bottom'
          sideOffset={12}
          className='bg-gray-800 text-white'
        >
          <PopoverHeader>
            <PopoverTitle>Alerts</PopoverTitle>
            <PopoverDescription>Alerts are displayed here.</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <TooltipContent className='pr-1.5 bg-gray-900 text-white'>
        <div className='flex items-center gap-2'>
          Open Notifications
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>.</Kbd>
          </KbdGroup>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
