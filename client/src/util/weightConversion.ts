const GRAMS_PER_OZ = 28.3495;

export const gramsToOz = (grams: number): number =>
  Math.round((grams / GRAMS_PER_OZ) * 100) / 100;

export const ozToGrams = (oz: number): number =>
  Math.round(oz * GRAMS_PER_OZ * 100) / 100;
