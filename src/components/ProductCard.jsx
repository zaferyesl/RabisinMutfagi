import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleClick = (e) => {
    // Ürün kartına tıklama event'ini sepet ekleme/çıkarma butonlarından ayır
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SPAN') {
      navigate(`/product/${product.id}`);
    }
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Ürün zaten sepetteyse miktarını artır
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Yeni ürünse sepete ekle
      cart.push({ ...product, quantity: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setQuantity(1); // Sepete eklendikten sonra miktarı sıfırla
    alert(`${product.name} (${quantity} adet) sepete eklendi!`);

    // Sepet sayacını güncelleyen bir event fırlat (App.jsx dinleyecek)
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <img src={product.imageUrl} alt={product.name} style={styles.image} />
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.price}>{product.price.toFixed(2)} TL</p>
      <div style={styles.addToCartSection}>
        <div style={styles.quantityControl}>
          <button onClick={() => handleQuantityChange(-1)} style={styles.quantityButton}>-</button>
          <span style={styles.currentQuantity}>{quantity}</span>
          <button onClick={() => handleQuantityChange(1)} style={styles.quantityButton}>+</button>
        </div>
        <button onClick={handleAddToCart} style={styles.addButton}>
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease',
    width: '100%',
    maxWidth: '300px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  name: {
    fontSize: '1.3em',
    color: 'var(--dark-brown)',
    margin: '10px 0 5px 0',
  },
  price: {
    fontSize: '1.2em',
    color: 'var(--medium-brown)',
    fontWeight: 'bold',
    margin: '5px 0 10px 0',
  },
  addToCartSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
    width: '100%',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  quantityButton: {
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--dark-brown)',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  currentQuantity: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: 'var(--dark-brown)',
    padding: '0 8px',
    minWidth: '20px',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--dark-brown)',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: 'bold',
    width: 'calc(100% - 20px)',
  },
};

export default ProductCard; 