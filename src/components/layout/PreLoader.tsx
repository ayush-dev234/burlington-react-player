// ============================================
// PreLoader — Animated splash screen
// ============================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRELOADER_MIN_TIME } from "@/utils/constants";

interface PreLoaderProps {
  onComplete: () => void;
}

export default function PreLoader({ onComplete }: PreLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, PRELOADER_MIN_TIME);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-linear-to-br from-brand-900 via-brand-800 to-brand-950"
        >
          {/* Book animation */}
          <div className="mb-8">
            <img
              src="./img/preloader-books.gif"
              alt="Loading..."
              className="h-32 w-auto object-contain"
              onError={(e) => {
                // Fallback if gif is missing
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <img
              src="./img/main-logo.png"
              alt="Logo"
              className="mx-auto mb-4 h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex items-center gap-2 text-brand-300">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
              <span className="text-sm font-light tracking-wider">
                Loading your book...
              </span>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: PRELOADER_MIN_TIME / 1000, ease: "linear" }}
            className="mt-6 h-0.5 rounded-full bg-brand-500"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
