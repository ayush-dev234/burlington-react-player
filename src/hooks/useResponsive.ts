// ============================================
// useResponsive Hook — Breakpoint detection
// ============================================

import { useState, useEffect } from "react";
import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  DESKTOP_BREAKPOINT,
} from "@/utils/constants";

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
  height: number;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => getState());

  function getState(): ResponsiveState {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      isMobile: w < MOBILE_BREAKPOINT,
      isTablet: w >= MOBILE_BREAKPOINT && w < TABLET_BREAKPOINT,
      isDesktop: w >= TABLET_BREAKPOINT && w < DESKTOP_BREAKPOINT,
      isLargeDesktop: w >= DESKTOP_BREAKPOINT,
      width: w,
      height: h,
    };
  }

  useEffect(() => {
    let rafId: number;

    const handler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setState(getState());
      });
    };

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return state;
}
