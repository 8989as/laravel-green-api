import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Profile.css';
import { useAccount } from '../contexts/AccountContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';

// Simple icon components to replace FontAwesome
const UserIcon = () => <span>👤</span>;
const BoxIcon = () => <span>📦</span>;
const HeartIcon = () => <span>❤️</span>;
const AddressBookIcon = () => <span>📍</span>;
const CreditCardIcon = () => <span>💳</span>;
const SignOutIcon = () => <span>🚪</span>;
const SpinnerIcon = () => <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>;
const WarningIcon = () => <span>⚠️</span>;
const EditIcon = () => <span>✏️</span>;
const PlusIcon = () => <span>➕</span>;

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { profile, addresses, loading, error, fetchProfile, fetchAddresses } = useAccount();
  const { user, logout, isAuthenticated } = useAuth();
  const { orders, getRecentOrders, fetchOrders } = useOrders();

  const [activeTab, setActiveTab] = useState('profile');
  const [recentOrders, setRecentOrders] = useState([]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('myAccount'), url: '/profile', active: true }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProfile();
    fetchAddresses();
    fetchOrders().then(() => {
      setRecentOrders(getRecentOrders());
    });
  }, [isAuthenticated, navigate]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Use profile as the main user data source
  const userData = profile || user || {};

  return (
    <>
      <Navbar />
      <Breadcrumb items={breadcrumbItems} />
      <div className="container py-5">
        <h1 className="mb-4">{t('myAccount')}</h1>
        {error && (
          <div className="alert alert-danger" role="alert">
            <WarningIcon /> {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <SpinnerIcon />
            <p className="mt-3">{t('loadingProfile') || 'جاري تحميل الملف الشخصي...'}</p>
          </div>
        ) : userData && (
          <div className="row">
            {/* Sidebar Navigation */}
            <div className="col-lg-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-4">
                    <div className="profile-avatar">
                      {(userData.first_name || userData.name || '').charAt(0).toUpperCase()}
                    </div>
                    <div className={isRTL ? 'me-3' : 'ms-3'}>
                      <h5 className="mb-0">{userData.first_name || userData.name}</h5>
                      <p className="text-muted mb-0 small">
                        {t('memberSince')} {userData.created_at ? formatDate(userData.created_at) : ''}
                      </p>
                    </div>
                  </div>
                  <ul className="profile-nav">
                    <li className={activeTab === 'profile' ? 'active' : ''}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
                        <UserIcon />
                        <span className={isRTL ? 'me-2' : 'ms-2'}>{t('accountDetails') || 'تفاصيل الحساب'}</span>
                      </a>
                    </li>
                    <li className={activeTab === 'orders' ? 'active' : ''}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}>
                        <BoxIcon />
                        <span className={isRTL ? 'me-2' : 'ms-2'}>{t('myOrders') || 'طلباتي'}</span>
                        <span className="badge bg-primary rounded-pill">
                          {orders?.length || 0}
                        </span>
                      </a>
                    </li>
                    <li className={activeTab === 'wishlist' ? 'active' : ''}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('wishlist'); }}>
                        <HeartIcon />
                        <span className={isRTL ? 'me-2' : 'ms-2'}>{t('wishlist') || 'المفضلة'}</span>
                        <span className="badge bg-primary rounded-pill">
                          {userData.wishlist_count || 0}
                        </span>
                      </a>
                    </li>
                    <li className={activeTab === 'addresses' ? 'active' : ''}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('addresses'); }}>
                        <AddressBookIcon />
                        <span className={isRTL ? 'me-2' : 'ms-2'}>{t('addresses') || 'العناوين'}</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-danger" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                        <SignOutIcon />
                        <span className={isRTL ? 'me-2' : 'ms-2'}>{t('logout') || 'تسجيل الخروج'}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="col-lg-9">
              {/* Account Details Tab */}
              {activeTab === 'profile' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{t('accountDetails') || 'تفاصيل الحساب'}</h5>
                    <button className="btn btn-sm btn-outline-primary">
                      <EditIcon />
                      <span className="ms-1">{t('editProfile') || 'تعديل الملف الشخصي'}</span>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h6>{t('name') || 'الاسم'}</h6>
                        <p>{userData.first_name || userData.name}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h6>{t('email') || 'البريد الإلكتروني'}</h6>
                        <p>{userData.email || '-'}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h6>{t('phone') || 'رقم الهاتف'}</h6>
                        <p>{userData.phone}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h6>{t('memberSince') || 'عضو منذ'}</h6>
                        <p>{userData.created_at ? formatDate(userData.created_at) : '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{t('addresses') || 'العناوين'}</h5>
                    <button className="btn btn-sm btn-primary">
                      <PlusIcon />
                      <span className="ms-1">{t('addNewAddress') || 'إضافة عنوان جديد'}</span>
                    </button>
                  </div>
                  <div className="card-body">
                    {(addresses && addresses.length > 0 ? addresses : userData.addresses || []).length > 0 ? (
                      (addresses && addresses.length > 0 ? addresses : userData.addresses || []).map(address => (
                        <div key={address.id} className="address-card p-3 mb-3 border rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>{address.type || t('address') || 'عنوان'}</strong>
                              <p className="mb-1 mt-2">{address.address}</p>
                              <p className="mb-0 text-muted">{address.city}, {address.postal_code}</p>
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-primary me-2">
                                <EditIcon />
                                <span className="ms-1">{t('edit') || 'تعديل'}</span>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                {t('delete') || 'حذف'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <AddressBookIcon />
                        <h6 className="mt-3">{t('noAddresses') || 'لا توجد عناوين'}</h6>
                        <p className="text-muted">{t('noAddressesMessage') || 'لم تقم بإضافة أي عناوين بعد'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{t('myOrders') || 'طلباتي'}</h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate('/orders')}
                    >
                      {t('viewAll') || 'عرض الكل'}
                    </button>
                  </div>
                  <div className="card-body p-0">
                    {recentOrders.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>{t('orderId') || 'رقم الطلب'}</th>
                              <th>{t('date') || 'التاريخ'}</th>
                              <th>{t('total') || 'الإجمالي'}</th>
                              <th>{t('status') || 'الحالة'}</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.map((order) => (
                              <tr key={order.id}>
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
                                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => navigate(`/orders`)}
                                  >
                                    {t('view') || 'عرض'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <BoxIcon />
                        <h6 className="mt-3">{t('noOrders') || 'لا توجد طلبات'}</h6>
                        <p className="text-muted">{t('noOrdersMessage') || 'لم تقم بأي طلبات بعد'}</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate('/products')}
                        >
                          {t('startShopping') || 'ابدأ التسوق'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">{t('wishlist') || 'المفضلة'}</h5>
                  </div>
                  <div className="card-body">
                    <div className="text-center py-4">
                      <HeartIcon />
                      <h6 className="mt-3">{t('noWishlistItems') || 'لا توجد منتجات مفضلة'}</h6>
                      <p className="text-muted">{t('noWishlistMessage') || 'لم تقم بإضافة أي منتجات للمفضلة بعد'}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate('/products')}
                      >
                        {t('browseProducts') || 'تصفح المنتجات'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
