import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CatSlider.css';

const staticCategories = [
  { id: 1, nameKey: 'summerPlants', iconSrc: 'assets/images/cat_1.svg' },
  { id: 2, nameKey: 'winterPlants', iconSrc: 'assets/images/cat_2.svg' },
  { id: 3, nameKey: 'floweringPlants', iconSrc: 'assets/images/cat_3.svg' },
  { id: 4, nameKey: 'outdoorPlants', iconSrc: 'assets/images/cat_4.svg' },
  { id: 5, nameKey: 'indoorPlants', iconSrc: 'assets/images/cat_5.svg' },
  { id: 6, nameKey: 'shrubs', iconSrc: 'assets/images/cat_6.svg' },
  { id: 7, nameKey: 'summerPlants', iconSrc: 'assets/images/cat_1.svg' },
  { id: 8, nameKey: 'winterPlants', iconSrc: 'assets/images/cat_2.svg' },
  { id: 9, nameKey: 'floweringPlants', iconSrc: 'assets/images/cat_3.svg' },
  { id: 10, nameKey: 'outdoorPlants', iconSrc: 'assets/images/cat_4.svg' },
  { id: 11, nameKey: 'indoorPlants', iconSrc: 'assets/images/cat_5.svg' },
  { id: 12, nameKey: 'shrubs', iconSrc: 'assets/images/cat_6.svg' }
];

const VISIBLE_COUNT = 4;

const CatSlider = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? staticCategories.length - VISIBLE_COUNT : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev === staticCategories.length - VISIBLE_COUNT ? 0 : prev + 1
    );
  };

  // Get the visible categories for the current slide
  const visibleCategories = staticCategories.slice(startIndex, startIndex + VISIBLE_COUNT).length === VISIBLE_COUNT
    ? staticCategories.slice(startIndex, startIndex + VISIBLE_COUNT)
    : [
        ...staticCategories.slice(startIndex),
        ...staticCategories.slice(0, VISIBLE_COUNT - (staticCategories.length - startIndex))
      ];

  return (
    <div className={`container cat-slider-container ${isRTL ? 'rtl' : ''}`}>  
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="section-title m-0">{t('plantCategories')}</h2>
        <div className="d-flex gap-2 align-items-center flex-wrap hover-controls">
          <button className="btn btn-success btn-sm" onClick={handlePrev} aria-label="Previous">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="btn btn-success btn-sm" onClick={handleNext} aria-label="Next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>
      <div className="row row-cols-2 row-cols-md-4 g-3 justify-content-center">
        {visibleCategories.map((category) => (
          <div className="col d-flex justify-content-center" key={category.id}>
            <div
              className={`card category-card text-center p-3 h-100 w-100 mx-auto ${selectedCategoryId === category.id ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              style={{ cursor: 'pointer', maxWidth: 150, minWidth: 120 }}
            >
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <img
                  src={category.iconSrc}
                  alt={t(category.nameKey)}
                  className="card-img-top mb-2"
                  style={{ maxHeight: 60, width: 'auto', display: 'block', margin: '0 auto' }}
                />
                <div className="card-body p-0 w-100">
                  <div className="category-name card-title mb-0 text-center w-100">{t(category.nameKey)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatSlider;
