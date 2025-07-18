import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/inertia-react';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
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
                <Link href={item.url} className="breadcrumb-item">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    );
  }
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
      active: PropTypes.bool
    })
  ),
};

export default Breadcrumb;