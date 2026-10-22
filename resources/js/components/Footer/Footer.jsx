import './Footer.css';
import { useTranslation } from 'react-i18next';
import useRTL from '../../hooks/useRTL';

/**
 * Footer Component - Fully responsive with proper RTL support
 * 
 * Features:
 * - Mobile-first responsive grid
 * - Proper RTL/LTR handling with useRTL hook
 * - SVG icons instead of emoji
 * - Semantic HTML structure
 * - Accessibility improvements
 */
const Footer = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  // Social media links
  const socialLinks = [
    { name: 'facebook', url: 'https://facebook.com', label: t('facebook', 'Facebook') },
    { name: 'instagram', url: 'https://instagram.com', label: t('instagram', 'Instagram') },
    { name: 'twitter', url: 'https://twitter.com', label: t('twitter', 'Twitter') },
    { name: 'youtube', url: 'https://youtube.com', label: t('youtube', 'YouTube') },
  ];

  return (
    <footer className="footer">
      {/* Main footer content section */}
      <div className="footer-main">
        <div className="container">
          <div className="row gy-4 gy-md-5">

            {/* Column 1: Contact Information */}
            <div className="col-6 col-md-3">
              <h4 className="footer-title">
                {t('contactUs', isRTL ? 'تواصل معنا' : 'Contact Us')}
              </h4>
              <div className="footer-contact-items">
                <div className="footer-contact-item">
                  <div className="footer-contact-label">
                    {t('address', isRTL ? 'العنوان' : 'Address')}
                  </div>
                  <div className="footer-contact-value">
                    {t('addressValue', isRTL ? 'الرياض - المملكة العربية السعودية' : 'Riyadh - Kingdom of Saudi Arabia')}
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-label">
                    {t('mobile', isRTL ? 'الجوال' : 'Mobile')}
                  </div>
                  <div className="footer-contact-value">
                    <a href="tel:+966594940950">(+966) 594940950</a>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-label">
                    {t('email', isRTL ? 'البريد الإلكتروني' : 'Email')}
                  </div>
                  <div className="footer-contact-value">
                    <a href="mailto:info@almasaratksa.com">info@almasaratksa.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Plant Categories */}
            <div className="col-6 col-md-3">
              <h4 className="footer-title">
                {t('plantCategories', isRTL ? 'تصنيفات النباتات' : 'Plant Categories')}
              </h4>
              <nav className="footer-nav">
                <a href="/products?category=trees" className="footer-link">
                  {t('trees', isRTL ? 'أشجار' : 'Trees')}
                </a>
                <a href="/products?category=shrubs" className="footer-link">
                  {t('shrubs', isRTL ? 'شجيرات' : 'Shrubs')}
                </a>
                <a href="/products?category=indoor" className="footer-link">
                  {t('indoorPlants', isRTL ? 'نباتات داخلية' : 'Indoor Plants')}
                </a>
                <a href="/products?category=outdoor" className="footer-link">
                  {t('outdoorPlants', isRTL ? 'نباتات خارجية' : 'Outdoor Plants')}
                </a>
              </nav>
            </div>

            {/* Column 3: Quick Links */}
            <div className="col-6 col-md-3">
              <h4 className="footer-title">
                {t('quickLinks', isRTL ? 'روابط سريعة' : 'Quick Links')}
              </h4>
              <nav className="footer-nav">
                <a href="/" className="footer-link">
                  {t('home', isRTL ? 'الرئيسية' : 'Home')}
                </a>
                <a href="/about" className="footer-link">
                  {t('about', isRTL ? 'من نحن' : 'About Us')}
                </a>
                <a href="/landscape" className="footer-link">
                  {t('landscaping', isRTL ? 'تنسيق و صيانة الحدائق' : 'Landscaping & Maintenance')}
                </a>
                <a href="/contact" className="footer-link">
                  {t('contact', isRTL ? 'تواصل معنا' : 'Contact Us')}
                </a>
                <a href="/privacy-policy" className="footer-link">
                  {t('privacyPolicy', isRTL ? 'سياسة الخصوصية' : 'Privacy Policy')}
                </a>
                <a href="/refund-policy" className="footer-link">
                  {t('refundPolicy', isRTL ? 'التوصيل والإرجاع' : 'Shipping & Returns')}
                </a>
              </nav>
            </div>

            {/* Column 4: Social Media */}
            <div className="col-6 col-md-3">
              <h4 className="footer-title">
                {t('followUs', isRTL ? 'تابعونا على' : 'Follow Us')}
              </h4>
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {social.name === 'facebook' && (
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {social.name === 'instagram' && (
                        <>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                      {social.name === 'twitter' && (
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                      {social.name === 'youtube' && (
                        <>
                          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom footer section with copyright and payment icons */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center gy-3">

            {/* Payment Icons */}
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="payment-methods">
                <img src="https://placehold.co/57x20/ffffff/333333?text=VISA" alt="Visa" className="payment-icon" loading="lazy" />
                <img src="https://placehold.co/26x20/ffffff/333333?text=M" alt="Mada" className="payment-icon" loading="lazy" />
                <img src="https://placehold.co/50x20/ffffff/333333?text=MC" alt="Mastercard" className="payment-icon" loading="lazy" />
                <img src="https://placehold.co/46x20/ffffff/333333?text=Apple" alt="Apple Pay" className="payment-icon" loading="lazy" />
                <img src="https://placehold.co/60x20/ffffff/333333?text=STC" alt="STC Pay" className="payment-icon" loading="lazy" />
              </div>
            </div>

            {/* Copyright Text */}
            <div className="col-lg-6 order-1 order-lg-2">
              <p className="copyright-text">
                {isRTL ? (
                  <>
                    © 2025 {t('allRightsReserved', 'جميع الحقوق محفوظة لدى')}
                    {' '}<a href="/" className="copyright-link">مزرعة مسراتكو</a>{' '}
                    | {t('designedBy', 'تصميم و برمجة')}
                    {' '}<a href="https://tigercode.sa" className="copyright-link" target="_blank" rel="noopener noreferrer">تايجر كود</a>{' '}
                    | {t('commercialReg', 'السجل التجاري')}: 7025487286
                  </>
                ) : (
                  <>
                    © 2025 {t('allRightsReserved', 'All rights reserved to')}
                    {' '}<a href="/" className="copyright-link">Masaratco Farm</a>{' '}
                    | {t('designedBy', 'Designed & Developed by')}
                    {' '}<a href="https://tigercode.sa" className="copyright-link" target="_blank" rel="noopener noreferrer">Tiger Code</a>{' '}
                    | {t('commercialReg', 'Commercial Registration')}: 7025487286
                  </>
                )}
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
