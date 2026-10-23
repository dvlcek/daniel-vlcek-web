"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import styles from "@/app/admin/AdminDashboard.module.css";

export function AdminDetailDrawer({ children, title }: { children: ReactNode; title: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeParams = new URLSearchParams(params.toString());
  closeParams.delete("lead");
  closeParams.delete("booking");
  const closeHref = closeParams.size ? `/admin?${closeParams}` : "/admin";

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  const close = () => router.replace(closeHref, { scroll: false });

  return (
    <dialog ref={dialogRef} className={styles.drawer} aria-label={title}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom) close();
        }
      }}>
      <div className={styles.drawerTop}>
        <span>Details</span>
        <button type="button" onClick={close} aria-label="Close details" className={styles.iconButton}>
          <X size={19} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.drawerBody}>{children}</div>
    </dialog>
  );
}
