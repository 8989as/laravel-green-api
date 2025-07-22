import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import HomeHero from '../components/HomeHero/HomeHero';
import CatSlider from '../components/CatSlider/CatSlider';
import ProductCard from '../components/ProductCard';
import LandscapingCTA from '../components/LandscapingSection/LandscapingCTA';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Home = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadLatestProducts();
    }, []);

    const loadLatestProducts = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/api/products?per_page=6&latest=true');
            setProducts(response.data.products.data || []);
        } catch (err) {
            console.error('Error loading latest products:', err);
            setError(t('failedToLoadProducts') || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = async (productId, isFavorite) => {
        try {
            const token = localStorage.getItem('token');
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

    return (
        <>
            <Navbar />
            <HomeHero />
            <CatSlider />
            <div className="container my-5">
                <h2 className="text-start mb-4">{t('latestAddedProducts') || 'أحدث المنتجات المضافة'}</h2>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">{t('loading') || 'جاري التحميل...'}</span>
                        </div>
                        <p className="mt-2">{t('loading') || 'جاري التحميل...'}</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger text-center" role="alert">
                        <h4 className="alert-heading">{t('error') || 'خطأ'}</h4>
                        <p>{error}</p>
                        <button 
                            className="btn btn-outline-danger"
                            onClick={() => loadLatestProducts()}
                        >
                            {t('tryAgain') || 'حاول مرة أخرى'}
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">{t('noProductsAvailable') || 'لا توجد منتجات متاحة'}</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {products.map((product) => (
                            <div className="col-lg-4 col-md-6" key={product.id}>
                                <ProductCard
                                    product={{
                                        id: product.id,
                                        name: product.name,
                                        name_ar: product.name_ar,
                                        name_en: product.name_en,
                                        latin_name: product.name_latin,
                                        price: parseFloat(product.price),
                                        discount_price: product.discount_price ? parseFloat(product.discount_price) : null,
                                        current_price: parseFloat(product.current_price || product.price),
                                        has_discount: product.has_discount,
                                        main_image: product.main_image?.url || product.main_image?.medium_url,
                                        is_favorite: product.is_favorite || false,
                                        slug: product.slug || product.id.toString()
                                    }}
                                    onFavoriteToggle={handleFavoriteToggle}
                                    showLatinName={true}
                                    showDiscount={true}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <LandscapingCTA />
            <Footer />
        </>
    );
};

export default Home;