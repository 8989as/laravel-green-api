import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBox,
  faHeart,
  faAddressBook,
  faCreditCard,
  faSignOutAlt,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import { useAccount } from '../contexts/AccountContext';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { profile, addresses, loading, error, fetchProfile, fetchAddresses } = useAccount();
  const { user, logout } = useAuth();

  // Breadcrumb items
  const breadcrumbItems = [
    { label: t('home'), url: '/' },
    { label: t('myAccount'), url: '/profile', active: true }
  ];

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

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
      <Breadcrumb items={breadcrumbItems} />
      <div className="container py-5">
        <h1 className="mb-4">{t('myAccount')}</h1>
        {error && (
          <div className="alert alert-danger" role="alert">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p className="mt-3">{t('loadingProfile')}</p>
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
                    <li className="active">
                      <a href="/profile">
                        <FontAwesomeIcon icon={faUser} className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('accountDetails')}
                      </a>
                    </li>
                    <li>
                      <a href="/orders">
                        <FontAwesomeIcon icon={faBox} className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('myOrders')}
                        <span className="badge bg-primary rounded-pill">
                          {userData.orders_count || 0}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/wishlist">
                        <FontAwesomeIcon icon={faHeart} className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('wishlist')}
                        <span className="badge bg-primary rounded-pill">
                          {userData.wishlist_count || 0}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/addresses">
                        <FontAwesomeIcon icon={faAddressBook} className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('addresses')}
                      </a>
                    </li>
                    <li>
                      <a href="/payment-methods">
                        <FontAwesomeIcon icon={faCreditCard} className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('paymentMethods')}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-danger" onClick={e => { e.preventDefault(); logout(); }}>
                        <FontAwesomeIcon icon={faSignOutAlt} className={isRTL ? 'ms-2' : 'me-2'} />
                        {t('logout')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="col-lg-9">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{t('accountDetails')}</h5>
                  <button className="btn btn-sm btn-outline-primary">
                    {t('editProfile')}
                  </button>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6>{t('name')}</h6>
                      <p>{userData.first_name || userData.name}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6>{t('email')}</h6>
                      <p>{userData.email || '-'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6>{t('phone')}</h6>
                      <p>{userData.phone}</p>
                    </div>
                    <div className="col-12">
                      <hr />
                      <h6>{t('addresses')}</h6>
                      {(addresses && addresses.length > 0 ? addresses : userData.addresses || []).map(address => (
                        <div key={address.id} className="address-card p-3 mb-2">
                          <div className="d-flex justify-content-between">
                            <strong>{address.type || t('address')}</strong>
                            <div>
                              <button className="btn btn-sm btn-link">{t('edit')}</button>
                              <button className="btn btn-sm btn-link text-danger">{t('delete')}</button>
                            </div>
                          </div>
                          <p className="mb-0">{address.address}</p>
                          <p className="mb-0">{address.city}, {address.postal_code}</p>
                        </div>
                      ))}
                      <div className="mt-3">
                        <button className="btn btn-outline-primary">
                          + {t('addNewAddress')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Recent Orders - TODO: Replace with real data */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{t('recentOrders')}</h5>
                  <a href="/orders" className="btn btn-sm btn-link">
                    {t('viewAll')} →
                  </a>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>{t('orderId')}</th>
                          <th>{t('date')}</th>
                          <th>{t('total')}</th>
                          <th>{t('status')}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* TODO: Map real recent orders here */}
                        <tr>
                          <td>#10045</td>
                          <td>2023-05-20</td>
                          <td>
                            325.00
                            <img 
                              src="/assets/images/sar.svg" 
                              alt="SAR" 
                              className="price-symbol-img" 
                            />
                          </td>
                          <td>
                            <span className="badge bg-success">
                              {t('delivered')}
                            </span>
                          </td>
                          <td>
                            <a href="/orders/10045" className="btn btn-sm btn-link">
                              {t('view')}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>#10044</td>
                          <td>2023-04-15</td>
                          <td>
                            180.50
                            <img 
                              src="/assets/images/sar.svg" 
                              alt="SAR" 
                              className="price-symbol-img" 
                            />
                          </td>
                          <td>
                            <span className="badge bg-success">
                              {t('delivered')}
                            </span>
                          </td>
                          <td>
                            <a href="/orders/10044" className="btn btn-sm btn-link">
                              {t('view')}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>#10043</td>
                          <td>2023-03-10</td>
                          <td>
                            450.75
                            <img 
                              src="/assets/images/sar.svg" 
                              alt="SAR" 
                              className="price-symbol-img" 
                            />
                          </td>
                          <td>
                            <span className="badge bg-success">
                              {t('delivered')}
                            </span>
                          </td>
                          <td>
                            <a href="/orders/10043" className="btn btn-sm btn-link">
                              {t('view')}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
