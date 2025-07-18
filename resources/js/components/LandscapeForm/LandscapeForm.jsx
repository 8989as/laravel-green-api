const LandscapeForm = () => {
    return (
        <div className="form-container">
            {/* Header Section */}
            <div className="form-header">
                <h1 className="form-title">أطلب خدمة اللاندسكيب الآن</h1>
                <p className="form-subtitle">
                    نقدّم حلول مبتكرة وعصرية لتجهيز وتنسيق الحدائق والمساحات الخارجية بكل احترافية – ابدأ معنا بخطوة بسيطة.
                </p>
            </div>

            {/* Form Content */}
            <div className="form-content">
                {/* Form Fields */}
                <div className="form-fields">
                    <div className="form-section">
                        {/* Name and Phone Row */}
                        <div className="form-row">
                            <FormField
                                label="رقم الجوال"
                                type="tel"
                                value="0501234567"
                                icon={
                                    <div className="saudi-flag">
                                        {/* Saudi flag SVG would be better here */}
                                        <div className="flag-green"></div>
                                        <div className="flag-white-symbols"></div>
                                    </div>
                                }
                            />

                            <FormField
                                label="الإسم"
                                type="text"
                                value="نورة عبدالله العتيبي"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="form-row">
                            <FormField
                                label="البريد الإلكترونى"
                                type="email"
                                value="noura.alotaibi@email.com"
                                fullWidth
                            />
                        </div>

                        {/* Space Type and City Row */}
                        <div className="form-row">
                            <SelectField
                                label="نوع المساحة"
                                value="حديقة فيلا"
                            />

                            <SelectField
                                label="المدينة"
                                value="الرياض"
                            />
                        </div>

                        {/* Notes Field */}
                        <div className="form-row">
                            <TextAreaField
                                label="ملاحظات إضافية"
                                placeholder="أكتب ملاحظاتك هنا ..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button className="submit-button">
                        إرسال
                        <span className="send-icon"></span>
                    </button>
                </div>

                {/* Form Image */}
                <div className="form-image">
                    <img
                        src="https://placehold.co/481x437"
                        alt="Landscape service illustration"
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Form Field Component
const FormField = ({ label, type, value, icon, fullWidth = false }) => {
    return (
        <div className={`form-field ${fullWidth ? 'full-width' : ''}`}>
            <label>{label}</label>
            <div className="input-container">
                <input
                    type={type}
                    value={value}
                    readOnly // For demo, would be state-controlled in real app
                />
                {icon && <span className="input-icon">{icon}</span>}
            </div>
        </div>
    );
};

// Reusable Select Field Component
const SelectField = ({ label, value }) => {
    return (
        <div className="form-field">
            <label>{label}</label>
            <div className="select-container">
                <select value={value} readOnly>
                    <option>{value}</option>
                </select>
                <span className="dropdown-icon"></span>
            </div>
        </div>
    );
};

// Reusable TextArea Component
const TextAreaField = ({ label, placeholder }) => {
    return (
        <div className="form-field full-width">
            <label>{label}</label>
            <textarea
                placeholder={placeholder}
                readOnly // For demo
            />
        </div>
    );
};
export default LandscapeForm;