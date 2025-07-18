import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./LandscapeBookingForm.css";

const LANGS = {
  ar: {
    title: "أطلب خدمة اللاندسكيب الآن",
    subtitle:
      "نقدّم حلول مبتكرة وعصرية لتجهيز وتنسيق الحدائق والمساحات الخارجية بكل احترافية – ابدأ معنا بخطوة بسيطة.",
    name: "الإسم",
    phone: "رقم الجوال",
    email: "البريد الإلكترونى",
    city: "المدينة",
    area: "نوع المساحة",
    message: "ملاحظات إضافية",
    messagePlaceholder: "أكتب ملاحظاتك هنا ...",
    submit: "إرسال",
    required: "هذا الحقل مطلوب",
    invalidEmail: "البريد الإلكتروني غير صالح",
    success: "تم إرسال الطلب بنجاح!",
    error: "حدث خطأ أثناء الإرسال. حاول مرة أخرى.",
    loading: "جاري التحميل..."
  },
  en: {
    title: "Request Landscape Service Now",
    subtitle:
      "We offer innovative and modern solutions for garden and outdoor space landscaping – start with a simple step.",
    name: "Name",
    phone: "Phone Number",
    email: "Email",
    city: "City",
    area: "Area Type",
    message: "Additional Notes",
    messagePlaceholder: "Write your notes here ...",
    submit: "Submit",
    required: "This field is required",
    invalidEmail: "Invalid email address",
    success: "Request sent successfully!",
    error: "An error occurred. Please try again.",
    loading: "Loading..."
  }
};

const LandscapeBookingForm = ({ lang = "ar" }) => {
  const t = LANGS[lang] || LANGS.ar;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city_id: "",
    area_id: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/custom/cities"),
      axios.get("http://127.0.0.1:8000/api/custom/areas")
    ])
      .then(([citiesRes, areasRes]) => {
        setCities(citiesRes.data.data);
        setAreas(areasRes.data.data);
      })
      .catch(() => {
        setCities([]);
        setAreas([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = t.required;
    if (!form.phone) newErrors.phone = t.required;
    if (!form.email) newErrors.email = t.required;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = t.invalidEmail;
    if (!form.city_id) newErrors.city_id = t.required;
    if (!form.area_id) newErrors.area_id = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/custom/landscape-request", form);
      Swal.fire({ icon: "success", title: t.success, confirmButtonText: "OK" });
      setForm({ name: "", phone: "", email: "", city_id: "", area_id: "", message: "" });
      setErrors({});
    } catch {
      Swal.fire({ icon: "error", title: t.error, confirmButtonText: "OK" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`landscape-booking-form-container ${lang === "ar" ? "rtl" : "ltr"}`}> 
      <div className="form-header">
        <h1 className="form-title">{t.title}</h1>
        <p className="form-subtitle">{t.subtitle}</p>
      </div>
      <form className="form-content" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-fields w-100">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">{t.name}</label>
                <input
                  type="text"
                  className={`form-control${errors.name ? " is-invalid" : ""}`}
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t.name}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">{t.phone}</label>
                <input
                  type="tel"
                  className={`form-control${errors.phone ? " is-invalid" : ""}`}
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t.phone}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">{t.email}</label>
                <input
                  type="email"
                  className={`form-control${errors.email ? " is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t.email}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="city_id" className="form-label">{t.city}</label>
                <select
                  className={`form-select${errors.city_id ? " is-invalid" : ""}`}
                  id="city_id"
                  name="city_id"
                  value={form.city_id}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">{loading ? t.loading : t.city}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {lang === "ar" ? city.name_ar : city.name_en}
                    </option>
                  ))}
                </select>
                {errors.city_id && <div className="invalid-feedback">{errors.city_id}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="area_id" className="form-label">{t.area}</label>
                <select
                  className={`form-select${errors.area_id ? " is-invalid" : ""}`}
                  id="area_id"
                  name="area_id"
                  value={form.area_id}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">{loading ? t.loading : t.area}</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {lang === "ar" ? area.name_ar : area.name_en}
                    </option>
                  ))}
                </select>
                {errors.area_id && <div className="invalid-feedback">{errors.area_id}</div>}
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12">
              <div className="mb-3">
                <label htmlFor="message" className="form-label">{t.message}</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.messagePlaceholder}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="submit-row">
            <button
              type="submit"
              className="submit-button btn btn-success"
              disabled={submitting || loading}
            >
              {submitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : t.submit}
            </button>
          </div>
        </div>
        <div className="form-image">
          <img
            src="/assets/images/landForm.png"
            className="img-fluid"
            alt="Landscape service illustration"
          />
        </div>
      </form>
    </div>
  );
};

export default LandscapeBookingForm;
