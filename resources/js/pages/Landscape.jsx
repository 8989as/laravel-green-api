import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
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
    return (
        <>
            <Navbar />
            <Breadcrumb title="تنسيق الحدائق" subtitle="شركة المسارات الرابحة" />
            <div className="container py-5">
                {/* Hero Section */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-6 mb-4 mb-md-0">
                        <img src={img1} alt="Landscape Hero" className="img-fluid landscape-img-rounded w-100" />
                    </div>
                    <div className="col-md-6 text-end">
                        <h1 className="landscape-section-title mb-3" style={{ fontSize: 36 }}>
                            شركة المسارات الرابحة شريكك الموثوق في تنسيق الحدائق
                        </h1>
                        <p className="landscape-section-subtitle" style={{ fontSize: 24 }}>
                            شركة المسارات الرابحة هي شركة سعودية متخصصة ورائدة في تصميم وتنفيذ وتوريد وصيانة أعمال تنسيق المواقع (اللاندسكيب) بمختلف أنواعها. نعمل على سد الفجوة في السوق من خلال تقديم حلول متكاملة تجمع بين الابتكار والجودة، ونهدف إلى تحقيق أعلى معايير الجمال والاستدامة في المساحات الخارجية، بما يتماشى مع تطلعات عملائنا ورؤية المملكة 2030.
                        </p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-5">
                    <h2 className="landscape-section-title text-start mb-4" style={{ fontSize: 36 }}>
                        لماذا تختارنا !
                    </h2>
                    <div className="row g-4">
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">ضمان رضا العملاء</h5>
                                <p className="landscape-card-text text-center mb-0">رضاك هو أولويتنا القصوى. نفتخر بجودة عملنا، وعدد كبير من عملائنا السعداء هو أكبر دليل على التميز والعناية التي نقدمها.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">حلول متكاملة</h5>
                                <p className="landscape-card-text text-center mb-0">بدءًا من تصميم وتركيب الحدائق وصولاً إلى الصيانة الدورية والخدمات المتخصصة، نقدم مجموعة كاملة من خدمات تنسيق الحدائق.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">خدمة مخصصة حسب احتياجاتك</h5>
                                <p className="landscape-card-text text-center mb-0">نؤمن أن كل حديقة فريدة من نوعها تمامًا كصاحبها. نأخذ الوقت الكافي لفهم رؤيتك وتفضيلاتك واحتياجاتك الخاصة.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="landscape-card p-4 h-100 d-flex flex-column align-items-center">
                                <img src={icon} alt="icon" className="mb-3" style={{ width: 64, height: 64 }} />
                                <h5 className="landscape-card-title mb-2">الخبرة والتخصص</h5>
                                <p className="landscape-card-text text-center mb-0">على مدار سنوات من الخبرة العملية، يقدّم فريقنا من البستانيين ومصممي المناظر الطبيعية المحترفين ثروة من المعرفة لكل مشروع نقوم به.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previous Works */}
                <div className="mb-5">
                    <h2 className="landscape-section-title text-start mb-4" style={{ fontSize: 36 }}>
                        أعمال اللاندسكيب السابقة
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
                        <h2 className="landscape-section-title text-start mt-5 mb-4" style={{ fontSize: 36 }}>
                            قسم صيانة الحدائق
                        </h2>
                        <p className="landscape-section-subtitle text-start mb-4" style={{ fontSize: 24 }}>
                            بعد ما تنسّق حديقتك، الصيانة تصير أهم خطوة تحافظ على جمالها. فريقنا يقدّم خدمات صيانة دورية أو حسب الطلب، تشمل كل تفاصيل العناية بالنباتات، الري، التربة، وحتى مكافحة الآفات.
                        </p>
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">معالجة النباتات الضعيفة أو المريضة</div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">ضبط شبكات الري والصيانة الدورية</div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">تنظيف الحديقة والعناية بالتربة</div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">تقليم وتشكيل الأشجار والشجيرات</div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">قص وتنسيق العشب الطبيعي</div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2">
                                <div className="landscape-card p-3 text-center h-100">استبدال الأجزاء المتضررة بالنباتات الجديدة</div>
                            </div>
                        </div>
                        <img src={img8} alt="maintenance" className="img-fluid landscape-img-rounded w-100" />
                    </div>
                </div>

                <div className='row mb-5'>
                    <div className='col-md-6 text-start mb-4 mb-md-0'>
                        <h2 className="landscape-section-title mb-3" style={{ fontSize: 36 }}>
                            قسم لعب الاطفال
                        </h2>
                        <p className="landscape-section-subtitle text-start" style={{ fontSize: 24 }}>
                            نوفّر لك تصاميم احترافية لألعاب الأطفال، تركّب داخل الحدائق والمساحات الخارجية، بجودة عالية والأهم؟ عندنا كمان ألعاب دمج مخصصة لذوي الإعاقة، تساعدهم يشاركون اللعب مع باقي الأطفال بكل راحة وأمان، الألعاب مصممة بخامات متينة، وألوان مبهجة، وتشجع الطفل على الحركة والتفاعل والمرح. تقدر تختار من تشكيلات متنوعة تناسب مختلف الأعمار والمساحات.
                        </p>
                    </div>
                    <div className='col-md-6 mb-4 mb-md-0'>
                        <img src={img9} alt="landscape" className="img-fluid landscape-img-rounded w-100" />
                    </div>
                </div>

                {/* Playground Types Section */}
                <div className="mb-5">
                    <h2 className="landscape-section-title text-start mb-4" style={{ fontSize: 32 }}>
                        نوفر نوعين من الألعاب:
                    </h2>
                    {/* ألعاب اللعب الحر */}
                    <div className="mb-4">
                        <h3 className="landscape-section-title text-start mb-3" style={{ fontSize: 24 }}>
                            ألعاب اللعب الحر :
                        </h3>
                        <div className="d-flex flex-wrap gap-2 justify-content-start mb-4">
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">ألعاب توازن وحركة</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">سلالم وأنفاق</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">جسور وحبال تسلق</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">زحاليق</span>
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
                        <h3 className="landscape-section-title text-start mb-3" style={{ fontSize: 24 }}>
                            ألعاب الدمج :
                        </h3>
                        <div className="d-flex flex-wrap gap-2 justify-content-start mb-4">
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">مناطق لعب بالرمل والماء مصممة للجميع</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">دوارات أرضية سهلة الوصول</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">ألعاب تفاعلية صوتية وبصرية</span>
                            </span>
                            <span className="landscape-card px-4 py-2 landscape-card-title d-inline-flex align-items-center">
                                <img src="/assets/images/landscape/vector.svg" alt="arrow" style={{ width: 18, marginLeft: 8, transform: 'scaleY(-1) rotate(180deg)' }} />
                                <span className="ms-2">زحاليق بمسارات آمنة للكراسي المتحركة</span>
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
                    <h2 className="landscape-section-title text-start mb-3" style={{ fontSize: 36 }}>
                        أطلب خدمة اللاندسكيب الآن
                    </h2>
                    <p className="landscape-section-subtitle text-start mb-4" style={{ fontSize: 20 }}>
                        نقدم حلول مبتكرة وعصرية لتجهيز وتنسيق الحدائق والمساحات الخارجية بكل احترافية – ابدأ معنا بخطوة بسيطة.
                    </p>
                    <form className="bg-white p-4 rounded-3 shadow-sm">
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">رقم الجوال</label>
                                <input type="text" className="form-control landscape-form-input" placeholder="0501234567" />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">الإسم</label>
                                <input type="text" className="form-control landscape-form-input" placeholder="اسمك" />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">البريد الإلكترونى</label>
                                <input type="email" className="form-control landscape-form-input" placeholder="you@email.com" />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">نوع المساحة</label>
                                <input type="text" className="form-control landscape-form-input" placeholder="حديقة فيلا" />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">المدينة</label>
                                <input type="text" className="form-control landscape-form-input" placeholder="الرياض" />
                            </div>
                            <div className="col-md-6">
                                <label className="landscape-form-label mb-1">ملاحظات إضافية</label>
                                <textarea className="form-control landscape-form-input" rows="2" placeholder="اكتب ملاحظاتك هنا ..."></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn landscape-btn px-5 py-2 mt-2">إرسال</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
