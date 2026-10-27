import { RGB } from '../types';

// Page 94 textbook example
export const TEXTBOOK_PAGE_94_PIXELS: [RGB, RGB, RGB] = [
  { r: 118, g: 209, b: 117 }, // Pixel 1: m11 = (118+209+117)/3 = 444/3 = 148
  { r: 144, g: 211, b: 248 }, // Pixel 2: m12 = (144+211+248)/3 = 603/3 = 201
  { r: 120, g: 62, b: 148 },  // Pixel 3: m13 = (120+62+148)/3 = 330/3 = 110
];

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  } else if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  }
  return null;
}

export function calculateAverageGrayscale(rgb: RGB): { sum: number; exact: number; rounded: number } {
  const sum = rgb.r + rgb.g + rgb.b;
  const exact = sum / 3;
  const rounded = Math.round(exact);
  return { sum, exact, rounded };
}

export function calculateLuma(rgb: RGB): { exact: number; rounded: number } {
  const exact = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  const rounded = Math.round(exact);
  return { exact, rounded };
}

// Determines if white or dark text is better for contrast
export function getContrastYIQ(r: number, g: number, b: number): 'white' | 'black' {
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}

// Authentic Google Sheets color palette (columns of tints and shades)
export const GOOGLE_SHEETS_PALETTE: string[][] = [
  // Row 1 (darkest / basic)
  ['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff'],
  // Row 2 (deep hues)
  ['#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'],
  // Row 3 (light tints)
  ['#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc'],
  // Row 4
  ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
  // Row 5
  ['#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0'],
  // Row 6 (primary hues)
  ['#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79'],
  // Row 7 (dark shades)
  ['#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47'],
  // Row 8 (deepest dark shades)
  ['#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'],
];

// Presets for student practice
export const PRESET_PRACTICE_SAMPLES = [
  {
    name: '교과서 94쪽 예제',
    pixels: TEXTBOOK_PAGE_94_PIXELS,
  },
  {
    name: '삼원색 (Red, Green, Blue)',
    pixels: [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
    ] as [RGB, RGB, RGB],
  },
  {
    name: '파스텔 소프트 톤',
    pixels: [
      { r: 255, g: 179, b: 186 },
      { r: 186, g: 255, b: 201 },
      { r: 186, g: 225, b: 255 },
    ] as [RGB, RGB, RGB],
  },
  {
    name: '석양 그라디언트',
    pixels: [
      { r: 255, g: 94, b: 77 },
      { r: 255, g: 165, b: 0 },
      { r: 155, g: 89, b: 182 },
    ] as [RGB, RGB, RGB],
  },
  {
    name: '네온 사이버',
    pixels: [
      { r: 0, g: 245, b: 212 },
      { r: 241, g: 91, b: 181 },
      { r: 254, g: 228, b: 64 },
    ] as [RGB, RGB, RGB],
  },
];
