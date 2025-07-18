import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import './App.css';
import './i18n/config';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import Landscape from './pages/Landscape';
import About from './pages/About.jsx';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import EventsPage from './pages/EventsPage.jsx';
import AuthRoute from './components/Auth/AuthRoute';

// Import all context providers
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { WishlistProvider } from './contexts/WishlistContext.jsx';
import { OrderProvider } from './contexts/OrderContext.jsx';
import { AccountProvider } from './contexts/AccountContext.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { i18n } = useTranslation();

  // Set the default direction based on the language
  React.useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Determine the toast position based on language direction
  const toastPosition = i18n.language === 'ar' ? 'bottom-left' : 'bottom-right';

  return (
    <AuthProvider>
      <AccountProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Router>
                <div className="app">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<AllProducts />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/landscape" element={<Landscape />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/events" element={<EventsPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/cart" element={
                      <AuthRoute>
                        <Cart />
                      </AuthRoute>
                    } />
                    <Route path="/checkout" element={
                      <AuthRoute>
                        <Checkout />
                      </AuthRoute>
                    } />
                    <Route path="/orders" element={
                      <AuthRoute>
                        <Orders />
                      </AuthRoute>
                    } />
                    <Route path="/profile" element={
                      <AuthRoute>
                        <Profile />
                      </AuthRoute>
                    } />
                    <Route path="/wishlist" element={
                      <AuthRoute>
                        <Orders />
                      </AuthRoute>
                    } />
                  </Routes>
                  
                  {/* Toast notifications container */}
                  <ToastContainer 
                    position={toastPosition}
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={i18n.language === 'ar'}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                </div>
              </Router>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AccountProvider>
    </AuthProvider>
  );
}

export default App;
