import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import ProductDetailPage from './pages/ProductDetail.jsx';
import CartPage from './pages/Cart.jsx';
import AdminPage from './pages/Admin.jsx';

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalCount);
    };
    // Initial load
    updateCartCount();
    // Listen for changes in localStorage (e.g., from other pages)
    window.addEventListener('storage', updateCartCount);
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <Router>
      <nav style={styles.navbar}>
        <Link to="/" style={styles.navLink}>Ana Sayfa</Link>
        <Link to="/cart" style={styles.navLink}>Sepet ({cartItemCount})</Link>
      </nav>
      <div style={styles.mainContent}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
      <Link to="/cart" style={styles.floatingCartButton}>
        Sepet <span style={styles.cartCount}>{cartItemCount}</span>
      </Link>
    </Router>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 20px',
    backgroundColor: 'var(--secondary-color)', /* Pastel şeftali */
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    gap: '20px',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  navLink: {
    color: 'var(--dark-brown)',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1em',
    padding: '5px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: 'auto',
    padding: '90px 20px 20px 20px', // Navbar yüksekliği kadar boşluk
  },
  floatingCartButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--dark-brown)',
    padding: '15px 20px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1em',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    zIndex: 1000,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cartCount: {
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    borderRadius: '50%',
    padding: '5px 10px',
    fontSize: '0.8em',
    minWidth: '25px',
    textAlign: 'center',
  },
};

export default App; 