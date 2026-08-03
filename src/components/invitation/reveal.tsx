"use client";

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Durasi transisi, detik. Default 0.5 (dipakai template lain). */
  duration?: number;
  /** Jarak slide-up awal, px. Default 16. */
  distance?: number;
}

/**
 * Satu-satunya pola animasi masuk yang dipakai di seluruh halaman
 * undangan: fade + slide-up, sekali per section saat pertama kali masuk
 * viewport. Sengaja tidak ada animasi lain (scale/rotate/dst) — konsisten
 * lebih penting daripada variatif. `duration`/`distance` bisa disetel per
 * template (mis. Elegant pakai transisi lebih lambat & lembut), default-nya
 * tetap sama seperti sebelumnya supaya template lain tidak berubah.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 16,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
