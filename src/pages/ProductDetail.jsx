import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../data/products.json';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedProducts = localStorage.getItem('adminProducts');
    const currentProducts = storedProducts ? JSON.parse(storedProducts) : productsData;
    const foundProduct = currentProducts.find(p => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = cart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Ürün zaten sepetteyse miktarını artır
        cart[existingItemIndex].quantity += 1;
      } else {
        // Yeni ürünse sepete ekle
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      setMessage(`${product.name} sepete eklendi!`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!product) {
    return <div style={styles.container}>Ürün bulunamadı.</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>&lt; Geri</button>
      <div style={styles.productDetailCard}>
        <img src={product.imageUrl} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h2 style={styles.name}>{product.name}</h2>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>Fiyat: {product.price.toFixed(2)} TL</p>
          <p style={styles.preparationTime}>Yapım Süresi: {product.preparationTime}</p>
          <button onClick={handleAddToCart} style={styles.addButton}>
            Sepete Ekle
          </button>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'var(--secondary-color)', 
    color: 'var(--dark-brown)',
    marginBottom: '20px',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  productDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    width: '100%',
    boxSizing: 'border-box',
    '@media (min-width: 600px)': {
      flexDirection: 'row',
      textAlign: 'left',
      gap: '30px',
    },
  },
  image: {
    width: '100%',
    maxWidth: '400px',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '20px',
    '@media (min-width: 600px)': {
      marginBottom: '0',
      width: '50%',
    },
  },
  info: {
    textAlign: 'center',
    width: '100%',
    '@media (min-width: 600px)': {
      textAlign: 'left',
      width: '50%',
    },
  },
  name: {
    fontSize: '2.2em',
    color: 'var(--dark-brown)',
    marginBottom: '10px',
    '@media (max-width: 600px)': {
      fontSize: '1.8em',
    },
  },
  description: {
    fontSize: '1.1em',
    color: 'var(--dark-brown)',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  price: {
    fontSize: '1.6em',
    color: 'var(--medium-brown)',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  preparationTime: {
    fontSize: '0.95em',
    color: '#777',
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: 'var(--primary-color)', 
    color: 'var(--dark-brown)',
    padding: '14px 30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  message: {
    marginTop: '15px',
    color: '#28A745',
    fontWeight: 'bold',
  }
};

export default ProductDetail; 