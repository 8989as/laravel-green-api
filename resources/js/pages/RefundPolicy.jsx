import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useTranslation } from 'react-i18next';
import './RefundPolicy.css';

const Section = ({ icon, title, children }) => (
  <div className="refund-section">
    <div className="refund-section-header">
      <span className="refund-section-icon">{icon}</span>
      <h2 className="refund-section-title">{title}</h2>
    </div>
    <div className="refund-section-body">{children}</div>
  </div>
);

const RefundPolicy = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <Navbar />
      <Breadcrumb
        items={[
          { label: isRTL ? 'الرئيسية' : 'Home', url: '/' },
          { label: isRTL ? 'التوصيل والإرجاع' : 'Shipping & Returns', active: true },
        ]}
      />

      {/* Hero Banner */}
      <div className="refund-hero">
        <div className="container">
          <div className="refund-hero-content text-center">
            <div className="refund-hero-icon">📦</div>
            <h1 className="refund-hero-title">
              {isRTL ? 'التوصيل والإرجاع' : 'Shipping & Returns'}
            </h1>
            <p className="refund-hero-subtitle">
              {isRTL
                ? 'مزرعة مسارتكو – نحرص على وصول نباتاتك بأفضل حالة'
                : 'Masaratco Farm – We ensure your plants arrive in perfect condition'}
            </p>
            <div className="refund-last-updated">
              <span className="refund-badge">
                {isRTL ? 'آخر تحديث: 2025' : 'Last Updated: 2025'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="refund-content-wrapper" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">

              {/* Intro */}
              <div className="refund-intro-card">
                <p className="refund-intro-text">
                  {isRTL
                    ? 'مرحبًا بك في صفحة التوصيل والإرجاع لموقع مزرعة مسارتكو لبيع النباتات الإلكتروني. نحن نسعى دائمًا لتوفير تجربة شراء مريحة وسهلة لعملائنا، ولذلك نقدم خدمات توصيل موثوقة وإرجاع سلس لضمان رضا العملاء.'
                    : 'Welcome to the Shipping and Returns page of Masaratco Farm online plant store. We always strive to provide a comfortable and easy shopping experience for our customers, which is why we offer reliable delivery services and smooth returns to ensure customer satisfaction.'}
                </p>
              </div>

              {/* Section 1 – Shipping */}
              <Section icon="🚚" title={isRTL ? 'التوصيل' : 'Shipping'}>
                <p>
                  {isRTL
                    ? 'نقوم بتوصيل النباتات إلى المناطق التي يتم تغطيتها من قبل خدمات الشحن المعتمدة في المملكة العربية السعودية. تعتمد تكلفة الشحن على الوزن والحجم وموقع العميل، ويتم تحديد تكلفة الشحن أثناء عملية الشراء.'
                    : 'We deliver plants to areas covered by authorized shipping services in the Kingdom of Saudi Arabia. Shipping costs depend on the weight, size, and customer location, and the shipping cost is determined during the purchase process.'}
                </p>
              </Section>

              {/* Section 2 – Delivery Time */}
              <Section icon="⏱️" title={isRTL ? 'مدة التوصيل' : 'Delivery Time'}>
                <p>
                  {isRTL
                    ? 'يتم تحديد مدة التوصيل حسب المنطقة التي يتم توصيل النباتات إليها، وتتراوح مدة التوصيل بين 2 و5 أيام عمل.'
                    : 'Delivery time is determined based on the area to which the plants are delivered, and delivery time ranges between 2 to 5 business days.'}
                </p>
                <div className="refund-highlight-box">
                  <div className="highlight-icon">📅</div>
                  <div className="highlight-content">
                    <div className="highlight-title">
                      {isRTL ? 'مدة التوصيل' : 'Delivery Duration'}
                    </div>
                    <div className="highlight-value">
                      {isRTL ? '2 - 5 أيام عمل' : '2 - 5 business days'}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Section 3 – Returns */}
              <Section icon="↩️" title={isRTL ? 'الإرجاع' : 'Returns'}>
                <p>
                  {isRTL
                    ? 'يمكن للعميل إرجاع النباتات إذا كانت تعاني من أي مشكلة في الجودة أو الحالة الصحية خلال مدة 3 أيام من استلام الشحنة. يجب على العميل الاتصال بفريق خدمة العملاء لدينا وتزويدنا بالتفاصيل اللازمة لترتيب إرجاع النباتات.'
                    : 'Customers can return plants if they suffer from any quality or health issues within 3 days of receiving the shipment. The customer must contact our customer service team and provide us with the necessary details to arrange the return of the plants.'}
                </p>
                <div className="refund-highlight-box">
                  <div className="highlight-icon">⏰</div>
                  <div className="highlight-content">
                    <div className="highlight-title">
                      {isRTL ? 'مدة الإرجاع' : 'Return Period'}
                    </div>
                    <div className="highlight-value">
                      {isRTL ? '3 أيام من تاريخ الاستلام' : '3 days from delivery date'}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Section 4 – Return Conditions */}
              <Section icon="📋" title={isRTL ? 'شروط الإرجاع' : 'Return Conditions'}>
                <p>
                  {isRTL
                    ? 'يجب أن تكون النباتات في حالة جيدة وغير مستخدمة، ويتحمل العميل تكاليف الشحن لإرجاع النباتات. يتم إجراء فحص للنباتات المرتجعة قبل الموافقة على الاسترداد.'
                    : 'Plants must be in good condition and unused. The customer bears the shipping costs for returning the plants. Returned plants are inspected before refund approval.'}
                </p>
                <ul className="refund-list">
                  <li>
                    <span className="list-icon">✓</span>
                    <span>
                      {isRTL
                        ? 'النباتات يجب أن تكون في حالة جيدة'
                        : 'Plants must be in good condition'}
                    </span>
                  </li>
                  <li>
                    <span className="list-icon">✓</span>
                    <span>
                      {isRTL
                        ? 'يتحمل العميل تكاليف الشحن للإرجاع'
                        : 'Customer bears return shipping costs'}
                    </span>
                  </li>
                  <li>
                    <span className="list-icon">✓</span>
                    <span>
                      {isRTL
                        ? 'يتم فحص النباتات المرتجعة قبل الموافقة'
                        : 'Returned plants are inspected before approval'}
                    </span>
                  </li>
                </ul>
              </Section>

              {/* Section 5 – Refund */}
              <Section icon="💰" title={isRTL ? 'الاسترداد' : 'Refund'}>
                <p>
                  {isRTL
                    ? 'يتم استرداد المبلغ المدفوع بعد استلام النباتات المرتجعة وتأكيد حالتها الجيدة. يتم استرداد المبلغ بنفس طريقة الدفع التي استخدمت في عملية الشراء.'
                    : 'The amount paid is refunded after receiving the returned plants and confirming their good condition. The refund is made using the same payment method used in the purchase process.'}
                </p>
                <div className="refund-note">
                  <span className="note-icon">ℹ️</span>
                  <span>
                    {isRTL
                      ? 'الاسترداد يتم بنفس طريقة الدفع الأصلية'
                      : 'Refund is processed through the original payment method'}
                  </span>
                </div>
              </Section>

              {/* Section 6 – Delivery Areas */}
              <Section icon="🗺️" title={isRTL ? 'ما هي المناطق التي يتم توصيل النباتات إليها؟' : 'Which Areas Do We Deliver To?'}>
                <p>
                  {isRTL
                    ? 'تعتمد المناطق التي يتم توصيل النباتات إليها على سياسة التوصيل التي نتبعها في موقع مزرعة مسارتكو. يمكننا توصيل النباتات إلى جميع أنحاء المملكة، وذلك يعتمد على الخدمات التي نقدمها وعلى الترتيبات التي نتخذها.'
                    : 'The areas to which plants are delivered depend on the delivery policy we follow at Masaratco Farm. We can deliver plants throughout the Kingdom, depending on the services we provide and the arrangements we make.'}
                </p>
                <p className="mt-3">
                  {isRTL
                    ? 'نحن نسعى دائمًا لتوفير خدمة التوصيل الموثوقة والفعالة لعملائنا، ونحن نعمل مع شركاء توصيل موثوقين لنضمن وصول النباتات إلى باب منزلك بأفضل حالاتها، يمكنكم التواصل معنا إذا كان لديكم أي استفسارات حول سياسة التوصيل التي نتبعها.'
                    : 'We always strive to provide reliable and efficient delivery service to our customers. We work with trusted delivery partners to ensure plants arrive at your doorstep in their best condition. You can contact us if you have any questions about our delivery policy.'}
                </p>
                <div className="refund-coverage-box">
                  <div className="coverage-icon">🇸🇦</div>
                  <div className="coverage-text">
                    {isRTL
                      ? 'التوصيل متاح لجميع أنحاء المملكة العربية السعودية'
                      : 'Delivery available throughout the Kingdom of Saudi Arabia'}
                  </div>
                </div>
              </Section>

              {/* Contact Section */}
              <div className="refund-contact-section">
                <div className="contact-section-icon">💬</div>
                <h3 className="contact-section-title">
                  {isRTL
                    ? 'نحن هنا لمساعدتك'
                    : 'We Are Here to Help'}
                </h3>
                <p className="contact-section-text">
                  {isRTL
                    ? 'نحن نعمل بجد لتوفير خدمات توصيل وإرجاع ممتازة لعملائنا. في حال وجود أي استفسارات أو مشكلات، يرجى عدم التردد في الاتصال بفريق دعم العملاء لدينا.'
                    : 'We work hard to provide excellent delivery and return services to our customers. If you have any questions or issues, please do not hesitate to contact our customer support team.'}
                </p>
                <div className="contact-section-items">
                  <a href="mailto:info@almasaratksa.com" className="contact-section-item">
                    <span className="contact-item-icon">📧</span>
                    <span className="contact-item-text">info@almasaratksa.com</span>
                  </a>
                  <a href="tel:+966114510420" className="contact-section-item">
                    <span className="contact-item-icon">📞</span>
                    <span className="contact-item-text">+966 11 451 0420</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RefundPolicy;
