import React from 'react';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';

const CartPage = () => {
  const { t } = useTranslation();
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('cart'), url: '/cart', active: true }
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Cart />
    </>
  );
};

export default CartPage;
