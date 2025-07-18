import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import ProductCard from '../components/ProductCard';

const ShopGifts = ({ products = [], categories = [] }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const filteredProducts = selectedCategory
    ? products.filter((p: any) => categories.find((c: any) => c.slug === selectedCategory && c.id === p.category_id))
    : products;
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <aside className="col-md-3 mb-4 mb-md-0">
            <ProductFilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </aside>
          <main className="col-md-9">
            <h1 className="mb-4">Ready Made Gifts</h1>
            <div className="row g-4">
              {filteredProducts.length ? filteredProducts.map((product: any, i: number) => (
                <div className="col-md-4" key={i}>
                  <ProductCard product={product} />
                </div>
              )) : <div className="col-12">No products found.</div>}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopGifts;
