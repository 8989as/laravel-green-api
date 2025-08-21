import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';

// Simple icon components
const CheckCircleIcon = () => <span style={{ color: '#28a745', fontSize: '4rem' }}>✅</span>;
const SpinnerIcon = () => <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>;
const WarningIcon = () => <span style={{ color: '#dc3545', fontSize: '2rem' }}>⚠️</span>;
const TruckIcon = () => <span>🚚</span>;
const CalendarIcon = () => <span>📅</span>;
const MapIcon = () => <span>📍</span>;
const CreditCardIcon = () => <span>💳</span>;

const OrderConfirmation = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { currentOrder, loading, error, fetchOrder } = useOrders();
    const [orderDetails, setOrderDetails] = useState(null);

    // Breadcrumb items
    const breadcrumbItems = [
        { label: t('home'), url: '/' },
        { label: t('checkout'), url: '/checkout' },
        { label: t('orderConfirmation'), active: true }
    ];

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId).then((order) => {
                setOrderDetails(order);
            }).catch((err) => {
                console.error('Failed to fetch order:', err);
            });
        }
    }, [orderId, fetchOrder]);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(i18n.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get payment method display text
    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'credit_card':
                return t('creditCard') || 'بطاقة ائتمان';
            case 'cash_on_delivery':
                return t('cashOnDelivery') || 'الدفع عند الاستلام';
            default:
                return method;
        }
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-warning';
            case 'processing':
                return 'bg-info';
            case 'shipped':
                return 'bg-primary';
            case 'delivered':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    const order = orderDetails || currentOrder;

    return (
        <>
            <Navbar />
            <Breadcrumb items={breadcrumbItems} />

            <div className={`container py-5 ${isRTL ? 'rtl' : 'ltr'}`}>
                {loading ? (
                    <div className="text-center py-5">
                        <SpinnerIcon />
                        <p className="mt-3">{t('loadingOrderDetails') || 'جاري تحميل تفاصيل الطلب...'}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-5">
                        <WarningIcon />
                        <h3 className="mt-3">{t('errorLoadingOrder') || 'خطأ في تحميل الطلب'}</h3>
                        <p className="text-muted">{error}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/orders')}
                        >
                            {t('viewAllOrders') || 'عرض جميع الطلبات'}
                        </button>
                    </div>
                ) : order ? (
                    <>
                        {/* Success Header */}
                        <div className="text-center mb-5">
                            <CheckCircleIcon />
                            <h1 className="mt-3 mb-2">{t('orderConfirmed') || 'تم تأكيد طلبك!'}</h1>
                            <p className="lead text-muted">
                                {t('orderConfirmationMessage') || 'شكراً لك! تم استلام طلبك وسيتم معالجته قريباً.'}
                            </p>
                        </div>

                        <div className="row">
                            {/* Order Summary - Left Side */}
                            <div className="col-lg-8 mb-4">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white py-3">
                                        <h4 className="mb-0">
                                            {t('orderDetails') || 'تفاصيل الطلب'} #{order.id}
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        {/* Order Info */}
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center mb-3">
                                                    <CalendarIcon />
                                                    <div className={isRTL ? 'me-3' : 'ms-3'}>
                                                        <h6 className="mb-0">{t('orderDate') || 'تاريخ الطلب'}</h6>
                                                        <p className="text-muted mb-0">{formatDate(order.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="me-3">
                                                        <span className={`badge ${getStatusBadgeClass(order.status)} fs-6`}>
                                                            {order.status || t('pending')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0">{t('orderStatus') || 'حالة الطلب'}</h6>
                                                        <p className="text-muted mb-0 small">
                                                            {t('statusWillBeUpdated') || 'سيتم تحديث الحالة عند معالجة الطلب'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        {order.shipping_address && (
                                            <div className="mb-4">
                                                <div className="d-flex align-items-start">
                                                    <MapIcon />
                                                    <div className={isRTL ? 'me-3' : 'ms-3'}>
                                                        <h6 className="mb-2">{t('shippingAddress') || 'عنوان الشحن'}</h6>
                                                        <div className="text-muted">
                                                            <p className="mb-1">
                                                                {order.shipping_address.first_name} {order.shipping_address.last_name}
                                                            </p>
                                                            <p className="mb-1">{order.shipping_address.address}</p>
                                                            <p className="mb-1">
                                                                {order.shipping_address.city}
                                                                {order.shipping_address.postal_code && `, ${order.shipping_address.postal_code}`}
                                                            </p>
                                                            {order.shipping_address.phone && (
                                                                <p className="mb-0">{order.shipping_address.phone}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center">
                                                <CreditCardIcon />
                                                <div className={isRTL ? 'me-3' : 'ms-3'}>
                                                    <h6 className="mb-0">{t('paymentMethod') || 'طريقة الدفع'}</h6>
                                                    <p className="text-muted mb-0">
                                                        {getPaymentMethodText(order.payment_method)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h6 className="mb-3">{t('orderedItems') || 'المنتجات المطلوبة'}</h6>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>{t('product') || 'المنتج'}</th>
                                                            <th className="text-center">{t('quantity') || 'الكمية'}</th>
                                                            <th className="text-end">{t('price') || 'السعر'}</th>
                                                            <th className="text-end">{t('total') || 'الإجمالي'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items?.map((item) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <img
                                                                            src={item.image || '/assets/images/placeholder-product.jpg'}
                                                                            alt={item.name}
                                                                            width="50"
                                                                            height="50"
                                                                            className="rounded me-3"
                                                                        />
                                                                        <div>
                                                                            <h6 className="mb-0">{item.name}</h6>
                                                                            {item.attributes && item.attributes.length > 0 && (
                                                                                <small className="text-muted">
                                                                                    {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">{item.quantity}</td>
                                                                <td className="text-end">
                                                                    {item.price?.toFixed(2)}
                                                                    <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                                                </td>
                                                                <td className="text-end">
                                                                    {(item.price * item.quantity)?.toFixed(2)}
                                                                    <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Total - Right Side */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white py-3">
                                        <h5 className="mb-0">{t('orderSummary') || 'ملخص الطلب'}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>{t('subtotal') || 'المجموع الفرعي'}</span>
                                            <span>
                                                {order.subtotal?.toFixed(2)}
                                                <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                            </span>
                                        </div>

                                        <div className="d-flex justify-content-between mb-2">
                                            <span>{t('shipping') || 'الشحن'}</span>
                                            <span>
                                                {order.shipping?.toFixed(2) || '0.00'}
                                                <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                            </span>
                                        </div>

                                        <div className="d-flex justify-content-between mb-2">
                                            <span>{t('tax') || 'الضريبة'}</span>
                                            <span>
                                                {order.tax?.toFixed(2) || '0.00'}
                                                <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                            </span>
                                        </div>

                                        {order.discount > 0 && (
                                            <div className="d-flex justify-content-between mb-2 text-success">
                                                <span>{t('discount') || 'الخصم'}</span>
                                                <span>
                                                    -{order.discount?.toFixed(2)}
                                                    <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                                </span>
                                            </div>
                                        )}

                                        <hr />

                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">{t('total') || 'الإجمالي'}</span>
                                            <span className="fw-bold">
                                                {order.total?.toFixed(2)}
                                                <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white py-3">
                                        <h5 className="mb-0">{t('nextSteps') || 'الخطوات التالية'}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="d-flex align-items-start mb-3">
                                            <TruckIcon />
                                            <div className={isRTL ? 'me-3' : 'ms-3'}>
                                                <h6 className="mb-1">{t('processing') || 'معالجة الطلب'}</h6>
                                                <p className="text-muted mb-0 small">
                                                    {t('processingMessage') || 'سيتم معالجة طلبك خلال 1-2 أيام عمل'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start mb-3">
                                            <TruckIcon />
                                            <div className={isRTL ? 'me-3' : 'ms-3'}>
                                                <h6 className="mb-1">{t('shipping') || 'الشحن'}</h6>
                                                <p className="text-muted mb-0 small">
                                                    {t('shippingMessage') || 'سيتم شحن طلبك خلال 3-5 أيام عمل'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-start">
                                            <span>📧</span>
                                            <div className={isRTL ? 'me-3' : 'ms-3'}>
                                                <h6 className="mb-1">{t('updates') || 'التحديثات'}</h6>
                                                <p className="text-muted mb-0 small">
                                                    {t('updatesMessage') || 'ستتلقى تحديثات عبر البريد الإلكتروني'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="text-center mt-5">
                            <Link to="/orders" className="btn btn-outline-primary me-3">
                                {t('viewAllOrders') || 'عرض جميع الطلبات'}
                            </Link>
                            <Link to="/products" className="btn btn-primary">
                                {t('continueShopping') || 'متابعة التسوق'}
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-5">
                        <WarningIcon />
                        <h3 className="mt-3">{t('orderNotFound') || 'الطلب غير موجود'}</h3>
                        <p className="text-muted">{t('orderNotFoundMessage') || 'لم يتم العثور على الطلب المطلوب'}</p>
                        <Link to="/orders" className="btn btn-primary">
                            {t('viewAllOrders') || 'عرض جميع الطلبات'}
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default OrderConfirmation;