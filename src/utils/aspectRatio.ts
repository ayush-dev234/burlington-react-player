// ============================================
// Aspect Ratio Utilities
// ============================================

import { PAGE_ASPECT_RATIO } from "./constants";

interface FitDimensions {
  width: number;
  height: number;
  scale: number;
}

/**
 * Calculate dimensions to fit the book page within a container
 * while preserving the aspect ratio.
 */
export function fitToContainer(
  containerWidth: number,
  containerHeight: number,
  viewMode: "single" | "double" = "single"
): FitDimensions {
  const effectiveAspect =
    viewMode === "double" ? PAGE_ASPECT_RATIO * 2 : PAGE_ASPECT_RATIO;

  // Calculate which dimension is the constraining factor
  const widthScale = containerWidth / (effectiveAspect * containerHeight);
  const heightScale = containerHeight / containerHeight;

  if (widthScale < heightScale) {
    // Width is the constraint
    const width = containerWidth;
    const height = width / effectiveAspect;
    return { width, height, scale: width / (effectiveAspect * containerHeight) };
  } else {
    // Height is the constraint
    const height = containerHeight;
    const width = height * effectiveAspect;
    return { width, height, scale: 1 };
  }
}

/**
 * Calculate the scaled dimensions given a base size and zoom level.
 */
export function applyZoom(
  baseDimensions: FitDimensions,
  zoom: number
): FitDimensions {
  return {
    width: baseDimensions.width * zoom,
    height: baseDimensions.height * zoom,
    scale: baseDimensions.scale * zoom,
  };
}
