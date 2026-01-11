/**
 * HIGHLIGHT PALETTES - SINGLE SOURCE OF TRUTH
 * 
 * Define all color palettes for semantic highlights.
 * Architecture: Single Source of Truth → IntelligentHighlightSystem → Components
 */

// ========================================
// VIBRANT PALETTE (Bright colors)
// ========================================
const VIBRANT_HIGHLIGHTS = {
  // Backgrounds (soft colors for highlights)
  background: {
    'Y': '#FFF4C3',  // Yellow - Important/key points
    'B': '#D5FEFF',  // Blue - Concepts/definitions
    'O': '#FFD5C3',  // Orange - Steps/sequences
    'G': '#DCFCE7',  // Green - Success/positive
    'R': '#fee2e2',  // Red - Warnings/errors
    'P': '#FEECFF',  // Pink - Examples
    'L': '#E6F3FF',  // Light blue - Data/numbers
    'GR': '#E8E6E5', // Gray - Code/technical
    'H': '#ede9fe',  // Purple - Emphasis/highlights
    'BR': '#f5e8dd'  // Brown - Context/background info
  },
  
  // Underlines (strong colors for underlines)
  underline: {
    'Y': '#FFC41A',  // Yellow darker
    'B': '#5DCFFF',  // Blue darker
    'O': '#FF7744',  // Orange darker
    'G': '#22C55E',  // Green darker
    'R': '#ef4444',  // Red darker
    'P': '#FC90FF',  // Pink darker
    'L': '#8DC5FF',  // Light blue darker
    'GR': '#ACA8A4', // Gray darker
    'H': '#8b5cf6',  // Purple darker
    'BR': '#92400e'  // Brown darker
  }
};

// ========================================
// NATURAL PALETTE (Earth tones)
// ========================================
const NATURAL_HIGHLIGHTS = {
  // Backgrounds (soft earth tones)
  background: {
    'Y': '#F5F0E8',  // Beige/cream - Important/key points
    'B': '#E8F0F4',  // Steel blue light - Concepts/definitions
    'O': '#F5E8DD',  // Tan light - Steps/sequences
    'G': '#E8EDE6',  // Sage green - Success/positive
    'R': '#F5E8EA',  // Dusty rose - Warnings/errors
    'P': '#F0EAF5',  // Lavender light - Examples
    'L': '#E6EEF3',  // Slate light - Data/numbers
    'GR': '#E8E6E5', // Gray - Code/technical
    'H': '#EAE8F0',  // Soft purple - Emphasis/highlights
    'BR': '#F0E8E0'  // Warm beige - Context/background info
  },
  
  // Underlines (strong earth tones - must be visible)
  underline: {
    'Y': '#9A8B7A',  // Tan strong - Important/key points
    'B': '#2C5F6F',  // Slate strong - Concepts/definitions
    'O': '#92400E',  // Brown strong - Steps/sequences
    'G': '#6B7056',  // Olive strong - Success/positive
    'R': '#7C2D3F',  // Burgundy strong - Warnings/errors
    'P': '#9B8BA8',  // Lavender strong - Examples
    'L': '#5C7B8B',  // Steel blue - Data/numbers
    'GR': '#ACA8A4', // Gray darker
    'H': '#7C6B8A',  // Purple earth strong - Emphasis/highlights
    'BR': '#8B6B47'  // Brown copper strong - Context/background info
  }
};

// ========================================
// PALETTE MAP - Easy to extend
// ========================================
export const HIGHLIGHT_PALETTES = {
  vibrant: VIBRANT_HIGHLIGHTS,
  natural: NATURAL_HIGHLIGHTS,
};

/**
 * Get highlight palette by name
 * @param {string} paletteName - 'vibrant' | 'natural'
 * @returns {Object} Palette with background and underline colors
 */
export const getHighlightPalette = (paletteName = 'vibrant') => {
  return HIGHLIGHT_PALETTES[paletteName] || HIGHLIGHT_PALETTES.vibrant;
};

/**
 * Get background color for a highlight code
 * @param {string} paletteName - 'vibrant' | 'natural'
 * @param {string} code - 'Y', 'B', 'O', etc.
 * @returns {string} Hex color
 */
export const getHighlightBackground = (paletteName, code) => {
  const palette = getHighlightPalette(paletteName);
  return palette.background[code] || palette.background['Y'];
};

/**
 * Get underline color for a highlight code
 * @param {string} paletteName - 'vibrant' | 'natural'
 * @param {string} code - 'Y', 'B', 'O', etc.
 * @returns {string} Hex color
 */
export const getHighlightUnderline = (paletteName, code) => {
  const palette = getHighlightPalette(paletteName);
  return palette.underline[code] || palette.underline['O'];
};

// Default export
export default HIGHLIGHT_PALETTES;
