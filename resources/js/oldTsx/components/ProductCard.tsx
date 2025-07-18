import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

interface Product {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  name_latin?: string;
  description?: string;
  price: number;
  current_price?: number;
  image?: string;
  media?: Array<{ original_url: string }>;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get product image
  const getProductImage = () => {
    if (product.media && product.media.length > 0) {
      return product.media[0].original_url;
    }
    return product.image || 'https://via.placeholder.com/400x400?text=Product';
  };

  // Get product name (support for multilingual)
  const getProductName = () => {
    return product.name || product.name_en || product.name_ar || 'Product';
  };

  // Get product price
  const getProductPrice = () => {
    return product.current_price || product.price;
  };

  // Check favorite status on component mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/favorites/status?product_id=${product.id}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        const data = await response.json();
        setIsFavorite(data.is_favorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [product.id]);

  // Toggle favorite status
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch('/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.is_favorite);
      } else if (response.status === 401) {
        // Redirect to login if not authenticated
        Inertia.visit('/login');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Add to cart
  const addToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);

    try {
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // You can add a toast notification here
        console.log('Product added to cart:', data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // View product details
  const viewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    Inertia.visit(`/product/${product.id}`);
  };

  return (
    <div className="product-card position-relative bg-white rounded-4 overflow-hidden shadow-sm h-100" style={{ border: '1px solid #f0f0f0' }}>
      {/* Heart Icon */}
      <button
        onClick={toggleFavorite}
        className="btn-favorite position-absolute top-0 start-0 m-3 btn p-2 z-3 border-0"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#e91e63" : "none"}
          stroke={isFavorite ? "#e91e63" : "#ff69b4"}
          strokeWidth="2.5"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Product Image */}
      <div className="position-relative overflow-hidden" style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
        <img
          src={getProductImage()}
          className="w-100 h-100"
          alt={getProductName()}
          style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 d-flex flex-column" style={{ minHeight: '180px' }}>
        <div className="flex-grow-1 mb-3">
          <h5 className="fw-bold mb-2 text-end lh-base" style={{
            color: '#2d5016',
            fontSize: '20px',
            fontFamily: 'Cairo, sans-serif'
          }}>
            {getProductName()}
          </h5>
          {product.name_latin && (
            <p className="text-muted text-end mb-0" style={{
              fontSize: '14px',
              fontStyle: 'italic',
              color: '#8fbc8f'
            }}>
              {product.name_latin}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="text-start mb-4">
          <span className="price fw-bold d-block" style={{
            color: '#e91e63',
            fontSize: '28px',
            fontFamily: 'Cairo, sans-serif'
          }}>
            {getProductPrice()} ج.م
          </span>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 mt-auto">
          <button
            onClick={addToCart}
            disabled={isAddingToCart}
            className="btn-cart btn flex-fill d-flex align-items-center justify-content-center fw-semibold"
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '15px',
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {isAddingToCart ? 'جاري الإضافة...' : 'أضف للسلة'}
          </button>

          <button
            onClick={viewDetails}
            className="btn-details btn d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: '#f8f9fa',
              color: '#6c757d',
              border: '1px solid #e9ecef',
              borderRadius: '12px',
              padding: '14px',
              minWidth: '56px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
