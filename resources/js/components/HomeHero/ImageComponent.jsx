import React from 'react';
import './ImageComponent.css';

const ImageComponent = () => {
  return (
    <div className="image-container">
      <div className="image-layer">
        <div className="background-layer" />
        <img
          className="main-image"
          src="/assets/images/pattern-bg.svg"
          alt="Main"
        />
      </div>
      <img
        className="rotated-image"
        src="/assets/images/hero-image.svg"
        alt="Rotated"
      />
      <div className="label quality">جودة ممتازة</div>
      <div className="label delivery">توصيل سريع</div>
      <div className="label after-sales">خدمة ما بعد البيع</div>
    </div>
  );
};

export default ImageComponent;
