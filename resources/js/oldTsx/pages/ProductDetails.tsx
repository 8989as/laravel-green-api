import React from 'react';
import { Head } from '@inertiajs/inertia-react';

interface Product {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  name_latin?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  current_price?: number;
  image?: string;
  media?: Array<{ original_url: string }>;
  category?: {
    id: number;
    category_ar?: string;
    category_en?: string;
  };
}

interface ProductDetailsProps {
  product: Product;
  isFavorite: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, isFavorite }) => {
  const getProductImage = () => {
    if (product.media && product.media.length > 0) {
      return product.media[0].original_url;
    }
    return product.image || 'https://via.placeholder.com/600x600?text=Product';
  };

  const getProductName = () => {
    return product.name || product.name_en || product.name_ar || 'Product';
  };

  const getProductDescription = () => {
    return product.description || product.description_en || product.description_ar || '';
  };

  const getProductPrice = () => {
    return product.current_price || product.price;
  };

  return (
    <>
      <Head title={getProductName()} />

      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <img
              src={getProductImage()}
              alt={getProductName()}
              className="img-fluid rounded"
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
            />
          </div>

          <div className="col-md-6">
            <h1 className="mb-3">{getProductName()}</h1>

            {product.name_latin && (
              <p className="text-muted mb-3">{product.name_latin}</p>
            )}

            <div className="mb-4">
              <span className="h3 text-primary">{getProductPrice()} ج.م</span>
            </div>

            {getProductDescription() && (
              <div className="mb-4">
                <h5>الوصف</h5>
                <p>{getProductDescription()}</p>
              </div>
            )}

            <div className="d-flex gap-3">
              <button className="btn btn-success btn-lg flex-fill">
                أضف للسلة
              </button>
              <button className={`btn btn-outline-danger btn-lg ${isFavorite ? 'active' : ''}`}>
                ♥
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;