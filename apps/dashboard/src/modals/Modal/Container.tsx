'use client';

import { Button } from '@/components/ui/button';
import { DialogContent } from '@/components/ui/dialog';
import { cn } from '@/utils/cn';
import type { DialogContentProps } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { popModal } from '..';

interface ModalContentProps extends DialogContentProps {
  children: React.ReactNode;
}

export function ModalContent({ children, ...props }: ModalContentProps) {
  return <DialogContent {...props}>{children}</DialogContent>;
}

interface ModalHeaderProps {
  title: string | React.ReactNode;
  text?: string | React.ReactNode;
  onClose?: (() => void) | false;
  className?: string;
}

export function ModalHeader({
  title,
  text,
  onClose,
  className,
}: ModalHeaderProps) {
  return (
    <div className={cn('mb-6 flex justify-between', className)}>
      <div>
        <div className="mt-0.5 font-medium">{title}</div>
        {!!text && <div className=" text-muted-foreground">{text}</div>}
      </div>
      {onClose !== false && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (onClose ? onClose() : popModal())}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
}
