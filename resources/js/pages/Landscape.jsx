import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useTranslation } from "react-i18next";
import './LandscapeCustom.css';

// Image assets as constants
const img1 = '/assets/images/landscape/landscape1.png';
const img2 = '/assets/images/landscape/landscape2.png';
const img3 = '/assets/images/landscape/landscape3.png';
const img4 = '/assets/images/landscape/landscape4.png';
const img5 = '/assets/images/landscape/landscape5.png';
const img6 = '/assets/images/landscape/landscape6.png';
const img7 = '/assets/images/landscape/landscape7.png';
const img8 = '/assets/images/landscape/landscape8.png';
const img9 = '/assets/images/landscape/landscape9.png';
const img10 = '/assets/images/landscape/landscape10.png';
const img11 = '/assets/images/landscape/landscape11.png';
const img12 = '/assets/images/landscape/landscape12.png';
const img13 = '/assets/images/landscape/landscape13.png';
const img14 = '/assets/images/landscape/landscape14.png';
const img15 = '/assets/images/landscape/landscape15.png';
const icon = '/assets/images/landscape/icon.svg';

export default function Landscape() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <>
            <Navbar />
            <Breadcrumb items={[
                { label: t('home'), url: '/' },
                { label: t('landscaping'), active: true }
            ]} />
            <div className="container py-5">
                {/* Hero Section */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-6 mb-4 mb-md-0">
                        <img src={img1} alt="Landscape Hero" className="img-fluid landscape-img-rounded w-100" />
                    </div>
                    <div className={`col-md-6 text-${isRTL ? 'end' : 'start'}`}>
                        <h1 className="landscape-section-title mb-3" style={{ fontSize: 36 }}>
                            {isRTL ?
                                'شركة المسارات الرابحة شريكك الموثوق في تنسيق الحدائق' :
                                'Masarat Al-Rabha Company - Your Trusted Partner in Landscaping'
                            }
                        </h1>
                        <p className="landscape-section-subtitle" style={{ fontSize: 24 }}>
                            {isRTL ?
                                'شركة المسارات الرابحة هي شركة سعودية متخصصة ورائدة في تصميم وتنفيذ وتوريد وصيانة أعمال تنسيق المواقع (اللاندسكيب) بمختلف أنواعها. نعمل على سد الفجوة في السوق من خلال تقديم حلول متكاملة تجمع بين الابتكار والجودة، ونهدف إلى تحقيق أعلى معايير الجمال والاستدامة في المساحات الخارجية، بما يتماشى مع تطلعات عملائنا ورؤية المملكة 2030.' :
                                'Masarat Al-Rabha Company is a specialized and leading Saudi company in designing, implementing, supplying, and maintaining all types of landscaping work. We work to bridge the market gap by providing integrated solutions that combine innovation and quality, aiming to achieve the highest standards of beauty and sustainability in outdoor spaces, in line with our clients\' aspirations and Saudi Vision 2030.'
                            }
                        </p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-5">
                    <h2 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mb-4`} style={{ fontSize: 36 }}>
                        {isRTL ? 'لماذا تختارنا !' : 'Why Choose Us!'}
                    </h2>
                    <div className="row g-4">
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">
                                    {isRTL ? 'ضمان رضا العملاء' : 'Customer Satisfaction Guarantee'}
                                </h5>
                                <p className="landscape-card-text text-center mb-0">
                                    {isRTL ?
                                        'رضاك هو أولويتنا القصوى. نفتخر بجودة عملنا، وعدد كبير من عملائنا السعداء هو أكبر دليل على التميز والعناية التي نقدمها.' :
                                        'Your satisfaction is our top priority. We take pride in the quality of our work, and our large number of happy customers is the greatest proof of the excellence and care we provide.'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">
                                    {isRTL ? 'حلول متكاملة' : 'Integrated Solutions'}
                                </h5>
                                <p className="landscape-card-text text-center mb-0">
                                    {isRTL ?
                                        'بدءًا من تصميم وتركيب الحدائق وصولاً إلى الصيانة الدورية والخدمات المتخصصة، نقدم مجموعة كاملة من خدمات تنسيق الحدائق.' :
                                        'From garden design and installation to regular maintenance and specialized services, we provide a complete range of landscaping services.'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">
                                    {isRTL ? 'خدمة مخصصة حسب احتياجاتك' : 'Customized Service for Your Needs'}
                                </h5>
                                <p className="landscape-card-text text-center mb-0">
                                    {isRTL ?
                                        'نؤمن أن كل حديقة فريدة من نوعها تمامًا كصاحبها. نأخذ الوقت الكافي لفهم رؤيتك وتفضيلاتك واحتياجاتك الخاصة.' :
                                        'We believe that every garden is as unique as its owner. We take the time to understand your vision, preferences, and specific needs.'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">
                                    {isRTL ? 'الخبرة والتخصص' : 'Expertise and Specialization'}
                                </h5>
                                <p className="landscape-card-text text-center mb-0">
                                    {isRTL ?
                                        'على مدار سنوات من الخبرة العملية، يقدّم فريقنا من البستانيين ومصممي المناظر الطبيعية المحترفين ثروة من المعرفة لكل مشروع نقوم به.' :
                                        'With years of practical experience, our team of professional gardeners and landscape designers brings a wealth of knowledge to every project we undertake.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previous Works */}
                <div className="mb-5">
                    <h2 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mb-4`} style={{ fontSize: 36 }}>
                        {isRTL ? 'أعمال اللاندسكيب السابقة' : 'Previous Landscaping Works'}
                    </h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <img src={img2} alt="work1" className="img-fluid landscape-img-rounded w-100" />
                        </div>
                        <div className="col-md-4">
                            <img src={img3} alt="work2" className="img-fluid landscape-img-rounded w-100" />
                        </div>
                        <div className="col-md-4">
                            <img src={img4} alt="work3" className="img-fluid landscape-img-rounded w-100" />
                        </div>
                        <div className="col-md-4">
                            <img src={img5} alt="work4" className="img-fluid landscape-img-rounded w-100" />
                        </div>
                        <div className="col-md-4">
                            <img src={img6} alt="work5" className="img-fluid landscape-img-rounded w-100" />
                        </div>
                        <div className="col-md-4">
                            <img src={img7} alt="work6" className="img-fluid landscape-img-rounded w-100" />
                        </div>
                    </div>

                    {/* Maintenance Section */}
                    <div className="row mt-5 mb-5">
                        <h2 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mt-5 mb-4`} style={{ fontSize: 36 }}>
                            {isRTL ? 'قسم صيانة الحدائق' : 'Garden Maintenance Department'}
                        </h2>
                        <p className={`landscape-section-subtitle text-${isRTL ? 'start' : 'start'} mb-4`} style={{ fontSize: 24 }}>
                            {isRTL ?
                                'بعد ما تنسّق حديقتك، الصيانة تصير أهم خطوة تحافظ على جمالها. فريقنا يقدّم خدمات صيانة دورية أو حسب الطلب، تشمل كل تفاصيل العناية بالنباتات، الري، التربة، وحتى مكافحة الآفات.' :
                                'After landscaping your garden, maintenance becomes the most important step to preserve its beauty. Our team provides regular or on-demand maintenance services, covering all aspects of plant care, irrigation, soil, and even pest control.'
                            }
                        </p>
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">
                                    {isRTL ? 'معالجة النباتات الضعيفة أو المريضة' : 'Treating Weak or Diseased Plants'}
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">
                                    {isRTL ? 'ضبط شبكات الري والصيانة الدورية' : 'Irrigation System Adjustment & Regular Maintenance'}
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">
                                    {isRTL ? 'تنظيف الحديقة والعناية بالتربة' : 'Garden Cleaning & Soil Care'}
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">
                                    {isRTL ? 'تقليم وتشكيل الأشجار والشجيرات' : 'Pruning & Shaping Trees & Shrubs'}
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">
                                    {isRTL ? 'قص وتنسيق العشب الطبيعي' : 'Natural Grass Cutting & Arrangement'}
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">
                                    {isRTL ? 'استبدال الأجزاء المتضررة بالنباتات الجديدة' : 'Replacing Damaged Parts with New Plants'}
                                </div>
                            </div>
                        </div>
                        <img src={img8} alt="maintenance" className="img-fluid landscape-img-rounded w-100" />
                    </div>
                </div>

                <div className='row mb-5'>
                    <div className={`col-md-6 text-${isRTL ? 'start' : 'start'} mb-4 mb-md-0 ${isRTL ? '' : 'order-md-1'}`}>
                        <h2 className="landscape-section-title mb-3" style={{ fontSize: 36 }}>
                            {isRTL ? 'قسم لعب الاطفال' : 'Children\'s Playground Department'}
                        </h2>
                        <p className={`landscape-section-subtitle text-${isRTL ? 'start' : 'start'}`} style={{ fontSize: 24 }}>
                            {isRTL ?
                                'نوفّر لك تصاميم احترافية لألعاب الأطفال، تركّب داخل الحدائق والمساحات الخارجية، بجودة عالية والأهم؟ عندنا كمان ألعاب دمج مخصصة لذوي الإعاقة، تساعدهم يشاركون اللعب مع باقي الأطفال بكل راحة وأمان، الألعاب مصممة بخامات متينة، وألوان مبهجة، وتشجع الطفل على الحركة والتفاعل والمرح. تقدر تختار من تشكيلات متنوعة تناسب مختلف الأعمار والمساحات.' :
                                'We provide professional designs for children\'s playgrounds, installed in gardens and outdoor spaces, with high quality. Most importantly, we also have inclusive play equipment designed for children with disabilities, helping them participate in play with other children comfortably and safely. The equipment is designed with durable materials, cheerful colors, and encourages children to move, interact, and have fun. You can choose from various designs suitable for different ages and spaces.'
                            }
                        </p>
                    </div>
                    <div className={`col-md-6 mb-4 mb-md-0 ${isRTL ? '' : 'order-md-2'}`}>
                        <img src={img9} alt="landscape" className="img-fluid landscape-img-rounded w-100" />
                    </div>
                </div>

                {/* Playground Types Section */}
                <div className="mb-5">
                    <h2 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mb-4`} style={{ fontSize: 32 }}>
                        {isRTL ? 'نوفر نوعين من الألعاب:' : 'We Provide Two Types of Playgrounds:'}
                    </h2>
                    {/* ألعاب اللعب الحر */}
                    <div className="mb-4">
                        <h3 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mb-3`} style={{ fontSize: 24 }}>
                            {isRTL ? 'ألعاب اللعب الحر :' : 'Free Play Equipment:'}
                        </h3>
                        <div className={`d-flex flex-wrap gap-2 justify-content-${isRTL ? 'start' : 'start'} mb-4`}>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'ألعاب توازن وحركة' : 'Balance & Movement Games'}</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'سلالم وأنفاق' : 'Stairs & Tunnels'}</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'جسور وحبال تسلق' : 'Bridges & Climbing Ropes'}</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'زحاليق' : 'Slides'}</span>
                            </span>
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <img src={img10} alt="playground1" className="img-fluid landscape-img-rounded w-100" />
                            </div>
                            <div className="col-md-4">
                                <img src={img11} alt="playground2" className="img-fluid landscape-img-rounded w-100" />
                            </div>
                            <div className="col-md-4">
                                <img src={img12} alt="playground3" className="img-fluid landscape-img-rounded w-100" />
                            </div>
                        </div>
                    </div>
                    {/* ألعاب الدمج */}
                    <div className="mb-4">
                        <h3 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mb-3`} style={{ fontSize: 24 }}>
                            {isRTL ? 'ألعاب الدمج :' : 'Inclusive Play Equipment:'}
                        </h3>
                        <div className={`d-flex flex-wrap gap-2 justify-content-${isRTL ? 'start' : 'start'} mb-4`}>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'مناطق لعب بالرمل والماء مصممة للجميع' : 'Sand & Water Play Areas Designed for Everyone'}</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'دوارات أرضية سهلة الوصول' : 'Accessible Ground-Level Merry-Go-Rounds'}</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'ألعاب تفاعلية صوتية وبصرية' : 'Interactive Audio & Visual Games'}</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">{isRTL ? 'زحاليق بمسارات آمنة للكراسي المتحركة' : 'Slides with Safe Wheelchair-Accessible Paths'}</span>
                            </span>
                        </div>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <img src={img13} alt="inclusive1" className="img-fluid landscape-img-rounded w-100" />
                            </div>
                            <div className="col-md-4">
                                <img src={img14} alt="inclusive2" className="img-fluid landscape-img-rounded w-100" />
                            </div>
                            <div className="col-md-4">
                                <img src={img15} alt="inclusive3" className="img-fluid landscape-img-rounded w-100" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <h2 className={`landscape-section-title text-${isRTL ? 'start' : 'start'} mb-3`} style={{ fontSize: 36 }}>
                        {isRTL ? 'أطلب خدمة اللاندسكيب الآن' : 'Request Landscaping Service Now'}
                    </h2>
                    <p className={`landscape-section-subtitle text-${isRTL ? 'start' : 'start'} mb-4`} style={{ fontSize: 20 }}>
                        {isRTL ?
                            'نقدم حلول مبتكرة وعصرية لتجهيز وتنسيق الحدائق والمساحات الخارجية بكل احترافية – ابدأ معنا بخطوة بسيطة.' :
                            'We provide innovative and modern solutions for setting up and landscaping gardens and outdoor spaces with complete professionalism – start with us with a simple step.'
                        }
                    </p>
                    <form className="bg-white p-4 rounded-3 shadow-sm">
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">
                                    {isRTL ? 'رقم الجوال' : 'Mobile Number'}
                                </label>
                                <input
                                    type="text"
                                    className="form-control landscape-form-input"
                                    placeholder={isRTL ? "0501234567" : "0501234567"}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">
                                    {isRTL ? 'الإسم' : 'Name'}
                                </label>
                                <input
                                    type="text"
                                    className="form-control landscape-form-input"
                                    placeholder={isRTL ? "اسمك" : "Your Name"}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">
                                    {isRTL ? 'البريد الإلكترونى' : 'Email'}
                                </label>
                                <input
                                    type="email"
                                    className="form-control landscape-form-input"
                                    placeholder="you@email.com"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">
                                    {isRTL ? 'نوع المساحة' : 'Space Type'}
                                </label>
                                <input
                                    type="text"
                                    className="form-control landscape-form-input"
                                    placeholder={isRTL ? "حديقة فيلا" : "Villa Garden"}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">
                                    {isRTL ? 'المدينة' : 'City'}
                                </label>
                                <input
                                    type="text"
                                    className="form-control landscape-form-input"
                                    placeholder={isRTL ? "الرياض" : "Riyadh"}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">
                                    {isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}
                                </label>
                                <textarea
                                    className="form-control landscape-form-input"
                                    rows="2"
                                    placeholder={isRTL ? "اكتب ملاحظاتك هنا ..." : "Write your notes here..."}
                                ></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn landscape-btn px-5 py-2 mt-2">
                            {isRTL ? 'إرسال' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
