import { useTranslation } from 'react-i18next';
import styles from './About.module.css';

const LeafIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.4766 1.14355C16.0717 0.803877 15.4795 0.753898 15.0029 1.02051H15.0039C13.8577 1.66064 12.9173 2.58306 12.292 3.68945L12.1289 3.99707C11.8077 4.64253 11.5992 5.32983 11.5059 6.03418C8.92163 4.09139 5.71197 3.00862 2.38672 2.97656H2.375C1.76496 2.97656 1.22436 3.39825 1.125 3.98145L1.06152 4.38086C0.766199 6.37346 0.780617 8.38935 1.10645 10.3789L1.10547 10.3799C1.11248 10.4324 1.12955 10.4791 1.14648 10.5186C1.81963 13.1183 3.56838 15.3589 5.99023 16.7471L6.4834 17.0137C8.07613 17.8252 9.845 18.2344 11.6211 18.2344C12.7657 18.2344 13.9125 18.0612 15.0186 17.7178C16.0052 18.2529 17.0329 18.7178 18.1025 19.1094L18.1016 19.1104C18.1721 19.1367 18.2462 19.1504 18.3203 19.1504C18.5564 19.1504 18.7874 19.0164 18.8828 18.7861V18.7852C19.0118 18.4803 18.8425 18.1475 18.5381 18.0361L18.1328 17.8828C17.1918 17.5166 16.2841 17.0896 15.4131 16.6035L15.3955 16.5928C15.3903 16.5898 15.3829 16.5868 15.375 16.583C12.4645 14.9522 9.98759 12.6825 8.18555 9.97363L7.83496 9.42578C7.66526 9.1492 7.29745 9.06088 7.01367 9.21484L6.91406 9.28223C6.70079 9.45856 6.63669 9.76043 6.78906 10.0068L6.78809 10.0078C7.97795 11.9437 9.4788 13.6793 11.252 15.1689L11.6104 15.4629C12.2461 15.9745 12.9098 16.4477 13.5967 16.8867C11.3836 17.3257 9.05585 17.021 7.04297 15.998L6.59961 15.7588C4.5706 14.5951 3.08044 12.7611 2.41895 10.626L2.29004 10.1641C2.28703 10.15 2.28285 10.1369 2.2793 10.126C1.96643 8.14698 1.9761 6.14349 2.31055 4.16699L2.32812 4.14453C2.34107 4.13433 2.35523 4.12903 2.36621 4.12891H2.36816L2.93457 4.14648C8.76524 4.43301 13.7441 8.2312 15.3164 13.3906C15.3232 13.4289 15.3351 13.4661 15.3516 13.5039L15.3506 13.5049C15.4735 13.9187 15.5728 14.3426 15.6494 14.7744L15.7188 15.209C15.7597 15.5074 16.0265 15.7097 16.3174 15.71L16.3965 15.7061C16.7209 15.6639 16.9646 15.3829 16.9199 15.0576L16.8535 14.6289C16.7852 14.231 16.6973 13.8382 16.5918 13.4502C18.1022 11.9312 18.9932 9.99408 19.1309 7.92188L19.1484 7.5C19.1894 5.15435 18.2668 2.92222 16.5557 1.21582L16.4766 1.14355ZM15.6826 2.00879L15.6836 2.01074C18.5527 4.86986 18.6986 9.155 16.1758 12.1553C15.9871 11.6617 15.7695 11.1806 15.5234 10.7129C15.479 9.92249 15.4716 9.24301 15.502 8.625L15.5449 8.01855C15.6219 7.19645 15.7729 6.32486 16.0049 5.35156L16.0059 5.35059C16.0799 5.03118 15.8664 4.72597 15.5439 4.66016C15.2279 4.59586 14.8977 4.77729 14.8232 5.09668L14.6572 5.84473C14.5565 6.33185 14.4761 6.79722 14.415 7.24805L14.3379 7.91504L14.293 8.5459C14.2891 8.62285 14.289 8.70069 14.2861 8.7793C13.8005 8.14292 13.2577 7.54657 12.6641 6.99609C12.617 4.96105 13.7283 3.06701 15.6172 2.01367L15.6641 2.00293C15.6764 2.00406 15.6815 2.00773 15.6826 2.00879Z" fill="#A6C7A5" stroke="#A6C7A5" strokeWidth="0.3" />
    </svg>
);

const AboutHeader = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <section className="mb-5">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className={`'text-start' ${styles.title}`}>
                        {t('about')}
                    </h1>
                </div>
            </div>
            <div className="row gy-4 gy-lg-5">
                <div className={`col-12 col-lg-6 ${isRTL ? 'order-lg-2' : 'order-lg-1'}`}>
                    <div className="h-100 d-flex flex-column">
                        <div className="row g-4 mb-4">
                            <div className="col-6">
                                <img src="/assets/images/about1.png" className={`img-fluid rounded-4 h-100 w-100 object-fit-cover ${styles.image}`} alt="About 1" />
                            </div>
                            <div className="col-6">
                                <img src="/assets/images/about1.png" className={`img-fluid rounded-4 h-100 w-100 object-fit-cover ${styles.image}`} alt="About 2" />
                            </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-6">
                                <img src="/assets/images/about1.png" className={`img-fluid rounded-4 h-100 w-100 object-fit-cover ${styles.image}`} alt="About 3" />
                            </div>
                            <div className="col-6">
                                <img src="/assets/images/about1.png" className={`img-fluid rounded-4 h-100 w-100 object-fit-cover ${styles.image}`} alt="About 4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`col-12 col-lg-6 ${isRTL ? 'order-lg-1' : 'order-lg-2'} ${styles.paragraph} text-${isRTL ? 'end' : 'start'}`}>
                    {isRTL ? (
                        <>
                            <span className={styles.textGrey}>نحن </span>
                            <span className={`${styles.textGreenBold} ${styles.underline}`}>شركة المسارات الرابحة</span>
                            <span className={styles.textGrey}>، إحدى الشركات الوطنية الرائدة في المملكة العربية السعودية في مجال المقاولات العامة، بخبرة تمتد منذ عام 2009. وقد وضعنا لأنفسنا هدفًا واضحًا منذ البداية: تقديم حلول متكاملة ومبتكرة في مجالات </span>
                            <span className={styles.textGreenBold}>البنية التحتية</span>
                            <span className={styles.textGrey}>، و </span>
                            <span className={styles.textGreenBold}>الإنشاءات العامة</span>
                            <span className={styles.textGrey}>، </span>
                            <span className={styles.textGreenBold}>وتنسيق الحدائق (اللاندسكيب)</span>
                            <span className={styles.textGrey}>، من خلال استراتيجية مرنة، وكفاءات متميزة، وجودة عالية تُواكب تطلعات عملائنا، وتسهم في تحقيق </span>
                            <span className={styles.textGreenBold}>رؤية المملكة 2030</span>
                            <span className={styles.textGrey}>.</span>
                            <div className="mt-4">
                                <span className={styles.textGrey}>ومن قلب هذا الطموح، انطلقت مزرعة مساراتكو لنباتات الزينة كإحدى الشركات التابعة للمجموعة، لتكون رافدًا متخصصًا يدعم مشاريع اللاندسكيب والتجميل البيئي، ويُسهم في سد الفجوة في السوق المحلي من خلال إنتاج وتكاثر نباتات الزينة وفق أعلى المعايير.</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className={styles.textGrey}>We are </span>
                            <span className={`${styles.textGreenBold} ${styles.underline}`}>Masarat Al-Rabha Company</span>
                            <span className={styles.textGrey}>, one of the leading national companies in the Kingdom of Saudi Arabia in the field of general contracting, with experience extending since 2009. We have set a clear goal from the beginning: providing integrated and innovative solutions in the areas of </span>
                            <span className={styles.textGreenBold}>Infrastructure</span>
                            <span className={styles.textGrey}>, </span>
                            <span className={styles.textGreenBold}>General Construction</span>
                            <span className={styles.textGrey}>, and </span>
                            <span className={styles.textGreenBold}>Landscaping</span>
                            <span className={styles.textGrey}>, through a flexible strategy, distinguished competencies, and high quality that meets the aspirations of our customers and contributes to achieving </span>
                            <span className={styles.textGreenBold}>Saudi Vision 2030</span>
                            <span className={styles.textGrey}>.</span>
                            <div className="mt-4">
                                <span className={styles.textGrey}>From the heart of this ambition, Masaratco Farm for Ornamental Plants was launched as one of the group's subsidiaries, to be a specialized tributary supporting landscaping and environmental beautification projects, and contributing to bridging the gap in the local market through the production and propagation of ornamental plants according to the highest standards.</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

const FarmInfo = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const arabicTags = [
        "الشجيرات والأغطية الأرضية",
        "الزهور الموسمية والدائمة",
        "النباتات الداخلية والخارجية",
        "أشجار النخيل",
        "الأشجار الظليلة"
    ];

    const englishTags = [
        "Shrubs and Ground Cover",
        "Seasonal and Perennial Flowers",
        "Indoor and Outdoor Plants",
        "Palm Trees",
        "Shade Trees"
    ];

    const tags = isRTL ? arabicTags : englishTags;

    return (
        <section>
            <div className="row mb-4">
                <div className="col-12">
                    <div className={`${styles.paragraph} text-${isRTL ? 'end' : 'start'}`}>
                        {isRTL ? (
                            <>
                                <span className={styles.textGreenBold}>تأسست</span>
                                <span className={styles.textGrey}> </span>
                                <span className={styles.textGreenBold}>مزرعة مساراتكو عام 2020</span>
                                <span className={styles.textGrey}> جنوب مدينة الرياض، وتُعد اليوم من أعرق وأبرز المزارع المتخصصة في إنتاج النباتات والزهور التجميلية في المملكة. نعتمد على أحدث التقنيات الزراعية، ونُنتج مجموعة واسعة تشمل:</span>
                            </>
                        ) : (
                            <>
                                <span className={styles.textGreenBold}>Masaratco Farm was established in 2020</span>
                                <span className={styles.textGrey}> south of Riyadh city, and is today one of the most prestigious and prominent specialized farms in producing ornamental plants and flowers in the Kingdom. We rely on the latest agricultural technologies, and produce a wide range including:</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12">
                    <div className={`d-flex flex-wrap gap-2 justify-content-${isRTL ? 'end' : 'start'}`}>
                        {tags.map((tag, index) => (
                            <div key={index} className={styles.infoTag}>
                                <div className="d-flex align-items-center gap-2">
                                    {!isRTL && <LeafIcon />}
                                    <span className={styles.infoTagText}>{tag}</span>
                                    {isRTL && <LeafIcon />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className={`${styles.paragraph} text-${isRTL ? 'end' : 'start'} ${styles.textGrey}`}>
                        {isRTL ? (
                            <>
                                <p className="mb-4">ونوفّرها لكم عبر متجرنا الإلكتروني المتكامل يُسهّل عليكم طلب النباتات أينما كنتم في المملكة، مع خدمة توصيل احترافية ودعم فني مستمر من فريق من المهندسين والخبراء الزراعيين.</p>
                                <p className="mb-0">في متجر مساراتكو، لا نقدم نباتات فحسب، بل نمنحكم تجربة زراعية متكاملة، مدعومة بخبرة متجذّرة في الأرض، ورؤية تتجه دومًا نحو المستقبل.</p>
                            </>
                        ) : (
                            <>
                                <p className="mb-4">We provide them to you through our integrated online store that makes it easy for you to order plants wherever you are in the Kingdom, with professional delivery service and continuous technical support from a team of engineers and agricultural experts.</p>
                                <p className="mb-0">At Masaratco Store, we don't just offer plants, but give you an integrated agricultural experience, supported by experience rooted in the ground, and a vision that always looks towards the future.</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

const About = () => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <main className={`container py-5 ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="row">
                <div className="col-12">
                    <AboutHeader />
                    <FarmInfo />
                </div>
            </div>
        </main>
    );
};

export default About;