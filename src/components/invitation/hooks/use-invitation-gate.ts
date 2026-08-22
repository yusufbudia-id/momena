"use client";

import { useEffect, useState } from "react";

type InvitationGateOptions = {
  initialOpen?: boolean;
  lockBody?: boolean;
};

/**
 * State cover/gate screen — dipakai semua template yang punya layar
 * pembuka "Buka Undangan".
 *
 * `initialOpen` dipakai Live Preview Editor agar gate langsung terbuka.
 * `lockBody` dapat dimatikan di editor agar preview tidak mengunci scroll
 * halaman dashboard. Perilaku undangan publik tetap sama secara default.
 */
export function useInvitationGate({
  initialOpen = false,
  lockBody = true,
}: InvitationGateOptions = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (!lockBody) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = isOpen ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, lockBody]);

  return { isOpen, open: () => setIsOpen(true) };
}
