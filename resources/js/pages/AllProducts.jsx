import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { ConnectedProductCard } from "../components/ProductCard";
import FilterSidebar from "../components/SideBar/FilterSidebar";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { mockProducts, mockCategories, mockColors, mockSizes } from "../data/mockData";


const AllProducts = () => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0, value: 0 });
    const [allCategories, setAllCategories] = useState([]);
    const [allColors, setAllColors] = useState([]);
    const [allSizes, setAllSizes] = useState([]);
    const [priceLimits, setPriceLimits] = useState({ min: 0, max: 0 });

    // Initialize filter options with mock data
    useEffect(() => {
        // Set categories
        setAllCategories(
            mockCategories.map(cat => ({
                id: cat.id,
                label: cat.name,
                value: cat.value
            }))
        );

        // Set colors
        setAllColors(
            mockColors.map(color => ({
                id: color.id,
                label: color.label,
                value: color.value,
                hex_code: color.hex_code
            }))
        );

        // Set sizes
        setAllSizes(
            mockSizes.map(size => ({
                id: size.id,
                label: size.label,
                value: size.value
            }))
        );
    }, []);

    // Initialize products with mock data
    useEffect(() => {
        setLoading(true);
        try {
            setProducts(mockProducts);
            setFilteredProducts(mockProducts);
            
            // Calculate price range from mock products
            let minPrice = null, maxPrice = null;
            mockProducts.forEach(p => {
                const price = p.special_price ?? p.price;
                if (minPrice === null || price < minPrice) minPrice = price;
                if (maxPrice === null || price > maxPrice) maxPrice = price;
            });
            setPriceLimits({ min: Math.floor(minPrice), max: Math.ceil(maxPrice) });
            setPriceRange({ min: Math.floor(minPrice), max: Math.ceil(maxPrice), value: Math.ceil(maxPrice) });
            setLoading(false);
        } catch (err) {
            setError('Failed to load products');
            setLoading(false);
        }
    }, []);

    // Filtering logic (by IDs)
    useEffect(() => {
        let filtered = products.filter(product => {
            // Category filter
            if (selectedCategories.length > 0) {
                const catIds = (product.categories || []).map(c => c.id);
                if (!selectedCategories.some(id => catIds.includes(id))) return false;
            }
            // Color filter (by color id)
            if (selectedColors.length > 0) {
                const colorIds = (product.colors || []).map(c => c.id);
                if (!selectedColors.some(id => colorIds.includes(id))) return false;
            }
            // Size filter (by size id)
            if (selectedSizes.length > 0) {
                const sizeIds = (product.sizes || []).map(s => s.id);
                if (!selectedSizes.some(id => sizeIds.includes(id))) return false;
            }
            // Price filter
            const price = product.special_price ?? product.price;
            if (price > priceRange.value) return false;
            return true;
        });
        setFilteredProducts(filtered);
    }, [products, selectedCategories, selectedColors, selectedSizes, priceRange]);

    // Sidebar sections
    const sections = [
        {
            key: 'categories',
            title: t('categories') || 'التصنيفات',
            type: 'checkbox',
            options: allCategories,
        },
        {
            key: 'colors',
            title: t('colors') || 'الألوان',
            type: 'color',
            options: allColors,
        },
        {
            key: 'sizes',
            title: t('sizes') || 'الأحجام',
            type: 'checkbox',
            options: allSizes,
        },
        {
            key: 'price',
            title: t('price'),
            type: 'price',
        },
    ];

    // Checkbox change handler (IDs)
    const handleCheckboxChange = (sectionKey, value) => {
        if (sectionKey === 'categories') {
            setSelectedCategories(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        } else if (sectionKey === 'sizes') {
            setSelectedSizes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
        }
    };
    // Color select handler (IDs)
    const handleColorSelect = (colorId) => {
        setSelectedColors(prev => prev.includes(colorId) ? prev.filter(v => v !== colorId) : [...prev, colorId]);
    };
    // Price change handler
    const handlePriceChange = (val) => {
        setPriceRange(pr => ({ ...pr, value: val }));
    };
    // Action (filter) button
    const handleFilterAction = () => {
        // No-op, filtering is live
    };

    // Handle toggling favorite status with mock implementation
    const handleToggleFavorite = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.info(t('loginToSaveFavorites') || 'Please login to save favorites');
                return;
            }
            
            // Update the product in state with toggled favorite status
            const updatedProducts = products.map(p => 
                p.id === productId ? { ...p, is_saved: !p.is_saved } : p
            );
            setProducts(updatedProducts);
            setFilteredProducts(prevFiltered => 
                prevFiltered.map(p => 
                    p.id === productId ? { ...p, is_saved: !p.is_saved } : p
                )
            );
            
            toast.success(
                !products.find(p => p.id === productId)?.is_saved
                    ? t('addedToFavorites') || 'Added to favorites'
                    : t('removedFromFavorites') || 'Removed from favorites'
            );
        } catch (error) {
            toast.error(t('failedToUpdateFavorites') || 'Failed to update favorites');
            console.error('Error updating favorite status:', error);
        }
    };
    
    // Handle view product details
    const handleViewProductDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Selected checkboxes for sidebar
    const selectedCheckboxes = {
        ...Object.fromEntries(allCategories.map(cat => [cat.value, selectedCategories.includes(cat.value)])),
        ...Object.fromEntries(allSizes.map(sz => [sz.value, selectedSizes.includes(sz.value)])),
    };

    return (
        <>
            <Navbar />
            <Breadcrumb
                items={[t('home') || 'الرئيسية', t('allProducts') || 'كل المنتجات']}
                lang={i18n.language}
                
            />
            <div className={`all-products-container ${isRTL ? 'rtl' : 'ltr'} p-4`}>
                <div className="row">
                    <div className="col-md-3">
                        <FilterSidebar
                            isRTL={isRTL}
                            title={t('filterProducts') || 'تصفية النباتات'}
                            sections={sections}
                            onCheckboxChange={handleCheckboxChange}
                            onColorSelect={handleColorSelect}
                            selectedCheckboxes={selectedCheckboxes}
                            selectedColors={selectedColors}
                            priceRange={priceRange}
                            onPriceChange={handlePriceChange}
                            actionLabel={t('filterProducts') || 'تصفية المنتجات'}
                            onAction={handleFilterAction}
                        />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-start mb-4">{t('allProducts') || 'كل المنتجات'}</h1>
                        {loading ? (
                            <div className="text-center py-5">{t('loading') || 'جاري التحميل...'}</div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <div className="row">
                                {filteredProducts.length === 0 ? (
                                    <div className="text-center py-5">{t('noProductsFound') || 'لا توجد منتجات مطابقة'}</div>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <div className="col-md-4 mb-4" key={product.id}>
                                            <ConnectedProductCard
                                                id={product.id}
                                                image={product.base_image || (product.images[0] && product.images[0].url) || '/assets/images/product_1.png'}
                                                name={i18n.language === 'ar' ? product.name : product.name_latin}
                                                latinName={product.name_latin}
                                                price={product.special_price ?? product.price}
                                                isFavorite={product.is_saved}
                                                onFavoriteClick={() => handleToggleFavorite(product.id)}
                                                onViewDetails={() => handleViewProductDetails(product.id)}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;