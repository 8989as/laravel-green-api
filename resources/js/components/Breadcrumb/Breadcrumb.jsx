import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ title, items, home }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // If items are provided, use that for modern breadcrumb format
  if (items && Array.isArray(items)) {
    return (
      <nav className="breadcrumb-container" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="breadcrumb-wrapper">
          {items.map((item, index) => (
            <React.Fragment key={item.url || index}>
              {index > 0 && (
                <div className="breadcrumb-separator">
                  <img 
                    src="/assets/images/breadcrumb.svg" 
                    alt="breadcrumb separator" 
                    width="20" 
                    height="20"
                  />
                </div>
              )}
              {item.active ? (
                <span className="breadcrumb-item active">{item.label}</span>
              ) : (
                <Link to={item.url} className="breadcrumb-item">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    );
  }
  
  // Legacy format with just title
  return (
    <nav className="breadcrumb-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="breadcrumb-wrapper">
        <Link to="/" className="breadcrumb-item">
          {t('home')}
        </Link>
        
        <div className="breadcrumb-separator">
          <img 
            src="/assets/images/breadcrumb.svg" 
            alt="breadcrumb separator" 
            width="20" 
            height="20"
          />
        </div>
        
        <span className="breadcrumb-item active">
          {title || t('page')}
        </span>
      </div>
    </nav>
  );
};

Breadcrumb.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
      active: PropTypes.bool
    })
  ),
  home: PropTypes.string,
};

export default Breadcrumb;