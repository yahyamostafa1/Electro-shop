import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, StarHalf, ShoppingCart, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={14} fill="currentColor" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} size={14} fill="currentColor" />);
      } else {
        stars.push(<Star key={i} size={14} />);
      }
    }
    return stars;
  };

  return (
    <div className="product-card glass-panel glass-panel-hover">
      <Link to={`/product/${product._id}`} className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </Link>

      <div className="product-content">
        <span className="product-category">{product.brand} • {product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>

        <div className="product-rating">
          {renderStars(product.rating)}
          <span>({product.numReviews})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toLocaleString()}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '0.5rem 0.75rem', borderRadius: '6px' }}
          >
            {added ? (
              <>
                <Check size={16} style={{ color: '#34d399' }} />
                <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Added</span>
              </>
            ) : product.countInStock === 0 ? (
              <span style={{ fontSize: '0.8rem' }}>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span style={{ fontSize: '0.8rem' }}>Buy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
