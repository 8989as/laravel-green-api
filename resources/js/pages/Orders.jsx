import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { useOrders } from '../contexts/OrderContext';
// Simple icon components to replace FontAwesome
const SpinnerIcon = () => <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>;
const WarningIcon = () => <span>⚠️</span>;
const ShoppingBagIcon = () => <span>🛍️</span>;
const EyeIcon = () => <span>👁️</span>;
const TruckIcon = () => <span>🚚</span>;
const TimesIcon = () => <span>❌</span>;
const RedoIcon = () => <span>🔄</span>;

const Orders = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Use OrderContext
  const {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders: getOrders,
    fetchOrder: getOrder,
    cancelOrder: cancelOrderById,
    reorderItems: reorderById
  } = useOrders();

  // Local state
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('myAccount'), url: '/account' },
    { label: t('myOrders'), url: '/orders', active: true }
  ];

  // Fetch orders on component mount
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    setSelectedOrderId(orderId);
    setTrackingInfo(null);

    try {
      await getOrder(orderId);
      setOrderDetails(currentOrder);
    } catch (err) {
      console.error(`Error fetching details for order #${orderId}:`, err);
    }
  };

  // Track order
  const trackOrder = async (orderId) => {
    setTrackingInfo(null);

    try {
      // Use the order data as tracking info since Bagisto API doesn't have a specific tracking endpoint
      await getOrder(orderId);
      setTrackingInfo(currentOrder);
    } catch (err) {
      console.error(`Error tracking order #${orderId}:`, err);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrderById(orderId);
      // If the cancelled order is currently selected, refresh its details
      if (selectedOrderId === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (err) {
      console.error(`Error cancelling order #${orderId}:`, err);
    }
  };

  // Reorder items from a previous order
  const handleReorderItems = async (orderId) => {
    try {
      await reorderById(orderId);
      // Redirect to cart page after reordering
      window.location.href = '/cart';
    } catch (err) {
      console.error(`Error reordering items from order #${orderId}:`, err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">{t('myOrders')}</h1>

            {error && (
              <div className="alert alert-danger" role="alert">
                <WarningIcon /> {error}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          {/* Order List - Left Side */}
          <div className="col-lg-8">
            {loading ? (
              <div className="text-center py-5">
                <SpinnerIcon />
                <p className="mt-3">{t('loadingOrders')}</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>{t('orderId')}</th>
                          <th>{t('date')}</th>
                          <th>{t('total')}</th>
                          <th>{t('status')}</th>
                          <th className="text-end">{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            className={selectedOrderId === order.id ? 'table-active' : ''}
                          >
                            <td>#{order.id}</td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>
                              {order.total}
                              <img
                                src="/assets/images/sar.svg"
                                alt="SAR"
                                className="price-symbol-img"
                              />
                            </td>
                            <td>
                              <span
                                className={`badge ${getStatusBadgeClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => fetchOrderDetails(order.id)}
                              >
                                <EyeIcon /> {t('view')}
                              </button>
                              <div>
                                {['processing', 'shipped'].includes(order.status.toLowerCase()) && (
                                  <button
                                    className="btn btn-sm btn-outline-success me-1"
                                    onClick={() => trackOrder(order.id)}
                                  >
                                    <TruckIcon /> {t('track')}
                                  </button>
                                )}
                                {['pending', 'processing'].includes(order.status.toLowerCase()) && (
                                  <button
                                    className="btn btn-sm btn-outline-danger me-1"
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    <TimesIcon /> {t('cancel')}
                                  </button>
                                )}
                                {['delivered', 'completed'].includes(order.status.toLowerCase()) && (
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleReorderItems(order.id)}
                                  >
                                    <RedoIcon />
                                    {t('reorder')}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 card border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3" style={{ fontSize: '3rem' }}><ShoppingBagIcon /></div>
                  <h4>{t('noOrders')}</h4>
                  <p className="text-muted">{t('noOrdersMessage')}</p>
                  <a href="/products" className="btn btn-primary">
                    {t('startShopping')}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Order Details - Right Side */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            {selectedOrderId && (
              <>
                {orderDetails ? (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white py-3">
                      <h5 className="mb-0">
                        {t('orderDetails')} #{selectedOrderId}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>{t('orderDate')}:</strong> {formatDate(orderDetails.created_at)}
                      </div>

                      <div className="mb-3">
                        <strong>{t('status')}:</strong>
                        <span
                          className={`badge ms-2 ${getStatusBadgeClass(orderDetails.status)}`}
                        >
                          {orderDetails.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <strong>{t('shippingAddress')}:</strong>
                        <div className="mt-1">
                          {orderDetails.shipping_address?.address},<br />
                          {orderDetails.shipping_address?.city},<br />
                          {orderDetails.shipping_address?.postal_code}
                        </div>
                      </div>

                      <hr />

                      <h6 className="mb-3">{t('orderedItems')}</h6>
                      {orderDetails.items?.map((item) => (
                        <div key={item.id} className="d-flex mb-2">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image || '/assets/images/product_1.png'}
                              alt={item.name}
                              width="40"
                              height="40"
                              className="rounded"
                            />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <p className="mb-0 small">{item.name}</p>
                            <div className="d-flex justify-content-between">
                              <span className="text-muted small">{t('quantity')}: {item.quantity}</span>
                              <span className="small fw-bold">
                                {(item.price * item.quantity).toFixed(2)}
                                <img
                                  src="/assets/images/sar.svg"
                                  alt="SAR"
                                  className="price-symbol-img"
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <hr />

                      <div className="d-flex justify-content-between mb-2">
                        <span>{t('subtotal')}</span>
                        <span>
                          {orderDetails.subtotal}
                          <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                        </span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span>{t('shipping')}</span>
                        <span>
                          {orderDetails.shipping}
                          <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                        </span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span>{t('tax')}</span>
                        <span>
                          {orderDetails.tax}
                          <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                        </span>
                      </div>

                      {orderDetails.discount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>{t('discount')}</span>
                          <span>
                            -{orderDetails.discount}
                            <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                          </span>
                        </div>
                      )}

                      <hr />

                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{t('total')}</span>
                        <span className="fw-bold">
                          {orderDetails.total}
                          <img src="/assets/images/sar.svg" alt="SAR" className="price-symbol-img" />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body text-center py-4">
                      <SpinnerIcon />
                      <p className="mt-3">{t('loadingOrderDetails')}</p>
                    </div>
                  </div>
                )}

                {/* Tracking Information */}
                {trackingInfo && (
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white py-3">
                      <h5 className="mb-0">
                        {t('trackingInformation')}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>{t('carrier')}:</strong> {trackingInfo.carrier}
                      </div>
                      <div className="mb-3">
                        <strong>{t('trackingNumber')}:</strong> {trackingInfo.tracking_number}
                      </div>

                      <div className="tracking-timeline">
                        {trackingInfo.events?.map((event, index) => (
                          <div key={index} className="tracking-item">
                            <div className="tracking-icon">
                              <div className={`tracking-dot ${event.completed ? 'bg-success' : 'bg-secondary'}`}></div>
                            </div>
                            <div className="tracking-content">
                              <p className="mb-0 fw-bold">{event.status}</p>
                              <p className="text-muted mb-0 small">{formatDate(event.timestamp)}</p>
                              <p className="mb-0 small">{event.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {trackingInfo.estimated_delivery && (
                        <div className="mt-3 alert alert-info">
                          <strong>{t('estimatedDelivery')}:</strong> {formatDate(trackingInfo.estimated_delivery)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
