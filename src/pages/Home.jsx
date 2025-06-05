import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import productsData from '../data/products.json';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü'); // Varsayılan olarak tüm kategoriler
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('adminProducts');
    let currentProducts = storedProducts ? JSON.parse(storedProducts) : productsData;
    
    // Yalnızca yayında olan ürünleri filtrele
    const publishedProducts = currentProducts.filter(product => product.isPublished);
    setProducts(publishedProducts);

    // Kategorileri dinamik olarak oluştur
    const uniqueCategories = ['Tümü', ...new Set(publishedProducts.map(product => product.category))];
    setCategories(uniqueCategories);

  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    let results = products.filter(product =>
      product.name.toLowerCase().includes(lowercasedSearchTerm)
    );

    if (selectedCategory !== 'Tümü') {
      results = results.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(results);
  }, [searchTerm, products, selectedCategory]);

  return (
    <div style={styles.container}>
      <h1>Ürünlerimiz</h1>
      <input
        type="text"
        placeholder="Ürün ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />
      <div style={styles.categoryButtons}>
        {categories.map(category => (
          <button 
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={selectedCategory === category ? styles.activeCategoryButton : styles.categoryButton}
          >
            {category}
          </button>
        ))}
      </div>
      <div style={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Aradığınız veya seçtiğiniz kategoride ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  searchInput: {
    width: 'calc(100% - 40px)', // Ekrana göre genişlik ayarı
    maxWidth: '500px',
    padding: '12px 15px',
    margin: '20px auto',
    borderRadius: '25px',
    border: '1px solid var(--secondary-color)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    fontSize: '1.1em',
    display: 'block',
  },
  categoryButtons: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  categoryButton: {
    backgroundColor: 'var(--light-gray)',
    color: 'var(--dark-brown)',
    padding: '8px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'normal',
  },
  activeCategoryButton: {
    backgroundColor: 'var(--primary-color)',
    color: '#FFFFFF',
    padding: '8px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '30px',
    justifyContent: 'center',
  },
};

export default Home; 