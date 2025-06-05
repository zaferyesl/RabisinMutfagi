import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: '',
    note: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleQuantityChange = (id, amount) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + amount } : item
      ).filter(item => item.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Sepetiniz boş. Lütfen ürün ekleyin.");
      return;
    }
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone) {
      alert("Lütfen adınız, adresiniz ve telefon numaranızı eksiksiz giriniz.");
      return;
    }

    const orderDetails = cartItems.map(item =>
      `${item.name} (${item.quantity} adet) - ${(item.price * item.quantity).toFixed(2)} TL`
    ).join('\n');

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    const whatsappMessage = encodeURIComponent(
      `*Yeni Sipariş Detayları*\n\n` +
      `*Müşteri Bilgileri:*\n` +
      `Ad Soyad: ${customerInfo.name}\n` +
      `Adres: ${customerInfo.address}\n` +
      `Telefon: ${customerInfo.phone}\n` +
      (customerInfo.note ? `Not: ${customerInfo.note}\n` : '') +
      `\n` +
      `*Sipariş Edilen Ürünler:*\n` +
      `${orderDetails}\n` +
      `\n` +
      `*Toplam Tutar: ${totalAmount} TL*`
    );

    // Telefon numarasını buraya eklemeyi unutmayın. Örneğin: 905XXXXXXXXX
    const whatsappUrl = `https://wa.me/905XXXXXXXXX?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');

    // Sipariş sonrası sepeti temizle
    localStorage.removeItem('cart');
    setCartItems([]);
    setCustomerInfo({
      name: '',
      address: '',
      phone: '',
      note: '',
    });

    alert("Siparişiniz WhatsApp üzerinden iletiliyor!");
    navigate('/'); // Ana sayfaya yönlendir
  };

  const totalCartAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  return (
    <div style={styles.container}>
      <h1>Sepetim</h1>
      {cartItems.length === 0 ? (
        <p>Sepetinizde ürün bulunmamaktadır. Hadi <a href="/" style={{ color: 'var(--medium-brown)', textDecoration: 'underline' }}>ürünlere göz atın</a>!</p>
      ) : (
        <div style={styles.cartContent}>
          <div style={styles.cartItemsContainer}>
            {cartItems.map(item => (
              <div key={item.id} style={styles.cartItem}>
                <img src={item.imageUrl} alt={item.name} style={styles.itemImage} />
                <div style={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p>{item.price.toFixed(2)} TL</p>
                  <div style={styles.quantityControl}>
                    <button onClick={() => handleQuantityChange(item.id, -1)} style={styles.quantityButton}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} style={styles.quantityButton}>+</button>
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} style={styles.removeButton}>Kaldır</button>
              </div>
            ))}
          </div>
          <div style={styles.orderSummary}>
            <h2>Sipariş Bilgileri</h2>
            <div style={styles.totalAmount}>Toplam Tutar: {totalCartAmount} TL</div>
            <p style={styles.whatsappWarning}>*Lütfen WhatsApp numaranızı `src/pages/Cart.jsx` dosyasında güncelleyin!*</p>
            <input
              type="text"
              name="name"
              placeholder="Ad Soyad"
              value={customerInfo.name}
              onChange={handleInfoChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Adres"
              value={customerInfo.address}
              onChange={handleInfoChange}
              style={styles.input}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefon Numarası (örn: 5xxxxxxxxx)"
              value={customerInfo.phone}
              onChange={handleInfoChange}
              style={styles.input}
              required
            />
            <textarea
              name="note"
              placeholder="Sipariş Notu (isteğe bağlı)"
              value={customerInfo.note}
              onChange={handleInfoChange}
              style={styles.textarea}
            ></textarea>
            <button onClick={handlePlaceOrder} style={styles.orderButton}>
              Siparişi Tamamla (WhatsApp)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: 'auto',
    textAlign: 'center',
  },
  cartContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    marginTop: '30px',
    // Responsive for smaller screens
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  },
  cartItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    flex: 1,
    // Responsive adjustments
    '@media (min-width: 768px)': {
      marginRight: '20px',
    },
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #EEE',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    textAlign: 'center',
    '@media (min-width: 480px)': {
      justifyContent: 'flex-start',
      textAlign: 'left',
    },
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '5px',
  },
  itemDetails: {
    flexGrow: 1,
    textAlign: 'left',
    // Responsive adjustments
    '@media (max-width: 479px)': {
      width: '100%',
      textAlign: 'center',
    },
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '5px',
    '@media (max-width: 479px)': {
      justifyContent: 'center',
    },
  },
  quantityButton: {
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--dark-brown)',
    //border: 'none', (already in global CSS)
    borderRadius: '5px',
    width: '35px',
    height: '35px',
    //cursor: 'pointer', (already in global CSS)
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'var(--accent-color)', 
    color: 'var(--dark-brown)',
    //border: 'none', (already in global CSS)
    padding: '10px 15px',
    //borderRadius: '5px', (already in global CSS)
    //cursor: 'pointer', (already in global CSS)
  },
  orderSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    flex: 1,
  },
  totalAmount: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: 'var(--medium-brown)',
    marginBottom: '10px',
  },
  whatsappWarning: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '10px',
    fontSize: '0.9em',
  },
  input: {
    //width: 'calc(100% - 20px)', (handled by global CSS)
    //padding: '10px', (handled by global CSS)
    //borderRadius: '5px', (handled by global CSS)
    //border: '1px solid #DDD', (handled by global CSS)
    //fontSize: '1em', (handled by global CSS)
  },
  textarea: {
    //width: 'calc(100% - 20px)', (handled by global CSS)
    //padding: '10px', (handled by global CSS)
    //borderRadius: '5px', (handled by global CSS)
    //border: '1px solid #DDD', (handled by global CSS)
    //fontSize: '1em', (handled by global CSS)
    minHeight: '80px',
    resize: 'vertical',
  },
  orderButton: {
    backgroundColor: 'var(--primary-color)', 
    color: 'var(--dark-brown)',
    //border: 'none', (already in global CSS)
    padding: '15px 25px',
    //borderRadius: '8px', (already in global CSS)
    //cursor: 'pointer', (already in global CSS)
    fontSize: '1.3em',
    fontWeight: 'bold',
    marginTop: '10px',
    //transition: 'background-color 0.3s ease', (already in global CSS)
  },
};

export default Cart; 