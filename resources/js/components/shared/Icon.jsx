/**
 * Icon Component
 * Centralized icon rendering with consistent behavior
 * 
 * Props:
 * - name: Icon name (string)
 * - size: Icon size in pixels (number or string)
 * - color: Icon color (string)
 * - className: Additional CSS classes (string)
 * - onClick: Click handler (function)
 * - style: Additional inline styles (object)
 */

import React from 'react';
import PropTypes from 'prop-types';

// Icon mapping - add more icons as needed
const ICON_PATHS = {
  shipping: '/assets/images/icons/shipping.svg',
  plus: '/assets/images/icons/plus.svg',
  minus: '/assets/images/icons/minus.svg',
  'arrow-right': '/assets/images/icons/arrow-right.svg',
  'arrow-left': '/assets/images/icons/arrow-left.svg',
  trash: '/assets/images/icons/trash.svg',
  cart: '/assets/images/navCart.svg',
  favorite: '/assets/images/favorite.svg',
  eye: '/assets/images/eye.svg',
  sar: '/assets/images/sar.svg',
  breadcrumb: '/assets/images/breadcrumb.svg',
};

// Fallback icon (simple circle with question mark)
const FALLBACK_ICON = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Ccircle cx="12" cy="12" r="10" fill="%239FAB9E"/%3E%3Ctext x="12" y="16" text-anchor="middle" fill="white" font-size="12"%3E%3F%3C/text%3E%3C/svg%3E';

const Icon = ({
  name,
  size = 24,
  color,
  className = '',
  onClick,
  style = {},
  alt = '',
  ...props
}) => {
  const iconSrc = ICON_PATHS[name] || FALLBACK_ICON;
  
  // Parse size to number if it's a string with 'px'
  const parsedSize = typeof size === 'string' ? parseInt(size) : size;
  
  const iconStyle = {
    width: parsedSize,
    height: parsedSize,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...(color && { filter: `brightness(0) saturate(100%)` }),
    ...style,
  };
  
  const handleError = (e) => {
    console.warn(`Icon "${name}" failed to load, using fallback`);
    e.target.src = FALLBACK_ICON;
  };
  
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };
  
  return (
    <img
      src={iconSrc}
      alt={alt || name}
      className={`icon icon-${name} ${className}`}
      style={iconStyle}
      onClick={onClick ? handleClick : undefined}
      onError={handleError}
      {...props}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  alt: PropTypes.string,
};

export default Icon;
