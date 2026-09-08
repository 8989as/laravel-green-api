import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import './PrivacyPolicy.css';

const Section = ({ icon, title, children }) => (
  <div className="privacy-section">
    <div className="privacy-section-header">
      <span className="privacy-section-icon">{icon}</span>
      <h2 className="privacy-section-title">{title}</h2>
    </div>
    <div className="privacy-section-body">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <Navbar />
      <Breadcrumb
        items={[
          { label: isRTL ? 'الرئيسية' : 'Home', url: '/' },
          { label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy', active: true },
        ]}
      />

      {/* Hero Banner */}
      <div className="privacy-hero">
        <div className="container">
          <div className="privacy-hero-content text-center">
            <div className="privacy-hero-icon">🔒</div>
            <h1 className="privacy-hero-title">
              {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="privacy-hero-subtitle">
              {isRTL
                ? 'مزرعة مسراتكو – نحن نأخذ خصوصيتك على محمل الجد'
                : 'Masaratco Farm – We take your privacy seriously'}
            </p>
            <div className="privacy-last-updated">
              <span className="privacy-badge">
                {isRTL ? 'آخر تحديث: 2025' : 'Last Updated: 2025'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="privacy-content-wrapper" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">

              {/* Intro */}
              <div className="privacy-intro-card">
                <p className="privacy-intro-text">
                  {isRTL
                    ? 'يسعدنا في مزرعة مسراتكو أن نوضح لك كيفية جمع واستخدام وحماية بياناتك الشخصية. هذه السياسة تنطبق على موقعنا الإلكتروني وجميع خدماتنا.'
                    : 'At Masaratco Farm, we are committed to explaining how we collect, use, and protect your personal data. This policy applies to our website and all our services.'}
                </p>
              </div>

              {/* Section 1 – Data We Collect */}
              <Section icon="📋" title={isRTL ? 'البيانات التي نجمعها' : 'Data We Collect'}>
                <p>
                  {isRTL
                    ? 'نقوم بجمع المعلومات التالية لتقديم أفضل تجربة تسوق ممكنة:'
                    : 'We collect the following information to provide the best possible shopping experience:'}
                </p>
                <ul className="privacy-list">
                  <li>
                    <span className="list-icon">👤</span>
                    <span>
                      {isRTL
                        ? 'الاسم الكامل، رقم الجوال، البريد الإلكتروني'
                        : 'Full name, mobile number, email address'}
                    </span>
                  </li>
                  <li>
                    <span className="list-icon">📦</span>
                    <span>
                      {isRTL
                        ? 'عنوان الشحن، تفاصيل الطلبات'
                        : 'Shipping address, order details'}
                    </span>
                  </li>
                  <li>
                    <span className="list-icon">🖥️</span>
                    <span>
                      {isRTL
                        ? 'بيانات تقنية مثل عنوان IP وملفات تعريف الارتباط (Cookies)'
                        : 'Technical data such as IP address and cookies'}
                    </span>
                  </li>
                </ul>
              </Section>

              {/* Section 2 – How We Use Data */}
              <Section icon="⚙️" title={isRTL ? 'كيفية استخدام البيانات' : 'How We Use Your Data'}>
                <p>
                  {isRTL
                    ? 'نستخدم البيانات التي نجمعها للأغراض التالية:'
                    : 'We use the data we collect for the following purposes:'}
                </p>
                <ul className="privacy-list">
                  <li>
                    <span className="list-icon">✅</span>
                    <span>{isRTL ? 'معالجة وتنفيذ الطلبات' : 'Processing and fulfilling orders'}</span>
                  </li>
                  <li>
                    <span className="list-icon">✅</span>
                    <span>{isRTL ? 'التواصل مع العملاء حول طلباتهم' : 'Communicating with customers about their orders'}</span>
                  </li>
                  <li>
                    <span className="list-icon">✅</span>
                    <span>{isRTL ? 'تحسين جودة خدماتنا وتطوير موقعنا' : 'Improving our service quality and website'}</span>
                  </li>
                  <li>
                    <span className="list-icon">✅</span>
                    <span>{isRTL ? 'إرسال عروض وتحديثات (بموافقتك)' : 'Sending offers and updates (with your consent)'}</span>
                  </li>
                </ul>
              </Section>

              {/* Section 3 – Data Sharing */}
              <Section icon="🤝" title={isRTL ? 'مشاركة البيانات مع أطراف أخرى' : 'Sharing Data with Third Parties'}>
                <p>
                  {isRTL
                    ? 'قد نشارك بياناتك مع الأطراف التالية لغرض إتمام خدماتنا فقط:'
                    : 'We may share your data with the following parties solely to complete our services:'}
                </p>
                <div className="privacy-cards-grid">
                  <div className="privacy-mini-card">
                    <span className="mini-card-icon">🚚</span>
                    <span>{isRTL ? 'شركات الشحن والتوصيل' : 'Shipping & delivery companies'}</span>
                  </div>
                  <div className="privacy-mini-card">
                    <span className="mini-card-icon">💳</span>
                    <span>{isRTL ? 'بوابات الدفع الإلكتروني' : 'Electronic payment gateways'}</span>
                  </div>
                  <div className="privacy-mini-card">
                    <span className="mini-card-icon">🔧</span>
                    <span>{isRTL ? 'مزودو الخدمات التقنية' : 'Technical service providers'}</span>
                  </div>
                </div>
                <div className="privacy-note">
                  <span className="note-icon">ℹ️</span>
                  <span>
                    {isRTL
                      ? 'لا نبيع بياناتك الشخصية لأي طرف ثالث بأي حال من الأحوال.'
                      : 'We never sell your personal data to any third party under any circumstances.'}
                  </span>
                </div>
              </Section>

              {/* Section 4 – Data Protection */}
              <Section icon="🛡️" title={isRTL ? 'حماية البيانات' : 'Data Protection'}>
                <p>
                  {isRTL
                    ? 'نطبق إجراءات أمنية متعددة لحماية بياناتك، تشمل:'
                    : 'We implement multiple security measures to protect your data, including:'}
                </p>
                <ul className="privacy-list">
                  <li>
                    <span className="list-icon">🔐</span>
                    <span>{isRTL ? 'تشفير البيانات باستخدام بروتوكول SSL' : 'Data encryption using SSL protocol'}</span>
                  </li>
                  <li>
                    <span className="list-icon">🔐</span>
                    <span>{isRTL ? 'حماية الخوادم ومراقبتها بشكل مستمر' : 'Continuous server protection and monitoring'}</span>
                  </li>
                  <li>
                    <span className="list-icon">🔐</span>
                    <span>{isRTL ? 'تقييد الوصول إلى البيانات للموظفين المخولين فقط' : 'Restricting data access to authorized personnel only'}</span>
                  </li>
                </ul>
              </Section>

              {/* Section 5 – User Rights */}
              <Section icon="⚖️" title={isRTL ? 'حقوق المستخدم' : 'Your Rights'}>
                <p>
                  {isRTL
                    ? 'لديك الحق في أي وقت في:'
                    : 'You have the right at any time to:'}
                </p>
                <ul className="privacy-list">
                  <li>
                    <span className="list-icon">👁️</span>
                    <span>{isRTL ? 'طلب الاطلاع على بياناتك الشخصية' : 'Request access to your personal data'}</span>
                  </li>
                  <li>
                    <span className="list-icon">✏️</span>
                    <span>{isRTL ? 'طلب تصحيح أي معلومات غير دقيقة' : 'Request correction of any inaccurate information'}</span>
                  </li>
                  <li>
                    <span className="list-icon">🗑️</span>
                    <span>{isRTL ? 'طلب حذف بياناتك من أنظمتنا' : 'Request deletion of your data from our systems'}</span>
                  </li>
                </ul>
                <div className="privacy-contact-box">
                  <div className="contact-box-title">
                    {isRTL ? 'للتواصل بشأن بياناتك:' : 'To contact us about your data:'}
                  </div>
                  <div className="contact-box-items">
                    <a href="mailto:info@almasaratksa.com" className="contact-box-item">
                      <span>📧</span>
                      <span>info@almasaratksa.com</span>
                    </a>
                    <a href="tel:+966114510420" className="contact-box-item">
                      <span>📞</span>
                      <span>+966 11 451 0420</span>
                    </a>
                  </div>
                </div>
              </Section>

              {/* Section 6 – Cookies */}
              <Section icon="🍪" title={isRTL ? 'ملفات تعريف الارتباط (Cookies)' : 'Cookies'}>
                <p>
                  {isRTL
                    ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا وتطوير أدائه. تشمل الكوكيز المستخدمة:'
                    : 'We use cookies to improve your experience on our site and enhance its performance. These include:'}
                </p>
                <ul className="privacy-list">
                  <li>
                    <span className="list-icon">🔵</span>
                    <span>{isRTL ? 'كوكيز ضرورية لعمل الموقع' : 'Essential cookies for website functionality'}</span>
                  </li>
                  <li>
                    <span className="list-icon">🔵</span>
                    <span>{isRTL ? 'كوكيز لتحليل وقياس الأداء' : 'Analytics and performance measurement cookies'}</span>
                  </li>
                  <li>
                    <span className="list-icon">🔵</span>
                    <span>{isRTL ? 'كوكيز لتخصيص المحتوى وتذكر تفضيلاتك' : 'Cookies to personalize content and remember your preferences'}</span>
                  </li>
                </ul>
                <p className="mt-3">
                  {isRTL
                    ? 'يمكنك التحكم في إعدادات الكوكيز من خلال إعدادات متصفحك.'
                    : 'You can control cookie settings through your browser settings.'}
                </p>
              </Section>

              {/* Section 7 – External Links */}
              <Section icon="🔗" title={isRTL ? 'الروابط الخارجية' : 'External Links'}>
                <p>
                  {isRTL
                    ? 'قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لسنا مسؤولين عن سياسات الخصوصية أو محتوى هذه المواقع. نوصيك بمراجعة سياسات الخصوصية الخاصة بأي موقع تزوره.'
                    : 'Our website may contain links to external sites. We are not responsible for the privacy policies or content of those sites. We recommend reviewing the privacy policies of any site you visit.'}
                </p>
              </Section>

              {/* Section 8 – Policy Updates */}
              <Section icon="🔄" title={isRTL ? 'تحديثات سياسة الخصوصية' : 'Privacy Policy Updates'}>
                <p>
                  {isRTL
                    ? 'قد نقوم بتحديث هذه السياسة بشكل دوري لمواكبة التغييرات القانونية أو التشغيلية. سنخطرك بأي تحديثات جوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع.'
                    : 'We may periodically update this policy to reflect legal or operational changes. We will notify you of any significant updates via email or a prominent notice on the site.'}
                </p>
                <div className="privacy-note">
                  <span className="note-icon">📅</span>
                  <span>
                    {isRTL
                      ? 'نشجعك على مراجعة هذه الصفحة بانتظام للاطلاع على آخر التحديثات.'
                      : 'We encourage you to review this page regularly for the latest updates.'}
                  </span>
                </div>
              </Section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
