import React from 'react';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
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
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />
      <Cart />
      <Footer />
    </>
  );
};

export default CartPage;
