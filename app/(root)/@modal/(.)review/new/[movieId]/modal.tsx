"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }
  return createPortal(
    <div className="modal-backdrop">
      <dialog ref={dialogRef} className="modal bg-dark-3" onClose={onDismiss}>
        <button onClick={onDismiss} className="absolute right-8">
          <X className="h-6 w-6 " color="#fff" />
        </button>
        {children}
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  );
}
