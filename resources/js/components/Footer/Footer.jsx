import './Footer.css';
import { useTranslation } from 'react-i18next';

/**
 * A fully responsive footer component using Bootstrap 5.3.
 * * Best Practices Applied:
 * - Mobile-first responsive grid (`col-6`, `col-md-3`).
 * - Bootstrap utility classes for spacing (`gy-5`, `gap-3`) and alignment.
 * - Responsive text alignment (`text-center`, `text-md-start`) to avoid extra CSS.
 * - Relies on Bootstrap's native RTL support (by setting `dir="rtl"` on the <html> tag)
 * instead of manual JavaScript checks, simplifying the component.
 * - `aria-label` attributes are kept for accessibility on social media links.
 */
const Footer = () => {
  // The `useTranslation` hook is kept for text localization, but the `isRTL`
  // check for styling is no longer needed with Bootstrap 5's logical properties.
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <footer className="footer">
      {/* Main footer content section */}
      <div className="footer-main py-5">
        <div className="container">
          <div className="row gy-5">

            {/* Column 1: Contact Information */}
            <div className={`col-6 col-md-3 text-${isRTL ? 'end' : 'center'} text-md-${isRTL ? 'end' : 'start'}`}>
              <h4 className="footer-title mb-4">
                {isRTL ? 'تواصل معنا' : 'Contact Us'}
              </h4>
              <div className="d-flex flex-column gap-3">
                <div className="footer-contact-item">
                  <div className="footer-contact-label mb-1">
                    {isRTL ? 'العنوان' : 'Address'}
                  </div>
                  <div className="footer-contact-value">
                    {isRTL ? 'الرياض - المملكة العربية السعودية' : 'Riyadh - Kingdom of Saudi Arabia'}
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-label mb-1">
                    {isRTL ? 'الجوال' : 'Mobile'}
                  </div>
                  <div className="footer-contact-value">(+966) 59 494 0950</div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-label mb-1">
                    {isRTL ? 'البريد الإلكترونى' : 'Email'}
                  </div>
                  <div className="footer-contact-value">info@almasaratksa.com</div>
                </div>
              </div>
            </div>

            {/* Column 2: Plant Categories */}
            <div className={`col-6 col-md-3 text-${isRTL ? 'end' : 'center'} text-md-${isRTL ? 'end' : 'start'}`}>
              <h4 className="footer-title mb-4">
                {isRTL ? 'تصنيفات النباتات' : 'Plant Categories'}
              </h4>
              <div className="d-flex flex-column gap-3">
                <a href="/products" className="footer-link">
                  {isRTL ? 'أشجار' : 'Trees'}
                </a>
                <a href="/products" className="footer-link">
                  {isRTL ? 'شجيرات' : 'Shrubs'}
                </a>
                <a href="/products" className="footer-link">
                  {isRTL ? 'نباتات داخلية' : 'Indoor Plants'}
                </a>
                <a href="/products" className="footer-link">
                  {isRTL ? 'نباتات خارجية' : 'Outdoor Plants'}
                </a>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div className={`col-6 col-md-3 text-${isRTL ? 'end' : 'center'} text-md-${isRTL ? 'end' : 'start'}`}>
              <h4 className="footer-title mb-4">
                {isRTL ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <div className="d-flex flex-column gap-3">
                <a href="/" className="footer-link active">
                  {isRTL ? 'الرئيسية' : 'Home'}
                </a>
                <a href="/about" className="footer-link">
                  {isRTL ? 'من نحن' : 'About Us'}
                </a>
                <a href="/landscape" className="footer-link">
                  {isRTL ? 'تنسيق و صيانة الحدائق' : 'Landscaping & Garden Maintenance'}
                </a>
                <a href="/contact" className="footer-link">
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </div>
            </div>

            {/* Column 4: Social Media */}
            <div className={`col-6 col-md-3 text-${isRTL ? 'end' : 'center'} text-md-${isRTL ? 'end' : 'start'}`}>
              <h4 className="footer-title mb-4">
                {isRTL ? 'تابعونا على' : 'Follow Us'}
              </h4>
              <div className="social-links d-flex justify-content-center justify-content-md-start gap-3">
                <a href="#" className="social-link" aria-label="youtube"><i className="fab fa-youtube"></i></a>
                <a href="#" className="social-link" aria-label="twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link" aria-label="instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link" aria-label="facebook"><i className="fab fa-facebook-f"></i></a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom footer section with copyright and payment icons */}
      <div className="footer-bottom py-4">
        <div className="container">
          <div className="row align-items-center gy-3">

            {/* Payment Icons */}
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 flex-wrap">
                <img src="https://placehold.co/57x20/ffffff/333333?text=VISA" alt="Visa" className="payment-icon" />
                <img src="https://placehold.co/26x20/ffffff/333333?text=M" alt="Mada" className="payment-icon" />
                <img src="https://placehold.co/50x20/ffffff/333333?text=Mastercard" alt="Mastercard" className="payment-icon" />
                <img src="https://placehold.co/46x20/ffffff/333333?text=ApplePay" alt="Apple Pay" className="payment-icon" />
                <img src="https://placehold.co/60x20/ffffff/333333?text=STCPay" alt="STC Pay" className="payment-icon" />
              </div>
            </div>

            {/* Copyright Text */}
            <div className="col-lg-6 order-1 order-lg-2">
              <div className={`copyright-text text-center text-lg-${isRTL ? 'end' : 'start'}`}>
                {isRTL ? (
                  <>
                    <span className="text-dark-green">© 2025 جميع الحقوق محفوظة لدى</span>
                    <a href="#" className="text-primary-green fw-bold"> مزرعة مسراتكو </a>
                    <span className="text-dark-green">| تصميم و برمجة </span>
                    <a href="#" className="text-primary-green fw-bold">تايجر كود</a>
                    <span className="text-dark-green">.</span>
                  </>
                ) : (
                  <>
                    <span className="text-dark-green">© 2025 All rights reserved to</span>
                    <a href="#" className="text-primary-green fw-bold"> Masaratco Farm </a>
                    <span className="text-dark-green">| Designed & Developed by </span>
                    <a href="#" className="text-primary-green fw-bold">Tiger Code</a>
                    <span className="text-dark-green">.</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
