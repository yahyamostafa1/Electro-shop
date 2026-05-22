import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, StarHalf, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      navigate('/cart');
    }, 1000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={18} fill="currentColor" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} size={18} fill="currentColor" />);
      } else {
        stars.push(<Star key={i} size={18} />);
      }
    }
    return stars;
  };

  if (loading) return <Loader />;
  if (error) return <div className="container" style={{ marginTop: '2rem' }}><ErrorMessage message={error} /></div>;
  if (!product) return null;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Back button */}
      <Link to="/products" className="navbar-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '2rem', fontWeight: 600 }}>
        <ChevronLeft size={16} /> Back to Products
      </Link>

      <div className="details-grid">
        {/* Product Image */}
        <div className="details-image-container">
          <img src={product.image} alt={product.name} className="details-image" />
        </div>

        {/* Product Details Info */}
        <div className="details-info">
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.brand}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>

            <div className="product-rating" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b' }}>
                {renderStars(product.rating)}
              </div>
              <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)' }}>({product.numReviews} customer reviews)</span>
            </div>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
            ${product.price.toLocaleString()}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)', my: '1rem' }} />

          {/* Action Box / Stock */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Availability:</span>
              <span className={`details-stock ${product.countInStock > 0 ? 'stock-in' : 'stock-out'}`}>
                {product.countInStock > 0 ? (
                  <>
                    <CheckCircle size={14} /> In Stock ({product.countInStock} units)
                  </>
                ) : (
                  <>
                    <XCircle size={14} /> Out of Stock
                  </>
                )}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Quantity:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="form-control"
                  style={{ width: '80px', padding: '0.4rem' }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0 || added}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              {added ? (
                <span>Redirecting to Cart...</span>
              ) : (
                <>
                  <ShoppingBag size={20} /> Add To Shopping Cart
                </>
              )}
            </button>
          </div>

          {/* Specs / Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div>
              <strong>Brand:</strong> {product.brand}
            </div>
            <div>
              <strong>Category:</strong> {product.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
