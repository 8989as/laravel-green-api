import React from 'react';
import { useTranslation } from 'react-i18next';

const ProductFilterSidebar = ({ 
  categories = [], 
  sizes = [],
  colors = [],
  selectedCategory = '', 
  selectedSizes = [],
  selectedColors = [],
  priceRange = [0, 500],
  onCategoryChange,
  onSizeChange,
  onColorChange,
  onPriceChange 
}: any) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Filters</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">{t('category')}</label>
          <select className="form-select" value={selectedCategory} onChange={e => onCategoryChange?.(e.target.value)}>
            <option value="">{t('all')}</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.slug}>
                {isRTL ? cat.category_ar : cat.category_en}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">{t('size')}</label>
          <div className={`d-flex flex-wrap gap-2 ${isRTL ? 'justify-content-end' : ''}`}>
            {sizes.map((size: any) => (
              <div className="form-check" key={size.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedSizes.includes(size.id)}
                  onChange={() => onSizeChange?.(size.id)}
                />
                <label className="form-check-label">
                  {isRTL ? size.size_ar : size.size_en}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{t('color')}</label>
          <div className={`d-flex flex-wrap gap-2 ${isRTL ? 'justify-content-end' : ''}`}>
            {colors.map((color: any) => (
              <div className="form-check" key={color.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedColors.includes(color.id)}
                  onChange={() => onColorChange?.(color.id)}
                />
                <label className="form-check-label d-flex align-items-center gap-1">
                  <span 
                    className="color-swatch" 
                    style={{ backgroundColor: color.hex_code, width: '20px', height: '20px' }}
                  />
                  {isRTL ? color.color_ar : color.color_en}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">{t('price_range')} ({t('sar')} {priceRange[1]})</label>
          <input 
            type="range" 
            className="form-range" 
            min="0" 
            max="500" 
            value={priceRange[1]}
            onChange={e => onPriceChange?.([priceRange[0], parseInt(e.target.value)])}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
