import React, { useState, useEffect } from 'react';
import productsDataRaw from '../data/products.json'; // Başlangıç verisi olarak yükle
import ProductForm from '../components/ProductForm.jsx';

const DEFAULT_ADMIN_PASSWORD = 'admin123'; // Güvenli olmayan varsayılan şifre

function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentAdminPassword, setCurrentAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');

  useEffect(() => {
    // Admin şifresini localStorage'dan yükle
    const storedAdminPassword = localStorage.getItem('adminPassword');
    if (storedAdminPassword) {
      setCurrentAdminPassword(storedAdminPassword);
    } else {
      // Eğer yoksa varsayılanı kaydet
      localStorage.setItem('adminPassword', DEFAULT_ADMIN_PASSWORD);
    }

    // Uygulama yüklendiğinde veya Admin paneli açıldığında localStorage'dan ürünleri yükle
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Eğer localStorage boşsa, başlangıç JSON dosyasını kullan ve kaydet
      setProducts(productsDataRaw);
      localStorage.setItem('adminProducts', JSON.stringify(productsDataRaw));
    }
  }, []);

  // Ürünler değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    if (loggedIn) { // Sadece giriş yapıldıysa kaydet
      localStorage.setItem('adminProducts', JSON.stringify(products));
    }
  }, [products, loggedIn]);

  const handleLogin = () => {
    if (password === currentAdminPassword) {
      setLoggedIn(true);
    } else {
      alert("Yanlış şifre!");
      setPassword('');
    }
  };

  const handleChangePassword = () => {
    if (oldPasswordInput === currentAdminPassword) {
      if (newPasswordInput && newPasswordInput === confirmNewPasswordInput) {
        localStorage.setItem('adminPassword', newPasswordInput);
        setCurrentAdminPassword(newPasswordInput);
        alert("Şifre başarıyla değiştirildi!");
        setOldPasswordInput('');
        setNewPasswordInput('');
        setConfirmNewPasswordInput('');
      } else {
        alert("Yeni şifreler eşleşmiyor veya boş olamaz!");
      }
    } else {
      alert("Mevcut şifreniz yanlış!");
    }
  };

  const handleProductSave = (newProduct) => {
    let updatedProducts;
    if (editingProduct) {
      // Ürün düzenleme
      updatedProducts = products.map(p => p.id === newProduct.id ? newProduct : p);
    } else {
      // Yeni ürün ekleme
      newProduct.id = String(products.length > 0 ? Math.max(...products.map(p => Number(p.id))) + 1 : 1); // Basit ID atama
      updatedProducts = [...products, newProduct];
    }
    setProducts(updatedProducts);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleProductDelete = (id) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
    }
  };

  const handleTogglePublish = (id) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === id ? { ...p, isPublished: !p.isPublished } : p
      )
    );
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "products_updated.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert("Güncel ürün verileri products_updated.json olarak indirildi. Bu dosyayı src/data/products.json dosyanızla değiştirebilirsiniz.");
  };

  if (!loggedIn) {
    return (
      <div style={styles.loginContainer}>
        <h2>Admin Girişi</h2>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(); }}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.loginButton}>Giriş Yap</button>
        <p style={styles.passwordHint}>*Varsayılan Şifre: {DEFAULT_ADMIN_PASSWORD} (Test amaçlıdır!)</p>
      </div>
    );
  }

  return (
    <div style={styles.adminContainer}>
      <h1>Admin Paneli</h1>
      <div style={styles.adminActions}>
        <button onClick={handleExportData} style={styles.exportButton}>Verileri Dışa Aktar</button>
        {!showProductForm && (
          <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }} style={styles.addButton}>
            Yeni Ürün Ekle
          </button>
        )}
      </div>

      <div style={styles.passwordChangeSection}>
        <h2>Şifre Değiştir</h2>
        <input
          type="password"
          placeholder="Mevcut Şifre"
          value={oldPasswordInput}
          onChange={(e) => setOldPasswordInput(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Yeni Şifre"
          value={newPasswordInput}
          onChange={(e) => setNewPasswordInput(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Yeni Şifre (Tekrar)"
          value={confirmNewPasswordInput}
          onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleChangePassword} style={styles.changePasswordButton}>Şifreyi Değiştir</button>
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleProductSave}
          onCancel={() => { setEditingProduct(null); setShowProductForm(false); }}
        />
      )}

      {!showProductForm && (
        <div style={styles.productList}>
          <h2>Mevcut Ürünler</h2>
          {products.length === 0 ? (
            <p>Henüz hiç ürün yok.</p>
          ) : (
            products.map(product => (
              <div key={product.id} style={styles.productItem}>
                <img src={product.imageUrl} alt={product.name} style={styles.itemImage} />
                <div style={styles.itemInfo}>
                  <h3>{product.name} ({product.isPublished ? 'Yayında' : 'Yayında Değil'})</h3>
                  <p>Fiyat: {product.price.toFixed(2)} TL</p>
                </div>
                <div style={styles.itemActions}>
                  <button onClick={() => { setEditingProduct(product); setShowProductForm(true); }} style={styles.editButton}>Düzenle</button>
                  <button onClick={() => handleTogglePublish(product.id)} style={product.isPublished ? styles.unpublishButton : styles.publishButton}>
                    {product.isPublished ? 'Yayından Kaldır' : 'Yayınla'}
                  </button>
                  <button onClick={() => handleProductDelete(product.id)} style={styles.deleteButton}>Sil</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: 'var(--light-yellow)',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    margin: '50px auto',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  },
  loginButton: {
    backgroundColor: 'var(--primary-color)', 
    color: 'var(--dark-brown)',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  passwordHint: {
    marginTop: '15px',
    fontSize: '0.9em',
    color: '#777',
    textAlign: 'center',
  },
  adminContainer: {
    padding: '20px',
    maxWidth: '1000px',
    margin: 'auto',
    textAlign: 'center',
  },
  adminActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    margin: '20px 0',
    flexWrap: 'wrap',
  },
  passwordChangeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    marginTop: '30px',
    marginBottom: '30px',
    maxWidth: '500px',
    margin: '30px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  changePasswordButton: {
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: 'var(--light-blue)', 
    color: 'var(--dark-brown)',
  },
  addButton: {
    backgroundColor: 'var(--secondary-color)', 
    color: 'var(--dark-brown)',
  },
  productList: {
    marginTop: '30px',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #EEE',
    gap: '15px',
    flexWrap: 'wrap', 
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '5px',
    flexShrink: 0,
  },
  itemInfo: {
    flexGrow: 1,
    textAlign: 'left',
    minWidth: '150px',
    '@media (max-width: 600px)': {
      width: '100%',
      textAlign: 'center',
      marginTop: '10px',
    },
  },
  itemActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: 'var(--medium-brown)',
    color: 'white',
  },
  publishButton: {
    backgroundColor: 'var(--primary-color)',
    color: 'var(--dark-brown)',
  },
  unpublishButton: {
    backgroundColor: 'var(--light-gray)',
    color: 'var(--dark-brown)',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    color: 'white',
  },
};

export default Admin; 