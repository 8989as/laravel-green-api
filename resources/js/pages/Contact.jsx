import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import '../components/contact.css';
import { useTranslation } from 'react-i18next';
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

// Simple icon components to replace FontAwesome
const MapIcon = () => <span>📍</span>;
const EnvelopeIcon = () => <span>📧</span>;
const PhoneIcon = () => <span>📞</span>;

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  return (
    <>
      <Navbar />
      <Breadcrumb items={[
                { label: t('home'), url: '/' },
                { label: t('contact'), active: true }
            ]} />
      <div className="container my-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="contact-heading text-center mb-4">{isRTL ? 'تواصل معنا - فريقنا جاهز لخدمتك' : 'Contact Us - Our Team is Ready to Help You'}</h1>
        <p className="contact-subheading text-center mb-5">{isRTL ? 'سواء كان عندك استفسار عن نباتاتنا، أو تحتاج مساعدة في الطلب، فريقنا موجود عشانك.' : 'Whether you have questions about our plants or need help with an order, our team is here for you.'}</p>
        <div className="row g-5">
          <div className={`col-lg-5 d-flex flex-column gap-4 ${isRTL ? 'order-1' : 'order-2'}`}> 
            {/* Address */}
            <div className="contact-info-item">
              <div className="contact-info-header">
                <div className="info-icon-wrapper">
                  {/* <img src="https://placehold.co/18x18/3D853C/ECF3EC?text=L" alt="Location Icon" className="info-icon" /> */}
                  <MapIcon />
                </div>
                <h5 className="info-title mb-0">{isRTL ? 'العنوان' : 'Address'}</h5>
              </div>
              <p className="info-content mb-0">{isRTL ? 'الرياض - المملكة العربية السعودية' : 'Riyadh - Kingdom of Saudi Arabia'}</p>
            </div>
            {/* Email Addresses */}
            <div className="contact-info-item">
              <div className="contact-info-header">
                <div className="info-icon-wrapper">
                  {/* <img src="https://placehold.co/18x18/3D853C/ECF3EC?text=E" alt="Email Icon" className="info-icon" /> */}
                  <EnvelopeIcon />
                </div>
                <h5 className="info-title mb-0">{isRTL ? 'البريد الإلكتروني' : 'Email'}</h5>
              </div>
              <div className="info-content">
                <div>
                  <span>info@almasaratksa.com</span>
                  <span> - </span>
                  <span>mktg@almasaratksa.com</span>
                </div>
                <div>nurs@almasaratksa.com</div>
              </div>
            </div>
            {/* Phone Numbers */}
            <div className="contact-info-item">
              <div className="contact-info-header">
                <div className="info-icon-wrapper">
                  {/* <img src="https://placehold.co/18x18/3D853C/ECF3EC?text=P" alt="Phone Icon" className="info-icon" /> */}
                  <PhoneIcon />
                </div>
                <h5 className="info-title mb-0">{isRTL ? 'أرقام الجوال' : 'Phone Numbers'}</h5>
              </div>
              <div className="info-content">
                <div>
                  <span>(+966) 59 494 0950</span>
                  <span> - </span>
                  <span>(+966) 53 719 0488</span>
                </div>
                <div>(+966) 58 071 6038</div>
              </div>
            </div>
          </div>
          <div className={`col-lg-7 ${isRTL ? 'order-2' : 'order-1'}`}>
            <form className="contact-form row g-3">
              {/* Name Field */}
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">{isRTL ? 'الإسم' : 'Name'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name" 
                  defaultValue={isRTL ? 'نورة عبدالله العتيبي' : 'Noura Abdullah AlOtaibi'} 
                />
              </div>
              {/* Phone Number Field */}
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">{isRTL ? 'رقم الجوال' : 'Phone Number'}</label>
                <div className="input-group phone-input"> 
                  <span className="input-group-text bg-white">
                    <img src="https://placehold.co/31x20/73AF00/F5F5F5?text=SA" alt="Saudi Arabia Flag" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="phone" 
                    defaultValue="0501234567" 
                  />
                </div>
              </div>
              {/* Email Field */}
              <div className="col-12">
                <label htmlFor="email" className="form-label">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  defaultValue="noura.alotaibi@email.com" 
                />
              </div>
              {/* Message Field */}
              <div className="col-12">
                <label htmlFor="message" className="form-label">{isRTL ? 'الرسالة' : 'Message'}</label>
                <textarea 
                  className="form-control" 
                  id="message" 
                  rows="4" 
                  defaultValue={isRTL ? 'أكتب رسالتك هنا ...' : 'Write your message here...'}
                ></textarea>
              </div>
              {/* Submit Button */}
              <div className="col-12 submit-btn-wrapper"> 
                <button type="submit" className="btn btn-primary">
                  <span>{isRTL ? 'إرسال' : 'Send'}</span>
                  {/* <img 
                    src="https://placehold.co/16x17/FFFFFF/FFFFFF?text=%3E" 
                    alt="Send Icon" 
                    className="send-icon" 
                  /> */}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
