/**
 * useRTL Hook
 * Centralized RTL/LTR detection and utilities
 * 
 * Usage:
 * const { isRTL, direction, textAlign, flipImage } = useRTL();
 */

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * RTL Languages List
 * Add more RTL language codes as needed
 */
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

/**
 * Main useRTL Hook
 */
export const useRTL = () => {
  const { i18n } = useTranslation();
  
  // Determine if current language is RTL
  const isRTL = useMemo(() => {
    return RTL_LANGUAGES.includes(i18n.language);
  }, [i18n.language]);
  
  // Get direction attribute value
  const direction = useMemo(() => {
    return isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);
  
  // Sync document direction with current language
  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', i18n.language);
  }, [direction, i18n.language]);
  
  // Utility functions
  const utils = useMemo(() => ({
    // Text alignment helper
    textAlign: (options = {}) => {
      const { start = 'start', end = 'end', center = 'center' } = options;
      return { start, end, center };
    },
    
    // Flex direction helper
    flexDirection: (reverse = false) => {
      if (reverse) {
        return isRTL ? 'row' : 'row-reverse';
      }
      return isRTL ? 'row-reverse' : 'row';
    },
    
    // Margin helper (returns object for inline styles)
    margin: ({ start, end, top, bottom } = {}) => {
      const result = {};
      if (start !== undefined) result[isRTL ? 'marginRight' : 'marginLeft'] = start;
      if (end !== undefined) result[isRTL ? 'marginLeft' : 'marginRight'] = end;
      if (top !== undefined) result.marginTop = top;
      if (bottom !== undefined) result.marginBottom = bottom;
      return result;
    },
    
    // Padding helper (returns object for inline styles)
    padding: ({ start, end, top, bottom } = {}) => {
      const result = {};
      if (start !== undefined) result[isRTL ? 'paddingRight' : 'paddingLeft'] = start;
      if (end !== undefined) result[isRTL ? 'paddingLeft' : 'paddingRight'] = end;
      if (top !== undefined) result.paddingTop = top;
      if (bottom !== undefined) result.paddingBottom = bottom;
      return result;
    },
    
    // Position helper (returns object for inline styles)
    position: ({ start, end, top, bottom } = {}) => {
      const result = {};
      if (start !== undefined) result[isRTL ? 'right' : 'left'] = start;
      if (end !== undefined) result[isRTL ? 'left' : 'right'] = end;
      if (top !== undefined) result.top = top;
      if (bottom !== undefined) result.bottom = bottom;
      return result;
    },
    
    // CSS class helper for Bootstrap utilities
    bsClass: (prefix, value) => {
      // Convert Bootstrap directional classes (start/end)
      if (value === 'start' || value === 'end') {
        return `${prefix}-${value}`;
      }
      return `${prefix}-${value}`;
    },
    
    // Image flip helper (for arrows, chevrons, etc.)
    flipImage: (shouldFlip = true) => {
      if (!shouldFlip) return {};
      return {
        transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)',
        transition: 'transform 0.3s ease',
      };
    },
    
    // Number formatting (force LTR for numbers even in RTL)
    formatNumber: (number, options = {}) => {
      const formatted = new Intl.NumberFormat(i18n.language, options).format(number);
      return formatted;
    },
    
    // Currency formatting
    formatCurrency: (amount, currency = 'SAR') => {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency: currency,
      }).format(amount);
    },
  }), [isRTL, i18n.language]);
  
  return {
    isRTL,
    direction,
    language: i18n.language,
    ...utils,
  };
};

/**
 * Hook for getting text alignment class
 */
export const useTextAlign = (align = 'start') => {
  const { isRTL } = useRTL();
  
  const alignmentMap = {
    start: isRTL ? 'text-end' : 'text-start',
    end: isRTL ? 'text-start' : 'text-end',
    center: 'text-center',
  };
  
  return alignmentMap[align] || alignmentMap.start;
};

/**
 * Hook for getting flex direction class
 */
export const useFlexDirection = (reverse = false) => {
  const { isRTL } = useRTL();
  
  if (reverse) {
    return isRTL ? 'flex-row' : 'flex-row-reverse';
  }
  return isRTL ? 'flex-row-reverse' : 'flex-row';
};

/**
 * Hook for directional spacing utilities
 */
export const useSpacing = () => {
  const { isRTL } = useRTL();
  
  return {
    ms: (value) => isRTL ? `me-${value}` : `ms-${value}`, // margin-start
    me: (value) => isRTL ? `ms-${value}` : `me-${value}`, // margin-end
    ps: (value) => isRTL ? `pe-${value}` : `ps-${value}`, // padding-start
    pe: (value) => isRTL ? `ps-${value}` : `pe-${value}`, // padding-end
  };
};

export default useRTL;
