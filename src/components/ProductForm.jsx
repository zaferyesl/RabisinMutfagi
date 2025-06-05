import React, { useState, useEffect } from 'react';

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    preparationTime: '',
    imageUrl: '',
    isPublished: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        preparationTime: product.preparationTime || '',
        imageUrl: product.imageUrl || '',
        isPublished: product.isPublished !== undefined ? product.isPublished : true,
      });
    } else {
      // Yeni ürün formu için varsayılan değerler
      setFormData({
        name: '',
        description: '',
        price: '',
        preparationTime: '',
        imageUrl: '',
        isPublished: true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fiyatı sayıya dönüştür
    const dataToSave = {
      ...formData,
      price: parseFloat(formData.price),
    };
    if (isNaN(dataToSave.price)) {
      alert("Lütfen geçerli bir fiyat giriniz.");
      return;
    }
    onSave(product ? { ...product, ...dataToSave } : dataToSave);
  };

  return (
    <div style={styles.formContainer}>
      <h2>{product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Ürün Açıklaması"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Fiyat (TL)"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="preparationTime"
          placeholder="Yapım Süresi (örn: Siparişten 2 saat sonra hazır)"
          value={formData.preparationTime}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Görsel Linki (URL)"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            style={styles.checkbox}
          />
          Yayında mı?
        </label>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveButton}>Kaydet</button>
          <button type="button" onClick={onCancel} style={styles.cancelButton}>İptal</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    marginTop: '20px',
    maxWidth: '600px',
    margin: '20px auto',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #DDD',
    fontSize: '1em',
  },
  textarea: {
    width: 'calc(100% - 20px)',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #DDD',
    fontSize: '1em',
    minHeight: '80px',
    resize: 'vertical',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    color: '#4A4A4A',
    fontSize: '1em',
  },
  checkbox: {
    transform: 'scale(1.2)',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  saveButton: {
    backgroundColor: '#A8E6CF', /* Pastel yeşili */
    color: '#4A4A4A',
  },
  cancelButton: {
    backgroundColor: '#FFC6B5', /* Pastel kırmızı */
    color: '#6B4423',
  },
};

export default ProductForm; 