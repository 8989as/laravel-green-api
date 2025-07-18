
import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { useTranslation } from 'react-i18next';
import '../components/Navbar/Navbar.css';
import { usePage } from '@inertiajs/inertia-react';


// Placeholder icons (replace with actual SVGs or icon components later)
const IconCart = () => <span role="img" aria-label="cart">🛒</span>;
const IconProfile = () => <span role="img" aria-label="profile">👤</span>;
const IconFavorite = () => <span role="img" aria-label="favorite">❤️</span>;
const IconLang = () => <span role="img" aria-label="lang">🌐</span>;



interface Category {
  id: number;
  category_ar: string;
  category_en: string;
  slug: string;
}


const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { props } = usePage<any>();
  const categories: Category[] = props.categories || [];

  // Language switcher (placeholder, replace with actual logic if needed)
  const toggleLanguage = () => {
    const newLang = isRTL ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  // For categories bar order
  const displayedCategories = isRTL ? categories : [...categories].reverse();

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar-bg py-0 pt-4">
        <div className="container-fluid px-3 px-md-5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          {/* Logo */}
          <Link href="/" className="navbar-brand p-0 me-3">
            <img
              className="MasaratcoLogo1"
              src="/assets/images/logo.svg"
              alt="Logo"
              style={{ height: 64 }}
            />
          </Link>
          {/* Toggler */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* NavLinks - Collapsible */}
          <div className="collapse navbar-collapse" id="mainNavbar">
            <div className="navbar-nav ms-lg-3 gap-lg-3">
              <Link href="/" className="menu-link nav-link">{t('home') || 'Home'}</Link>
              <Link href="/shop" className="menu-link nav-link">{t('store') || 'Shop'}</Link>
              <Link href="/landscape" className="menu-link nav-link">{t('landscaping') || 'Landscape'}</Link>
              <Link href="/events" className="menu-link nav-link">{t('event') || 'Events'}</Link>
              <Link href="/about" className="menu-link nav-link">{t('about') || 'About'}</Link>
              <Link href="/contact" className="menu-link nav-link">{t('contact') || 'Contact'}</Link>
              {/* Add two more links as requested */}
              {/* <Link href="/portfolio" className="menu-link nav-link">{t('portfolio') || 'Portfolio'}</Link> */}
              {/* <Link href="/blog" className="menu-link nav-link">{t('blog') || 'Blog'}</Link> */}
            </div>
          </div>
          {/* Icons & Auth */}
          <div className="d-flex align-items-center ms-auto gap-2">
            <button className="icon-frame" onClick={toggleLanguage} title="Switch Language">
              <IconLang />
            </button>
            <Link href="/cart" className="icon-frame" title="Cart">
              <IconCart />
              {/* Cart badge placeholder */}
              {/* <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill">2</span> */}
            </Link>
            <Link href="/profile" className="icon-frame" title="Profile">
              <IconProfile />
            </Link>
            <Link href="/favorites" className="icon-frame" title="Favorites">
              <IconFavorite />
            </Link>
          </div>
        </div>
      </nav>
      {/* Categories Bar below nav */}
      <div className="container-fluid px-3 px-md-5 border-top mt-2 pt-4 pb-2">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2 px-2">
            <img
              className="categories-icon"
              src="/storage/assets/cat_icon.svg"
              alt="Categories Icon"
            />
            <div className="categories-label">{t('categories') || 'Categories'}</div>
          </div>
          {displayedCategories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/shop/category/${category.id}`}
              className="category-frame px-3 py-2"
              style={{ textDecoration: 'none' }}
            >
              <div className="category-text">
                {isRTL ? category.category_ar : category.category_en}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
