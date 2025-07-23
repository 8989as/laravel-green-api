import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SideBar.css';

const SideBar = ({
  categories = [],
  colors = [],
  sizes = [],
  priceRange = { min: 0, max: 1000 },
  isGift = false,
  giftFilters = {},
  onFilterChange = () => { },
  onApplyFilters = () => { },
  initialFilters = {}
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    colors: initialFilters.colors || [],
    sizes: initialFilters.sizes || [],
    priceRange: initialFilters.priceRange || [priceRange.min, priceRange.max],
    ...initialFilters
  });

  const handleFilterChange = (filterType, value, isChecked = null) => {
    let newFilters = { ...filters };

    if (filterType === 'priceRange') {
      newFilters.priceRange = value;
    } else if (Array.isArray(newFilters[filterType])) {
      if (isChecked === null) {
        // Toggle behavior
        const currentValues = newFilters[filterType];
        newFilters[filterType] = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value];
      } else {
        // Explicit checked/unchecked
        newFilters[filterType] = isChecked
          ? [...newFilters[filterType], value]
          : newFilters[filterType].filter(item => item !== value);
      }
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderCheckboxSection = (title, items, filterKey) => (
    <div className="filter-section">
      <h5 className="section-title">{title}</h5>
      <div className="filter-options">
        {items.map((item) => {
          const itemId = item.id || item.value;
          const itemName = item.name || item.label ||
            (filterKey === 'categories' ? (isRTL ? item.category_ar : item.category_en) :
              filterKey === 'sizes' ? (isRTL ? item.size_ar : item.size_en) :
                filterKey === 'colors' ? (isRTL ? item.color_ar : item.color_en) : '');

          return (
            <div key={itemId} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`${filterKey}-${itemId}`}
                checked={filters[filterKey].includes(itemId)}
                onChange={(e) => handleFilterChange(filterKey, itemId, e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor={`${filterKey}-${itemId}`}
              >
                {itemName}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderColorSection = () => (
    <div className="filter-section">
      <h5 className="section-title">{isRTL ? 'اللون' : 'Color'}</h5>
      <div className="color-options row g-2">
        {colors.map((color) => {
          const colorName = isRTL ? color.color_ar : color.color_en;
          return (
            <div key={color.id} className="col-4">
              <div
                className={`color-icon-container ${filters.colors.includes(color.id) ? 'selected' : ''}`}
                onClick={() => handleFilterChange('colors', color.id)}
                style={{
                  alignSelf: 'stretch',
                  padding: '8px 4px',
                  borderRadius: 5,
                  outline: filters.colors.includes(color.id) ? '2px solid #6F816E' : '1px solid #C3D9C3',
                  outlineOffset: '-1px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer'
                }}
              >
                {color.icon ? (
                  <img
                    src={`/${color.icon}`}
                    alt={colorName}
                    style={{
                      width: 18,
                      height: 18,
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: color.hex_code,
                      borderRadius: '50%'
                    }}
                  />
                )}
                <div
                  style={{
                    textAlign: 'center',
                    color: '#6F816E',
                    fontSize: 12,
                    fontFamily: 'El Messiri',
                    fontWeight: '400',
                    lineHeight: '15.6px',
                    wordWrap: 'break-word'
                  }}
                >
                  {colorName}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPriceSection = () => (
    <div className="filter-section">
      <h5 className="section-title">{isRTL ? 'السعر' : 'Price'}</h5>
      <div className="price-range">
        <div className="price-inputs">
          <input
            type="number"
            className="form-control price-input"
            placeholder={isRTL ? 'من' : 'Min'}
            value={filters.priceRange[0]}
            onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            className="form-control price-input"
            placeholder={isRTL ? 'إلى' : 'Max'}
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
          />
        </div>
        <input
          type="range"
          className="form-range price-slider"
          min={priceRange.min}
          max={priceRange.max}
          value={filters.priceRange[1]}
          onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
        />
      </div>
    </div>
  );

  const renderGiftFilters = () => {
    if (!isGift || !giftFilters) return null;

    return (
      <div className="gift-filters">
        <h5 className="section-title">{isRTL ? 'خيارات الهدايا' : 'Gift Options'}</h5>
        {giftFilters.occasions && renderCheckboxSection(
          isRTL ? 'المناسبات' : 'Occasions',
          giftFilters.occasions,
          'occasions'
        )}
        {giftFilters.recipients && renderCheckboxSection(
          isRTL ? 'المستلمين' : 'Recipients',
          giftFilters.recipients,
          'recipients'
        )}
        {giftFilters.themes && renderCheckboxSection(
          isRTL ? 'المواضيع' : 'Themes',
          giftFilters.themes,
          'themes'
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar-container ${isRTL ? 'rtl' : 'ltr'}`}>
      <h3 className="filter-title">{isRTL ? 'تصفية المنتجات' : 'Filter Products'}</h3>

      {categories.length > 0 && renderCheckboxSection(
        isRTL ? 'الفئات' : 'Categories',
        categories,
        'categories'
      )}

      {colors.length > 0 && renderColorSection()}

      {sizes.length > 0 && renderCheckboxSection(
        isRTL ? 'الأحجام' : 'Sizes',
        sizes,
        'sizes'
      )}

      {renderPriceSection()}

      {renderGiftFilters()}

      <button
        className="btn btn-primary filter-apply-btn w-100 mt-4"
        onClick={() => onApplyFilters(filters)}
      >
        {isRTL ? 'تطبيق الفلاتر' : 'Apply Filters'}
      </button>
    </div>
  );
};

export default SideBar;