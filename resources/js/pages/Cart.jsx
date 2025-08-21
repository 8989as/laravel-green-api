import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { t } = useTranslation();
  const { cartItems } = useCart();

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('cart'), url: '/cart', active: true }
  ];

  return (
    <>
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />

      {/* Add cart header with item count */}
      <div className="container-fluid px-4 px-lg-5 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h3 mb-0">{t('shoppingCart') || 'سلة التسوق'}</h1>
            {cartItems && cartItems.length > 0 && (
              <p className="text-muted mb-0">
                {t('itemsInCart', { count: cartItems.length }) || `${cartItems.length} منتج في السلة`}
              </p>
            )}
          </div>

          {/* Continue Shopping Link */}
          <Link
            to="/products"
            className="btn btn-outline-primary"
          >
            {t('continueShopping') || 'متابعة التسوق'}
          </Link>
        </div>
      </div>

      <Cart />
      <Footer />
    </>
  );
};

export default CartPage;
