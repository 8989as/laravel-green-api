/**
 * Image Component
 * Smart image component with loading states, error handling, and fallbacks
 * 
 * Props:
 * - src: Image source URL (string)
 * - alt: Alt text (string)
 * - fallbackSrc: Fallback image URL (string)
 * - loading: Loading state ('lazy' | 'eager')
 * - className: CSS classes (string)
 * - onLoad: Load callback (function)
 * - onError: Error callback (function)
 * - showLoader: Show loading spinner (boolean)
 * - aspectRatio: Aspect ratio (string like '16/9')
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_PLACEHOLDER = '/assets/images/placeholder-product.jpg';

const Image = ({
  src,
  alt = '',
  fallbackSrc = DEFAULT_PLACEHOLDER,
  loading = 'lazy',
  className = '',
  onLoad,
  onError,
  showLoader = true,
  aspectRatio,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  
  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };
  
  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if current src is not already the fallback
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false); // Reset error state to try fallback
    }
    
    if (onError) onError(e);
  };
  
  const containerStyle = aspectRatio
    ? { aspectRatio, position: 'relative', overflow: 'hidden' }
    : {};
  
  const imageStyle = {
    ...props.style,
    ...(isLoading && showLoader ? { opacity: 0 } : { opacity: 1 }),
    transition: 'opacity 0.3s ease-in-out',
  };
  
  return (
    <div className={`image-container ${className}`} style={containerStyle}>
      {isLoading && showLoader && (
        <div className="image-loader" style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-green-lighter, #F0F8F0)',
        }}>
          <div className="spinner-border text-primary" style={{
            width: '2rem',
            height: '2rem',
            color: 'var(--color-primary, #3D853C)',
          }}></div>
        </div>
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={imageStyle}
        {...props}
      />
      
      {hasError && currentSrc === fallbackSrc && (
        <div className="image-error-overlay" style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-secondary, #f8f9fa)',
          color: 'var(--text-muted, #9FAB9E)',
          fontSize: 'var(--font-size-sm, 0.875rem)',
        }}>
          {alt || 'Image unavailable'}
        </div>
      )}
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  fallbackSrc: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  className: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  showLoader: PropTypes.bool,
  aspectRatio: PropTypes.string,
};

export default Image;
