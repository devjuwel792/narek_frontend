"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as React from "react";

const Modal = React.forwardRef(
  ({ open, onOpenChange, children, className, ...props }, ref) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref} className={className} {...props}>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);
Modal.displayName = "Modal";

export { Modal };
