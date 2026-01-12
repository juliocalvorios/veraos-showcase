import React, { useState, useCallback, useEffect } from 'react';

const HighlightedSpanFixed = ({ text, type = 'default', intensity = 'medium', tooltip, onMarkChange, highlightId, onAltClick }) => {
  // Load state from localStorage
  const [isUnderlined, setIsUnderlined] = useState(() => {
    if (highlightId) {
      const saved = localStorage.getItem(`highlight-${highlightId}`);
      return saved === 'true';
    }
    return false;
  });
  const [isHovered, setIsHovered] = useState(false);
  
  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `highlight-${highlightId}`) {
        setIsUnderlined(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [highlightId]);
  
  // Listen for custom events (Escape key, etc)
  useEffect(() => {
    const handleClearAll = () => {
      setIsUnderlined(false);
      if (highlightId) {
        localStorage.removeItem(`highlight-${highlightId}`);
      }
    };
    
    const handleMarkByType = (e) => {
      if (e.detail.type === type) {
        setIsUnderlined(e.detail.marked);
        if (highlightId) {
          if (e.detail.marked) {
            localStorage.setItem(`highlight-${highlightId}`, 'true');
          } else {
            localStorage.removeItem(`highlight-${highlightId}`);
          }
        }
      }
    };
    
    window.addEventListener('clearAllHighlights', handleClearAll);
    window.addEventListener('markHighlightsByType', handleMarkByType);
    
    return () => {
      window.removeEventListener('clearAllHighlights', handleClearAll);
      window.removeEventListener('markHighlightsByType', handleMarkByType);
    };
  }, [highlightId, type]);
  
  // YOUR EXACT colors - solid without opacity
  const colorMap = {
    error:      '#FFE2DD',
    solution:   '#D5FEFF',
    emphasis:   '#FEECFF',
    warning:    '#FFF4C3',
    change:     '#FFD5C3',
    code:       '#E8E6E5',
    command:    '#E8E6E5',
    key_info:   '#E6F3FF',
    reference:  '#E6F8FF',
    step:       '#FFD5C3',
    concept:    '#FEECFF',
    default:    '#F6F4F3'
  };
  
  // YOUR underline colors EXACT
  const underlineMap = {
    error:      '#FF8877',  
    solution:   '#5DCFFF',  
    emphasis:   '#FC90FF',  
    warning:    '#FFC41A',  
    change:     '#FF7744',  
    code:       '#ACA8A4',  
    command:    '#ACA8A4',  
    key_info:   '#8DC5FF',  
    reference:  '#8DD0FF',  
    step:       '#FF7744',  
    concept:    '#FC90FF',  
    default:    '#BCB8B4'   
  };
  
  // Your lighten function
  const lightenColor = (hex, amount = 0.2) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    
    const newR = Math.round(r + (255 - r) * amount);
    const newG = Math.round(g + (255 - g) * amount);
    const newB = Math.round(b + (255 - b) * amount);
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  const backgroundColor = colorMap[type] || colorMap.default;
  const underlineColor = underlineMap[type] || underlineMap.default;
  const hoveredBackgroundColor = lightenColor(backgroundColor);
  
  // Click handler with Alt key support
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Alt + Click = mark all of same type
    if (e.altKey) {
      if (onAltClick) {
        onAltClick(type, !isUnderlined);
      }
      // Dispatch event to mark all of same type
      window.dispatchEvent(new CustomEvent('markHighlightsByType', {
        detail: { type, marked: !isUnderlined }
      }));
      return;
    }
    
    const newState = !isUnderlined;
    setIsUnderlined(newState);
    
    // Save to localStorage
    if (highlightId) {
      if (newState) {
        localStorage.setItem(`highlight-${highlightId}`, 'true');
      } else {
        localStorage.removeItem(`highlight-${highlightId}`);
      }
    }
    
    // Callback if exists
    if (onMarkChange) {
      onMarkChange(newState, type);
    }
  }, [isUnderlined, type, onMarkChange, highlightId, onAltClick]);
  
  // Double click to reset
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUnderlined) {
      setIsUnderlined(false);
      
      if (highlightId) {
        localStorage.removeItem(`highlight-${highlightId}`);
      }
      
      if (onMarkChange) {
        onMarkChange(false, type);
      }
    }
  }, [isUnderlined, highlightId, onMarkChange, type]);
  
  // Get tooltip text
  const getTooltip = () => {
    if (tooltip) return tooltip;
    const base = isUnderlined ? 'Click to unmark' : 'Click to mark';
    return `${base} • Alt+Click to mark all ${type}`;
  };

  // Base style - minimalist
  const baseStyle = {
    backgroundColor: isHovered ? hoveredBackgroundColor : backgroundColor,
    padding: '1px 3px 0 3px',
    borderRadius: '3px',
    display: 'inline',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    transition: 'background-color 0.15s ease',
  };

  // Underline style if marked
  const underlineStyle = isUnderlined ? {
    textDecoration: `underline ${underlineColor}`,
    textDecorationThickness: '2px',
    textUnderlineOffset: '2px',
    textDecorationSkipInk: 'none'
  } : {};

  return (
    <span
      style={{ 
        ...baseStyle,
        ...underlineStyle
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={getTooltip()}
    >
      {text}
    </span>
  );
};

export default HighlightedSpanFixed;