import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Portfolio = () => (
  <>
    <Navbar />
    <div className="container py-5">
      <h1>Portfolio</h1>
      <p>Check out some of our beautiful arrangements and plant installations for past clients.</p>
      {/* Add portfolio gallery here */}
    </div>
    <Footer />
  </>
);

export default Portfolio;
