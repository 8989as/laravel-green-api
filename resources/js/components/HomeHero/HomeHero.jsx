import React from 'react';
import ImageComponent from './ImageComponent';
import './HomeHero.css';
import { useTranslation } from 'react-i18next';

const HomeHero = () => {
    const { t } = useTranslation();
    return (
        <section className="hero-section bg-white">
            <div className="container-fluid px-4 px-lg-5 py-5">
                <div className="row align-items-center justify-content-between g-5 flex-lg-row flex-column-reverse">
                    <div className="col-lg-6 d-flex flex-column align-items-lg-end align-items-center text-lg-start text-center hero-text">
                        <h1 className="hero-title mb-4">
                            {t('heroTitle')}
                        </h1>
                        <p className="hero-description mb-4">
                            {t('heroSubtitle')}
                        </p>
                        <button className="hero-cta mt-2">
                            {t('heroButton')}
                        </button>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center align-items-center hero-image-container mb-4 mb-lg-0">
                        <ImageComponent />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;