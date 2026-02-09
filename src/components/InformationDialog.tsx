import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/base/dialog';
import { Button } from '@components/base/button';

interface InformationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function InformationDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  buttonText = 'OK',
  onClose,
  showCloseButton = false,
}: InformationDialogProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}