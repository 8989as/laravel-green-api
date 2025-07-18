import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import ProductCard from '../components/ProductCard';

const ShopCategory = ({ category, products = [], categories = [], sizes = [], colors = [] }: any) => {
  const [selectedCategory, setSelectedCategory] = useState(category?.slug || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Filtering logic similar to Shop, but selectedCategory logic as in ShopCategory
  const filteredProducts = products.filter((p: any) => {
    const categoryMatch = selectedCategory
      ? categories.some((c: any) => c.slug === selectedCategory && c.id === p.category_id)
      : true;
    const sizeMatch = selectedSizes.length === 0 ||
      p.sizes?.some((s: any) => selectedSizes.includes(s.id));
    const colorMatch = selectedColors.length === 0 ||
      p.colors?.some((c: any) => selectedColors.includes(c.id));
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    return categoryMatch && sizeMatch && colorMatch && priceMatch;
  });

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <aside className="col-md-3 mb-4 mb-md-0">
            <ProductFilterSidebar
              categories={categories}
              sizes={sizes}
              colors={colors}
              selectedCategory={selectedCategory}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategory}
              onSizeChange={(sizeId: string) => setSelectedSizes(prev =>
                prev.includes(sizeId) ? prev.filter(id => id !== sizeId) : [...prev, sizeId]
              )}
              onColorChange={(colorId: string) => setSelectedColors(prev =>
                prev.includes(colorId) ? prev.filter(id => id !== colorId) : [...prev, colorId]
              )}
              onPriceChange={setPriceRange}
            />
          </aside>
          <main className="col-md-9">
            <h1 className="mb-4">{category?.name || 'Category'}</h1>
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

export default ShopCategory;
