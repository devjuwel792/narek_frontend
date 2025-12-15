"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from ".";

export default function ModalDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} className="" onOpenChange={setOpen}>
        <p>This is the modal content area where you can put any React nodes.</p>
        
       
     
      </Modal>
    </>
  );
}
