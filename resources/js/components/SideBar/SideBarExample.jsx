import React, { useState } from 'react';
import SideBar from './SideBar';

const SideBarExample = () => {
  const [filters, setFilters] = useState({});

  // Example data that would come from your API
  const categories = [
    { id: 1, name: 'أشجار' },
    { id: 2, name: 'شجيرات' },
    { id: 3, name: 'نباتات داخلية' },
    { id: 4, name: 'نباتات خارجية' }
  ];

  const colors = [
    { id: 1, name: 'برتقالي', hex_code: '#F99B18' },
    { id: 2, name: 'بنفسجي', hex_code: '#A20CD4' },
    { id: 3, name: 'أحمر', hex_code: '#D40C0C' },
    { id: 4, name: 'روز', hex_code: '#FF96B2' }
  ];

  const sizes = [
    { id: 1, name: 'صغير' },
    { id: 2, name: 'متوسط' },
    { id: 3, name: 'كبير' }
  ];

  // Gift filters - only used when isGift is true
  const giftFilters = {
    occasions: [
      { id: 1, name: 'عيد ميلاد' },
      { id: 2, name: 'زفاف' },
      { id: 3, name: 'تخرج' }
    ],
    recipients: [
      { id: 1, name: 'للأطفال' },
      { id: 2, name: 'للكبار' },
      { id: 3, name: 'للعائلة' }
    ],
    themes: [
      { id: 1, name: 'رومانسي' },
      { id: 2, name: 'كلاسيكي' },
      { id: 3, name: 'عصري' }
    ]
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  const handleApplyFilters = (appliedFilters) => {
    console.log('Applying filters:', appliedFilters);
    // Here you would typically make an API call to fetch filtered products
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          {/* Regular product filtering */}
          <SideBar
            categories={categories}
            colors={colors}
            sizes={sizes}
            priceRange={{ min: 0, max: 1000 }}
            isGift={false}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            initialFilters={{
              categories: [],
              colors: [],
              sizes: [],
              priceRange: [0, 1000]
            }}
          />
        </div>
        
        <div className="col-md-3">
          {/* Gift product filtering - includes additional gift filters */}
          <SideBar
            categories={categories}
            colors={colors}
            sizes={sizes}
            priceRange={{ min: 0, max: 1000 }}
            isGift={true}
            giftFilters={giftFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            initialFilters={{
              categories: [],
              colors: [],
              sizes: [],
              priceRange: [0, 1000],
              occasions: [],
              recipients: [],
              themes: []
            }}
          />
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Current Filters</h5>
              <pre>{JSON.stringify(filters, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarExample;