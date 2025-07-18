import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';


const Home = (props: any) => {
  // Safely handle both null/undefined with fallback to empty array
  const featuredProducts = props.featuredProducts || [];
  const categorz = props.categorz || [];

  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4">Welcome to Flower & Plant Shop</h1>
          <p className="lead">Discover beautiful flowers and plants for every occasion.</p>
        </div>
        <div className="row mb-5">
          <h2 className="mb-4">Shop by Category</h2>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {categorz.map((cat: any) => (
              <a key={cat.id} href={`/shop/category/${cat.id}`} className="btn btn-outline-success btn-lg">
                {cat.category_en || cat.category_ar}
              </a>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <h2 className="mb-4">Featured Products</h2>
          <div className="row g-4">
            {featuredProducts.map((product: any, i: number) => (
              <div className="col-md-4" key={i}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
