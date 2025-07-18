import { useState, useEffect } from 'react';
// import api from '../services/api';
import { mockProducts } from '../data/mockData';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import HomeHero from '../components/HomeHero/HomeHero';
import CatSlider from '../components/CatSlider/CatSlider';
// import ProductCard from '../components/ProductCard/ProductCard';
import { ConnectedProductCard } from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Simulate API call with mock data
        setTimeout(() => {
            setProducts(mockProducts.slice(0, 4));
            setLoading(false);
        }, 500); // Simulate network delay
    }, []);

    const handleViewProductDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <>
            <Navbar />
            <HomeHero />
            <CatSlider />
            <div className="container my-5">
                <h2 className="text-start mb-4">{t('latestAddedProducts')}</h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center text-danger">{error}</div>
                ) : (
                    <div className="row">
                        {products.map((product) => (
                            <div className="col-md-4 mb-4" key={product.id}>
                                <ConnectedProductCard
                                    image={product.images?.[0]?.medium_image_url || product.images?.[0]?.url || 'assets/images/product_1.png'}
                                    name={i18n.language === 'ar' ? product.name : (product.name_latin || product.name)}
                                    latinName={product.name_latin || ''}
                                    price={product.price}
                                    isFavorite={favorites.includes(product.id)}
                                    // onFavoriteClick={() => {
                                    //     setFavorites((prev) =>
                                    //         prev.includes(product.id)
                                    //             ? prev.filter((id) => id !== product.id)
                                    //             : [...prev, product.id]
                                    //     );
                                    // }}
                                    onFavoriteClick={() => handleToggleFavorite(product.id)}
                                    onViewDetails={() => handleViewProductDetails(product.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Home;