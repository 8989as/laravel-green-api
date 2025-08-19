import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Cart.css';

const Cart = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Sample cart data - replace with actual data from context/API
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'نبات الجهنمية',
      latinName: 'Bougainvillea spp',
      image: 'https://placehold.co/51x53',
      color: 'روز',
      colorHex: '#FF96B2',
      price: 150,
      quantity: 2,
      total: 300
    },
    {
      id: 2,
      name: 'نبات الجهنمية',
      latinName: 'Bougainvillea spp',
      image: 'https://placehold.co/51x53',
      color: 'روز',
      colorHex: '#FF96B2',
      price: 150,
      quantity: 2,
      total: 300
    },
    {
      id: 3,
      name: 'نبات الجهنمية',
      latinName: 'Bougainvillea spp',
      image: 'https://placehold.co/51x53',
      color: 'روز',
      colorHex: '#FF96B2',
      price: 150,
      quantity: 2,
      total: 300
    },
    {
      id: 4,
      name: 'نبات الجهنمية',
      latinName: 'Bougainvillea spp',
      image: 'https://placehold.co/51x53',
      color: 'روز',
      colorHex: '#FF96B2',
      price: 150,
      quantity: 2,
      total: 300
    }
  ]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = 600;
  const plantingCost = 30;
  const shippingCost = 20;
  const total = 650;

  return (
    <div className={`cart-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row">
          {/* Left Side - Order Summary */}
          <div className="col-lg-4 order-lg-1">
            <div className="order-summary-card">
              <h2 className="order-summary-title">ملخص الطلب</h2>

              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-label">إجمالى سعر المنتاجات</span>
                  <div className="summary-price">
                    <span className="price-value">600</span>
                    <div className="sar-icon"></div>
                  </div>
                </div>

                <div className="summary-item">
                  <span className="summary-label">تكلفة زراعة النبات بعد التوصيل</span>
                  <div className="summary-price">
                    <span className="price-value">30</span>
                    <div className="sar-icon"></div>
                  </div>
                </div>

                <div className="summary-item">
                  <span className="summary-label">مصاريف الشحن</span>
                  <div className="summary-price">
                    <span className="price-value">20</span>
                    <div className="sar-icon"></div>
                  </div>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span className="total-label">إجمالى سعر الطلب</span>
                <div className="total-price">
                  <span className="total-value">650</span>
                  <div className="sar-icon"></div>
                </div>
              </div>

              <button className="checkout-btn">
                <span className="checkout-text">متابعة إلى الدفع</span>
                <div className="checkout-arrow"></div>
              </button>
            </div>
          </div>

          {/* Right Side - Cart Items */}
          <div className="col-lg-8 order-lg-2">
            <h1 className="cart-title">سلة التسوق</h1>

            {/* Table Header */}
            <div className="cart-header">
              <div className="header-left">
                <span className="header-item">صورة النبتة</span>
                <span className="header-item">إسم النبتة</span>
              </div>
              <div className="header-right">
                <span className="header-item">اللون</span>
                <span className="header-item">الكمية</span>
                <span className="header-item">السعر</span>
                <span className="header-item">إجمالى السعر</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={item.id} className="cart-item">
                  <div className="item-left">
                    <div className="product-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="product-info">
                      <div className="product-name">
                        {item.name}
                        <br />
                        {item.latinName}
                      </div>
                    </div>
                  </div>

                  <div className="item-right">
                    <div className="color-selector">
                      <div
                        className="color-circle"
                        style={{ backgroundColor: item.colorHex }}
                      ></div>
                      <span className="color-name">{item.color}</span>
                    </div>

                    <div className="quantity-control">
                      <button
                        className="quantity-btn minus"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <div className="minus-icon"></div>
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn plus"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <div className="plus-icon"></div>
                      </button>
                    </div>

                    <div className="item-price">
                      <span className="price-value">{item.price}</span>
                      <div className="sar-icon"></div>
                    </div>

                    <div className="item-total">
                      <span className="total-value">{item.total}</span>
                      <div className="sar-icon"></div>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <div className="delete-icon"></div>
                    </button>
                  </div>

                  {index < cartItems.length - 1 && <div className="item-divider"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;