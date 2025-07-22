import React from 'react';
import { useTranslation } from 'react-i18next';
import './LandscapingCTA.css';

const LandscapingCTA = () => {
  const { t } = useTranslation();

  return (
    <div className="landscaping-cta-container">
      <div className="cta-frame">
        <div className="cta-background-rect"></div>
        <img 
          className="cta-image"
          src="assets/images/landscapingImage.jpg" 
          alt={t('landscapingTitle')}
        />
      </div>
      
      <button className="cta-button">
        <span className="cta-button-text">
          {t('landscapingButton')}
        </span>
      </button>
      
      <h2 className="cta-title">
        {t('landscapingTitle')}
      </h2>
    </div>
  );
};

export default LandscapingCTA;