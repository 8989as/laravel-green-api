import "./Events.css";
import { useTranslation } from "react-i18next";

// Image assets from public directory
const img1 = "/assets/images/events-1.png";
const img2 = "/assets/images/events-2.png";
const img3 = "/assets/images/events-3.png";
const img4 = "/assets/images/events-4.png";
const img5 = "/assets/images/events-5.png";
const img6 = "/assets/images/events-6.png";
const img7 = "/assets/images/events-7.png";
const img8 = "/assets/images/events-8.png";
const img9 = "/assets/images/events-9.png";
const img10 = "/assets/images/events-10.png";
const icon = "/assets/images/breadcrumb.svg";

export default function Events() {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    return (
        <div className="events-section container-fluid py-5">
            {/* Header Row - Figma Native Layout */}
            <div className="row g-0 align-items-start mb-5 flex-lg-nowrap flex-wrap">
                <div className={`col-lg-5 d-flex flex-column gap-3 text-${isRTL ? 'end' : 'start'} justify-content-start ps-lg-5 pt-4 pt-lg-0`}>
                    <h2 className={`events-title text-${isRTL ? 'start' : 'start'}`} style={{ fontSize: 36, lineHeight: '48.6px' }}>
                        {isRTL ?
                            'لمسة طبيعية لمناسبتك... نخلي النباتات تحكي!' :
                            'A Natural Touch for Your Event... Let Plants Tell the Story!'
                        }
                    </h2>
                    <div className={`events-desc text-${isRTL ? 'start' : 'start'}`} style={{ fontSize: 24, lineHeight: '38.4px' }}>
                        {isRTL ? (
                            <>
                                في مساراتكو، نجهز مناسبتك بشكل مختلف… نزيّنها بالنباتات والزهور الطبيعية!<br />
                                سواء كانت حفلة صغيرة في البيت، أو فعالية رسمية في شركتك، نوفر لك تنسيق نباتي راقٍ يضيف للمكان أناقة وراحة.<br />ننسّق:
                            </>
                        ) : (
                            <>
                                At Masaratco, we prepare your event differently... we decorate it with natural plants and flowers!<br />
                                Whether it's a small home party or a formal corporate event, we provide elegant botanical arrangements that add sophistication and comfort to the venue.<br />We arrange:
                            </>
                        )}
                    </div>
                    <div className={`d-flex flex-column gap-2 align-items-${isRTL ? 'start' : 'start'}`}>
                        <div className={`d-flex align-items-start text-${isRTL ? 'start' : 'start'} gap-2`}>
                            <img alt="icon" src={icon} className="events-icon" />
                            <span className="events-list-item" style={{ fontSize: 20, color: '#6F816E', lineHeight: '32px' }}>
                                {isRTL ?
                                    'حفلات منزلية بسيطة (تخرج، خطبة، استقبال مولود، عيد ميلاد)' :
                                    'Simple home parties (graduation, engagement, baby shower, birthday)'
                                }
                            </span>
                        </div>
                        <div className={`d-flex align-items-start text-${isRTL ? 'start' : 'start'} gap-2`}>
                            <img alt="icon" src={icon} className="events-icon" />
                            <span className="events-list-item" style={{ fontSize: 20, color: '#6F816E', lineHeight: '32px' }}>
                                {isRTL ?
                                    'فعاليات الشركات (ركن ترحيبي، طاولة اجتماعات، مدخل استقبال، اجتماعات مهمة)' :
                                    'Corporate events (welcome corner, meeting table, reception entrance, important meetings)'
                                }
                            </span>
                        </div>
                        <div className={`d-flex align-items-start text-${isRTL ? 'start' : 'start'} gap-2`}>
                            <img alt="icon" src={icon} className="events-icon" />
                            <span className="events-list-item" style={{ fontSize: 20, color: '#6F816E', lineHeight: '32px' }}>
                                {isRTL ?
                                    'جلسات خارجية أو قعدات عائلية' :
                                    'Outdoor sessions or family gatherings'
                                }
                            </span>
                        </div>
                        <div className={`d-flex align-items-start text-${isRTL ? 'start' : 'start'} gap-2`}>
                            <img alt="icon" src={icon} className="events-icon" />
                            <span className="events-list-item" style={{ fontSize: 20, color: '#6F816E', lineHeight: '32px' }}>
                                {isRTL ?
                                    'ديكور نباتي مؤقت لأركان خاصة أو تصوير' :
                                    'Temporary botanical decor for special corners or photography'
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7 d-flex align-items-stretch">
                    <div className="events-images-container">
                        <div className="events-main-image">
                            <img src={img1} alt="event1" className="events-img-large" />
                        </div>
                        <div className="events-side-images">
                            <img src={img2} alt="event2" className="events-img-medium" />
                            <img src={img3} alt="event3" className="events-img-small" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Previous Events - Responsive Grid */}
            <div className="events-gallery-section">
                <h2 className="events-title text-center mb-4">
                    {isRTL ? 'أعمال تجهيزات المناسبات السابقة' : 'Previous Event Setup Works'}
                </h2>
                <div className="events-gallery">
                    <div className="row g-3 g-md-4">
                        <div className="col-12 col-md-6 col-lg-4">
                            <img src={img4} alt="event4" className="events-gallery-img" />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <img src={img5} alt="event5" className="events-gallery-img" />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <img src={img6} alt="event6" className="events-gallery-img" />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <img src={img7} alt="event7" className="events-gallery-img" />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <img src={img8} alt="event8" className="events-gallery-img" />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <img src={img10} alt="event10" className="events-gallery-img" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Form */}
            <div className="row align-items-stretch g-4 mt-5">
                <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
                    <div className="events-form-image">
                        <img src={img9} alt="event form" className="w-100 h-100 rounded-4" />
                    </div>
                </div>
                <div className="col-lg-6 order-lg-1 d-flex align-items-stretch">
                    <div className="w-100 d-flex flex-column justify-content-center">
                        <h2 className={`events-title text-${isRTL ? 'start' : 'start'}`}>
                            {isRTL ? 'أطلب خدمة تجهيز المناسبات الآن' : 'Request Event Setup Service Now'}
                        </h2>
                        <p className={`events-desc text-${isRTL ? 'start' : 'start'}`}>
                            {isRTL ? 'جاهز نزيّن مناسبتك؟ عبي النموذج وخل الباقي علينا' : 'Ready to decorate your event? Fill out the form and leave the rest to us'}
                        </p>
                        <form className="events-form p-4 rounded-4 mt-3 h-100">
                            <div className="row g-3 mb-2">
                                <div className="col-12 col-md-6">
                                    <label className="form-label events-label">
                                        {isRTL ? 'الإسم' : 'Name'}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control events-input"
                                        placeholder={isRTL ? "نورة عبدالله العتيبي" : "Sarah Abdullah Smith"}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label events-label">
                                        {isRTL ? 'رقم الجوال' : 'Mobile Number'}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control events-input"
                                        placeholder="0501234567"
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-2">
                                <div className="col-12 col-md-6">
                                    <label className="form-label events-label">
                                        {isRTL ? 'البريد الإلكترونى' : 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control events-input"
                                        placeholder={isRTL ? "noura.alotaibi@email.com" : "sarah.smith@email.com"}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label events-label">
                                        {isRTL ? 'مكان المناسبة' : 'Event Location'}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control events-input"
                                        placeholder={isRTL ? "حديقة فيلا" : "Villa Garden"}
                                    />
                                </div>
                            </div>
                            <div className="row g-3 mb-2">
                                <div className="col-12 col-md-4">
                                    <label className="form-label events-label">
                                        {isRTL ? 'تاريخ المناسبة' : 'Event Date'}
                                    </label>
                                    <input type="date" className="form-control events-input" />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label events-label">
                                        {isRTL ? 'نوع المناسبة' : 'Event Type'}
                                    </label>
                                    <select className="form-select events-input">
                                        {isRTL ? (
                                            <>
                                                <option>حفل خطوبة</option>
                                                <option>تخرج</option>
                                                <option>عيد ميلاد</option>
                                                <option>اجتماع عمل</option>
                                            </>
                                        ) : (
                                            <>
                                                <option>Engagement Party</option>
                                                <option>Graduation</option>
                                                <option>Birthday</option>
                                                <option>Business Meeting</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label events-label">
                                        {isRTL ? 'المدينة' : 'City'}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control events-input"
                                        placeholder={isRTL ? "الرياض" : "Riyadh"}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label events-label">
                                    {isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}
                                </label>
                                <textarea
                                    className="form-control events-input"
                                    rows="2"
                                    placeholder={isRTL ? "أكتب ملاحظاتك هنا ..." : "Write your notes here..."}
                                ></textarea>
                            </div>
                            <div className={`text-${isRTL ? 'end' : 'end'}`}>
                                <button type="submit" className="btn events-btn px-4 py-2">
                                    {isRTL ? 'إرسال' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}