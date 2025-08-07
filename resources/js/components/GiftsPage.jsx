import React, { useState, useEffect } from 'react';
import SideBar from './SideBar/SideBar';
import { useTranslation } from 'react-i18next';

const GiftsPage = () => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [products, setProducts] = useState([]);
    const [occasions, setOccasions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        occasions: [],
        priceRange: [0, 1000]
    });

    // Fetch gifts data from API
    useEffect(() => {
        fetchGiftsData();
    }, []);

    const fetchGiftsData = async (filterParams = {}) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            // Add filter parameters
            if (filterParams.occasions?.length > 0) {
                queryParams.append('occasion', filterParams.occasions[0]); // API expects single occasion
            }
            if (filterParams.priceRange) {
                queryParams.append('min_price', filterParams.priceRange[0]);
                queryParams.append('max_price', filterParams.priceRange[1]);
            }

            const response = await fetch(`/api/gifts?${queryParams.toString()}`);
            const data = await response.json();

            setProducts(data.products.data || []);
            setOccasions(data.occasions || []);
            setCategories(data.categories || []);
            setSizes(data.sizes || []);
            setColors(data.colors || []);
        } catch (error) {
            console.error('Error fetching gifts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleApplyFilters = (appliedFilters) => {
        fetchGiftsData(appliedFilters);
    };

    return (
        <div className="gifts-page">
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3 col-md-4">
                        <SideBar
                            occasions={occasions}
                            categories={categories}
                            colors={colors}
                            sizes={sizes}
                            priceRange={{ min: 0, max: 1000 }}
                            isGift={true}
                            onFilterChange={handleFilterChange}
                            onApplyFilters={handleApplyFilters}
                            initialFilters={filters}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="col-lg-9 col-md-8">
                        <div className="products-header">
                            <h2 className="page-title">
                                {isRTL ? 'الهدايا' : 'Gifts'}
                            </h2>
                            <p className="products-count">
                                {isRTL
                                    ? `${products.length} منتج موجود`
                                    : `${products.length} products found`
                                }
                            </p>
                        </div>

                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="products-grid row">
                                {products.map((product) => (
                                    <div key={product.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                        <div className="product-card">
                                            <div className="product-image">
                                                <img
                                                    src={product.main_image || '/placeholder-image.jpg'}
                                                    alt={isRTL ? product.name_ar : product.name_en}
                                                    className="img-fluid"
                                                />
                                                <div className="gift-badge">
                                                    {isRTL ? '🎁 هدية' : '🎁 Gift'}
                                                </div>
                                            </div>
                                            <div className="product-info">
                                                <h5 className="product-name">
                                                    {isRTL ? product.name_ar : product.name_en}
                                                </h5>
                                                <p className="product-price">
                                                    {product.price} {isRTL ? 'ج.م' : 'EGP'}
                                                </p>
                                                {product.occasions && product.occasions.length > 0 && (
                                                    <div className="product-occasions">
                                                        {product.occasions.map((occasion) => (
                                                            <span key={occasion.id} className="occasion-tag">
                                                                {occasion.icon} {isRTL ? occasion.name_ar : occasion.name_en}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {products.length === 0 && !loading && (
                            <div className="no-products">
                                <p>{isRTL ? 'لا توجد هدايا متاحة' : 'No gifts available'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftsPage;