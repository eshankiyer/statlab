"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface AnimatePageContentProps {
  children: ReactNode;
}

export default function AnimatePageContent({ children }: AnimatePageContentProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={`page-${pathname}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}