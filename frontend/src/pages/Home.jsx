import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Headphones, Laptop, Gamepad2, Keyboard, Heart } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        // Show top 4 products on the homepage as "featured"
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Phones', icon: <Smartphone size={20} /> },
    { name: 'Computers', icon: <Laptop size={20} /> },
    { name: 'Audio', icon: <Headphones size={20} /> },
    { name: 'Gaming', icon: <Gamepad2 size={20} /> },
    { name: 'Accessories', icon: <Keyboard size={20} /> },
  ];

  return (
    <div className="container">
      {/* Hero Banner */}
      <section className="hero-section glass-panel">
        <div className="hero-grid" style={{ padding: '2rem 3rem' }}>
          <div>
            <span className="hero-subtitle">New Tech Release</span>
            <h1 className="hero-title">
              The Next Gen of <br />
              <span className="gradient-text">Electronics</span> is Here
            </h1>
            <p className="hero-description">
              Dive into the future with state-of-the-art tech. Experience professional-grade devices, ultra-responsive audio gears, and elite gaming setups built for high performance.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/products" className="btn btn-primary">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/products?category=Gaming" className="btn btn-secondary">
                Console Gaming
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80"
              alt="PlayStation 5 Console"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Browse by <span className="gradient-text">Category</span>
        </h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/products?category=${cat.name}`)}
              className="category-card glass-panel glass-panel-hover"
              style={{ width: '140px', textAlign: 'center' }}
            >
              <div
                className="gradient-bg"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {cat.icon}
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h2>Featured <span className="gradient-text">Products</span></h2>
          <Link
            to="/products"
            className="navbar-link"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
