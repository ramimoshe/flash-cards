/**
 * Base path utilities for handling GitHub Pages deployment
 * 
 * In production, the app is served from /flash-cards/
 * In development, it's served from /
 */

export const getBasePath = (): string => {
  return import.meta.env.MODE === 'production' ? '/flash-cards' : '';
};

export const getDataPath = (filename: string): string => {
  return `${getBasePath()}/data/${filename}`;
};
