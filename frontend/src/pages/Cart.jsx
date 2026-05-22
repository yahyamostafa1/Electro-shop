import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    updateQty,
    removeFromCart,
  } = useContext(CartContext);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const checkoutHandler = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        Shopping <span className="gradient-text">Cart</span>
      </h1>

      {cartItems.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <ShoppingBag size={48} className="text-muted" />
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)' }}>Looks like you haven't added anything to your cart yet.</p>
          </div>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items List */}
          <div>
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item glass-panel">
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div>
                  <Link
                    to={`/product/${item.product}`}
                    style={{ fontWeight: 600, color: 'white', fontSize: '1.05rem' }}
                    className="navbar-link"
                  >
                    {item.name}
                  </Link>
                </div>

                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  ${item.price.toLocaleString()}
                </div>

                {/* Qty Selector */}
                <div>
                  <select
                    value={item.qty}
                    onChange={(e) => updateQty(item.product, e.target.value)}
                    className="form-control"
                    style={{ width: '70px', padding: '0.4rem' }}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove Button */}
                <div>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="btn btn-danger"
                    style={{ padding: '0.5rem', borderRadius: '6px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary glass-panel">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({totalItems}):</span>
              <span>${itemsPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (15% VAT):</span>
              <span>${taxPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>

            <button
              onClick={checkoutHandler}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem' }}
            >
              Proceed To Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
