"use client";

import { useEffect, useState } from "react";

/**
 * State cover/gate screen — dipakai semua template yang punya layar
 * pembuka "Buka Undangan". Mengunci scroll body selama gate tampil,
 * supaya konten di belakangnya tidak ikut ter-scroll diam-diam.
 */
export function useInvitationGate() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return { isOpen, open: () => setIsOpen(true) };
}
