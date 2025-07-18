import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container py-5">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className={`footer-contact-wrapper ${isRTL ? 'text-end' : 'text-start'}`}>
                <div className="footer-contact-title mb-4">تواصل معنا</div>
                <div className="d-flex flex-column gap-3">
                  <div className="footer-contact-item">
                    <div className="footer-contact-label mb-1">العنوان</div>
                    <div className="footer-contact-value">الرياض - المملكة العربية السعودية</div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-label mb-1">الجوال</div>
                    <div className="footer-contact-value">(+966) 59 494 0950</div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-label mb-1">البريد الإلكترونى</div>
                    <div className="footer-contact-value">info@almasaratksa.com</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={`h-100 d-flex flex-column ${isRTL ? 'align-items-end' : 'align-items-start'}`}>
                <h4 className="footer-title mb-4">تصنيفات النباتات</h4>
                <div className="d-flex flex-column gap-3">
                  <a href="/trees" className="footer-link">أشجار</a>
                  <a href="/shrubs" className="footer-link">شجيرات</a>
                  <a href="/indoor" className="footer-link">نباتات داخلية</a>
                  <a href="/outdoor" className="footer-link">نباتات خارجية</a>
                  <a href="/flowering" className="footer-link">نباتات مُزهرة</a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={`h-100 d-flex flex-column ${isRTL ? 'align-items-end' : 'align-items-start'}`}>
                <h4 className="footer-title mb-4">روابط سريعة</h4>
                <div className="d-flex flex-column gap-3">
                  <a href="/" className="footer-link active">الرئيسية</a>
                  <a href="/about" className="footer-link">من نحن</a>
                  <a href="/landscape" className="footer-link">أعمال اللاند سكيب</a>
                  <a href="/contact" className="footer-link">تواصل معنا</a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={`h-100 d-flex flex-column ${isRTL ? 'align-items-end' : 'align-items-start'}`}>
                <h4 className="footer-title mb-4">تابعونا على</h4>
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="youtube">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <img src="https://placehold.co/57x20" alt="Payment 1" className="payment-icon" />
                <img src="https://placehold.co/26x20" alt="Payment 2" className="payment-icon" />
                <img src="https://placehold.co/50x20" alt="Payment 3" className="payment-icon" />
                <img src="https://placehold.co/46x20" alt="Payment 4" className="payment-icon" />
                <img src="https://placehold.co/60x20" alt="Payment 5" className="payment-icon" />
              </div>
            </div>
            <div className={`col-lg-6 order-1 order-lg-2 ${isRTL ? 'text-end' : 'text-start'} text-lg-end`}>
              <div className="copyright-text">
                <span className="text-dark-green">© 2025 جميع الحقوق محفوظة لدى</span>
                <span className="text-primary-green fw-bold"> مزرعة مسراتكو </span>
                <span className="text-dark-green">| تصميم و برمجة </span>
                <span className="text-primary-green fw-bold">تايجر كود</span>
                <span className="text-dark-green">.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;