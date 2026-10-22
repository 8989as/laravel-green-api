/**
 * Loading Component
 * Consistent loading indicator across the app
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' (string)
 * - fullScreen: Show as full screen loader (boolean)
 * - text: Loading text (string)
 * - className: Additional CSS classes (string)
 */

import React from 'react';
import PropTypes from 'prop-types';

const SIZE_MAP = {
  sm: '1.5rem',
  md: '3rem',
  lg: '5rem',
};

const Loading = ({ size = 'md', fullScreen = false, text, className = '' }) => {
  const spinnerSize = SIZE_MAP[size] || SIZE_MAP.md;
  
  const containerStyle = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        zIndex: 'var(--z-index-modal, 1050)',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-xl, 3rem)',
      };
  
  return (
    <div className={`loading-container ${className}`} style={containerStyle}>
      <div
        className="spinner-border"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          color: 'var(--color-primary, #3D853C)',
          borderWidth: size === 'sm' ? '2px' : '3px',
        }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && (
        <p
          className="loading-text mt-3"
          style={{
            color: 'var(--text-secondary, #6F816E)',
            fontSize: 'var(--font-size-base, 1rem)',
            fontFamily: 'var(--font-family-primary)',
          }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Loading;
