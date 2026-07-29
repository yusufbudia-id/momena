"use client";

import { motion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Satu-satunya pola animasi masuk yang dipakai di seluruh halaman
 * undangan: fade + slide-up kecil, sekali per section saat pertama kali
 * masuk viewport. Sengaja tidak ada animasi lain (scale/rotate/dst) —
 * konsisten lebih penting daripada variatif.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
