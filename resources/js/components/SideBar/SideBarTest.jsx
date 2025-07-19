import React from 'react';
import SideBar from './SideBar';

// Test component to verify SideBar works with API response
const SideBarTest = () => {
  // Sample data from the API response
  const sampleCategories = [
    {
      "id": 1,
      "category_ar": "الزهور",
      "category_en": "Flowers",
      "slug": "flowers",
      "description_ar": "زهور طازجة لكل المناسبات.",
      "description_en": "Fresh flowers for every occasion.",
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 2,
      "category_ar": "النباتات",
      "category_en": "Plants",
      "slug": "plants",
      "description_ar": "نباتات داخلية وخارجية.",
      "description_en": "Indoor and outdoor plants.",
      "created_at": null,
      "updated_at": null
    }
  ];

  const sampleColors = [
    {
      "id": 1,
      "color_en": "Red",
      "color_ar": "أحمر",
      "hex_code": "#FF0000",
      "icon": "",
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 2,
      "color_en": "Blue",
      "color_ar": "أزرق",
      "hex_code": "#0000FF",
      "icon": "",
      "created_at": null,
      "updated_at": null
    }
  ];

  const sampleSizes = [
    {
      "id": 1,
      "size_en": "Small",
      "size_ar": "صغير",
      "created_at": null,
      "updated_at": null
    },
    {
      "id": 2,
      "size_en": "Medium",
      "size_ar": "متوسط",
      "created_at": null,
      "updated_at": null
    }
  ];

  return (
    <div className="container mt-4">
      <h2>SideBar Test</h2>
      <div className="row">
        <div className="col-md-4">
          <SideBar
            categories={sampleCategories}
            colors={sampleColors}
            sizes={sampleSizes}
            priceRange={{ min: 0, max: 1000 }}
            isGift={false}
            onFilterChange={(filters) => console.log('Filters changed:', filters)}
            onApplyFilters={(filters) => console.log('Filters applied:', filters)}
            initialFilters={{
              categories: [],
              colors: [],
              sizes: [],
              priceRange: [0, 1000]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SideBarTest;