import React from 'react';
import ImageComponent from './ImageComponent';
import './HomeHero.css';

const HomeHero = () => {
    return (
        <section className="hero-section bg-white">
            <div className="container-fluid px-4 px-lg-5 py-5">
                <div className="row align-items-center justify-content-between g-5 flex-lg-row flex-column-reverse">
                    <div className="col-lg-6 d-flex flex-column align-items-lg-end align-items-center text-lg-start text-center hero-text">
                        <h1 className="hero-title mb-4">
                            من قلب الرياض إلى كل أرجاء المملكة  نباتات تزدهر بالحُب والعناية
                        </h1>
                        <p className="hero-description mb-4">
                            في مزارع ومشاتل مساراتكو، نقدم لك تشكيلة متميزة من نباتات الزينة، الداخلية والخارجية، مزروعة بأحدث التقنيات وتحت إشراف نخبة من الخبراء الزراعيين. نوصلك بالجمال الطبيعي، أينما كنت، بجودة لا تُضاهى وخدمة لا تُنسى.
                        </p>
                        <button className="hero-cta mt-2">تسوق الآن</button>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center align-items-center hero-image-container mb-4 mb-lg-0">
                        <ImageComponent />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;