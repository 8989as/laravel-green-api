import React from 'react';
import ProductCard from './ProductCard';

const ProductCardExample = () => {
  // Example product data that would come from your API
  const sampleProduct = {
    id: 1,
    name: 'نبات الصبار الجميل',
    name_ar: 'نبات الصبار الجميل',
    name_en: 'Beautiful Aloe Plant',
    latin_name: 'Aloe Vera',
    price: 150,
    discount_price: 120,
    current_price: 120,
    has_discount: true,
    main_image: 'https://example.com/aloe-plant.jpg',
    main_image_url: 'https://example.com/aloe-plant.jpg',
    is_favorite: false,
    slug: 'beautiful-aloe-plant'
  };

  const sampleProductWithoutDiscount = {
    id: 2,
    name: 'وردة حمراء',
    name_ar: 'وردة حمراء',
    name_en: 'Red Rose',
    latin_name: 'Rosa Rubiginosa',
    price: 85,
    current_price: 85,
    has_discount: false,
    main_image: 'https://example.com/red-rose.jpg',
    is_favorite: true,
    slug: 'red-rose'
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (productId, isFavorite) => {
    console.log(`Toggling favorite for product ${productId} to ${isFavorite}`);
    // Here you would make an API call to toggle favorite status
    // Example: await api.toggleFavorite(productId, isFavorite);
    return Promise.resolve();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">ProductCard Examples</h2>
      
      <div className="row g-4">
        {/* Standard Product Card */}
        <div className="col-md-4">
          <h5>Standard Product (with discount)</h5>
          <ProductCard
            product={sampleProduct}
            onFavoriteToggle={handleFavoriteToggle}
            showLatinName={true}
            showDiscount={true}
          />
        </div>

        {/* Product Card without Latin Name */}
        <div className="col-md-4">
          <h5>Without Latin Name</h5>
          <ProductCard
            product={sampleProductWithoutDiscount}
            onFavoriteToggle={handleFavoriteToggle}
            showLatinName={false}
            showDiscount={true}
          />
        </div>

        {/* Product Card without Discount Badge */}
        <div className="col-md-4">
          <h5>Without Discount Badge</h5>
          <ProductCard
            product={sampleProduct}
            onFavoriteToggle={handleFavoriteToggle}
            showLatinName={true}
            showDiscount={false}
          />
        </div>
      </div>

      <div className="row g-4 mt-4">
        {/* Grid of Products */}
        <div className="col-12">
          <h5>Product Grid Example</h5>
          <div className="row g-3">
            {[sampleProduct, sampleProductWithoutDiscount, sampleProduct].map((product, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                <ProductCard
                  product={{...product, id: product.id + index}}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h5>Usage Instructions</h5>
        <div className="alert alert-info">
          <h6>Props:</h6>
          <ul className="mb-0">
            <li><strong>product</strong> (required): Product object from API</li>
            <li><strong>onFavoriteToggle</strong> (optional): Function to handle favorite toggle</li>
            <li><strong>showLatinName</strong> (default: true): Show/hide latin name</li>
            <li><strong>showDiscount</strong> (default: true): Show/hide discount badge</li>
            <li><strong>imageSize</strong> (default: 'medium'): Image size preference</li>
            <li><strong>className</strong> (optional): Additional CSS classes</li>
          </ul>
        </div>
        
        <div className="alert alert-success">
          <h6>Features:</h6>
          <ul className="mb-0">
            <li>✅ Integrated cart functionality with authentication check</li>
            <li>✅ Favorite toggle with loading states</li>
            <li>✅ Automatic navigation to product details</li>
            <li>✅ Responsive design for all screen sizes</li>
            <li>✅ RTL/LTR language support</li>
            <li>✅ Image error handling with fallback</li>
            <li>✅ Discount badge and price display</li>
            <li>✅ Toast notifications for user feedback</li>
            <li>✅ Authentication modal for unauthenticated users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductCardExample;