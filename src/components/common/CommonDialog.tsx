import { Children, PropsWithChildren } from 'react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../../components/ui/dialog';

export type CommonDialogProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: React.ReactNode;
};

export const CommonDialog = ({
  children,
  title,
  open,
  onOpenChange,
  ...props
}: PropsWithChildren<CommonDialogProps>) => {
  const [body, footer] = Children.toArray(children);

  return (
    <DialogRoot
      lazyMount
      scrollBehavior='inside'
      size='lg'
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement='center'
      {...props}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>{body}</DialogBody>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </DialogRoot>
  );
};
