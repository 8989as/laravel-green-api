import React from 'react';
import ProductCard from './ProductCard';

// Test component to verify ProductCard works with API response
const ProductCardTest = () => {
  // Sample product from the API response
  const sampleProduct = {
    "id": 23,
    "name_ar": "هغهعغهعغ",
    "name_en": "shshshshs",
    "name_latin": "hhhhwwwuuuuu",
    "description_ar": "دازنترم س شغشهعسيازشنسيل السيال شغسيلخشغسفخي شخس ي عشغسيلعغشسلخي هشغسليخعغشلسخعيغل شعسغيلخعشغسليخعشسغي ااااا",
    "description_en": "kgbpdasdhbho ausdhasdhoahs daisdghuhagsdgvpaud iquwhdiqbd",
    "price": "55.00",
    "discount_price": null,
    "discount_from": null,
    "discount_to": null,
    "has_variants": true,
    "stock": null,
    "is_active": true,
    "in_stock": true,
    "is_gift": false,
    "category_id": 1,
    "created_at": "2025-07-19T12:49:29.000000Z",
    "updated_at": "2025-07-19T12:49:29.000000Z",
    "current_price": "55.00",
    "main_image": {
      "id": 8,
      "url": "http://localhost:8000/storage/8/conversions/01K0HBPZ371YBFDYQWR217GW0B-medium.jpg",
      "original_url": "http://localhost:8000/storage/8/01K0HBPZ371YBFDYQWR217GW0B.png",
      "thumb_url": "http://localhost:8000/storage/8/conversions/01K0HBPZ371YBFDYQWR217GW0B-thumb.jpg",
      "medium_url": "http://localhost:8000/storage/8/conversions/01K0HBPZ371YBFDYQWR217GW0B-medium.jpg",
      "large_url": "http://localhost:8000/storage/8/conversions/01K0HBPZ371YBFDYQWR217GW0B-large.jpg",
      "name": "product_1",
      "size": 56189,
      "mime_type": "image/png"
    },
    "gallery_images": [],
    "all_images": [],
    "has_discount": false,
    "category": {
      "id": 1,
      "category_ar": "الزهور",
      "category_en": "Flowers",
      "slug": "flowers",
      "description_ar": "زهور طازجة لكل المناسبات.",
      "description_en": "Fresh flowers for every occasion.",
      "created_at": null,
      "updated_at": null
    },
    "sizes": [],
    "colors": [],
    "media": [],
    "attributes": [],
    "total_images": 4,
    "has_main_image": true,
    "has_gallery_images": true
  };

  return (
    <div className="container mt-4">
      <h2>ProductCard Test</h2>
      <div className="row">
        <div className="col-md-4">
          <ProductCard 
            product={sampleProduct}
            onFavoriteToggle={(id, isFavorite) => console.log('Favorite toggled:', id, isFavorite)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCardTest;