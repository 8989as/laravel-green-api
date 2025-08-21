import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import SideBar from '../SideBar/SideBar';
import './ProductList.css';

const ProductList = ({
    showFilters = true,
    showPagination = true,
    itemsPerPage = 12,
    categoryFilter = null,
    className = '',
    ...props
}) => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [searchParams, setSearchParams] = useSearchParams();

    // State management
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: itemsPerPage,
        total: 0,
        from: 0,
        to: 0
    });

    // Filter state
    const [filters, setFilters] = useState({
        categories: categoryFilter ? [categoryFilter] : [],
        colors: [],
        sizes: [],
        priceRange: [0, 1000],
        page: 1,
        search: ''
    });

    // Price range limits
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    // Load initial data
    useEffect(() => {
        loadFilterOptions();
        loadProducts();
    }, []);

    // Update URL when filters change
    useEffect(() => {
        if (showFilters) {
            updateURLParams();
        }
        loadProducts();
    }, [filters]);

    // Load filter options
    const loadFilterOptions = async () => {
        try {
            const response = await axios.get('/api/products/filters');
            const data = response.data;

            setCategories(data.categories || []);
            setColors(data.colors || []);
            setSizes(data.sizes || []);

            // Set price range
            if (data.price_range) {
                setPriceRange(data.price_range);
                setFilters(prev => ({
                    ...prev,
                    priceRange: [data.price_range.min, data.price_range.max]
                }));
            }
        } catch (err) {
            console.error('Error loading filter options:', err);
        }
    };

    // Update URL parameters
    const updateURLParams = () => {
        const params = new URLSearchParams();

        if (filters.categories.length > 0) {
            params.set('categories', filters.categories.join(','));
        }
        if (filters.colors.length > 0) {
            params.set('colors', filters.colors.join(','));
        }
        if (filters.sizes.length > 0) {
            params.set('sizes', filters.sizes.join(','));
        }
        if (filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max) {
            params.set('price_min', filters.priceRange[0]);
            params.set('price_max', filters.priceRange[1]);
        }
        if (filters.search) {
            params.set('search', filters.search);
        }
        if (filters.page > 1) {
            params.set('page', filters.page);
        }

        setSearchParams(params);
    };

    // Load products from API
    const loadProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            // Add filters to API request
            if (filters.categories.length > 0) {
                params.set('category', filters.categories.join(','));
            }
            if (filters.colors.length > 0) {
                params.set('color', filters.colors.join(','));
            }
            if (filters.sizes.length > 0) {
                params.set('size', filters.sizes.join(','));
            }
            if (filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max) {
                params.set('price', `${filters.priceRange[0]}-${filters.priceRange[1]}`);
            }
            if (filters.search) {
                params.set('search', filters.search);
            }
            params.set('page', filters.page);
            params.set('per_page', itemsPerPage);

            const response = await axios.get(`/api/products?${params.toString()}`);
            const data = response.data;

            // Set products data
            setProducts(data.products?.data || data.data || []);

            // Set pagination data
            if (data.products) {
                setPagination({
                    current_page: data.products.current_page,
                    last_page: data.products.last_page,
                    per_page: data.products.per_page,
                    total: data.products.total,
                    from: data.products.from,
                    to: data.products.to
                });
            }

        } catch (err) {
            console.error('Error loading products:', err);
            setError(t('failedToLoadProducts') || 'Failed to load products');
            toast.error(t('failedToLoadProducts') || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    // Handle search
    const handleSearch = (searchTerm) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
            page: 1
        }));
    };

    // Handle favorite toggle
    const handleFavoriteToggle = async (productId, isFavorite) => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                toast.info(t('loginToSaveFavorites') || 'Please login to save favorites');
                return;
            }

            const endpoint = isFavorite ? '/api/favorites' : `/api/favorites/${productId}`;
            const method = isFavorite ? 'POST' : 'DELETE';

            await axios({
                method,
                url: endpoint,
                data: isFavorite ? { product_id: productId } : undefined,
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update product in state
            setProducts(prev => prev.map(product =>
                product.id === productId
                    ? { ...product, is_favorite: isFavorite }
                    : product
            ));

            toast.success(
                isFavorite
                    ? t('addedToFavorites') || 'Added to favorites'
                    : t('removedFromFavorites') || 'Removed from favorites'
            );

        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error(t('failedToUpdateFavorites') || 'Failed to update favorites');
        }
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render pagination component
    const renderPagination = () => {
        if (!showPagination || pagination.last_page <= 1) return null;

        const pages = [];
        const currentPage = pagination.current_page;
        const lastPage = pagination.last_page;

        // Previous button
        if (currentPage > 1) {
            pages.push(
                <button
                    key="prev"
                    className="btn btn-outline-primary me-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    {isRTL ? 'التالي' : 'Previous'}
                </button>
            );
        }

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(lastPage, currentPage + 2);

        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    className="btn btn-outline-primary me-2"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="me-2">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`btn me-2 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < lastPage) {
            if (endPage < lastPage - 1) {
                pages.push(<span key="dots2" className="me-2">...</span>);
            }
            pages.push(
                <button
                    key={lastPage}
                    className="btn btn-outline-primary me-2"
                    onClick={() => handlePageChange(lastPage)}
                >
                    {lastPage}
                </button>
            );
        }

        // Next button
        if (currentPage < lastPage) {
            pages.push(
                <button
                    key="next"
                    className="btn btn-outline-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    {isRTL ? 'السابق' : 'Next'}
                </button>
            );
        }

        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <div className="pagination-wrapper">
                    {pages}
                </div>
            </div>
        );
    };

    return (
        <div className={`product-list-container ${isRTL ? 'rtl' : 'ltr'} ${className}`} {...props}>
            <div className="row">
                {/* Sidebar */}
                {showFilters && (
                    <div className="col-lg-3 col-md-4 mb-4">
                        <SideBar
                            categories={categories}
                            colors={colors}
                            sizes={sizes}
                            priceRange={priceRange}
                            isGift={false}
                            onFilterChange={handleFilterChange}
                            initialFilters={filters}
                            onSearch={handleSearch}
                        />
                    </div>
                )}

                {/* Products */}
                <div className={showFilters ? "col-lg-9 col-md-8" : "col-12"}>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="mb-0">{t('products') || 'المنتجات'}</h2>
                            {!loading && products.length > 0 && (
                                <div className="text-muted small">
                                    {t('showingResults', {
                                        from: pagination.from,
                                        to: pagination.to,
                                        total: pagination.total
                                    }) || `عرض ${pagination.from}-${pagination.to} من ${pagination.total} منتج`}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">{t('loading') || 'جاري التحميل...'}</span>
                            </div>
                            <p className="mt-2">{t('loading') || 'جاري التحميل...'}</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">{t('error') || 'خطأ'}</h4>
                            <p>{error}</p>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => loadProducts()}
                            >
                                {t('tryAgain') || 'حاول مرة أخرى'}
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && !error && (
                        <>
                            {products.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="mb-3">
                                        <i className="fas fa-search fa-3x text-muted"></i>
                                    </div>
                                    <h3>{t('noProductsFound') || 'لا توجد منتجات مطابقة'}</h3>
                                    <p className="text-muted">
                                        {t('tryDifferentFilters') || 'جرب تغيير الفلاتر أو البحث عن شيء آخر'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="row g-4">
                                        {products.map((product) => (
                                            <div className="col-xl-4 col-lg-6 col-md-6" key={product.id}>
                                                <ProductCard
                                                    product={product}
                                                    onFavoriteToggle={handleFavoriteToggle}
                                                    showLatinName={true}
                                                    showDiscount={true}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {renderPagination()}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;