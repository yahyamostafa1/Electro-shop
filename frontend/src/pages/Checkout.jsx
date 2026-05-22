import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
  } = useContext(CartContext);

  // Steps: 1 = Shipping & Payment, 2 = Order Review, 3 = Success
  const [step, setStep] = useState(1);

  // Form Fields
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [localPaymentMethod, setLocalPaymentMethod] = useState(paymentMethod || 'Credit Card');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState('');

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [user, cartItems, step, navigate]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping details');
      return;
    }
    saveShippingAddress({ address, city, postalCode, country });
    savePaymentMethod(localPaymentMethod);
    setError(null);
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create Order in DB
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: localPaymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const { data: createdOrder } = await api.post('/orders', orderPayload);

      // Simulate Payment
      await api.put(`/orders/${createdOrder._id}/pay`, {
        id: 'PAY_SIM_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        status: 'COMPLETED',
        email_address: user.email,
      });

      setOrderId(createdOrder._id);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Checkout Progress Bar */}
      {step < 3 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          <span style={{ color: step === 1 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
            1. Shipping & Payment
          </span>
          <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
          <span style={{ color: step === 2 ? 'var(--color-primary)' : 'var(--text-muted)' }}>
            2. Review & Place Order
          </span>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Step 1: Shipping and Payment */}
      {step === 1 && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="glass-panel">
          <form onSubmit={handleNextStep} style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={22} className="gradient-text" /> Shipping Address
            </h2>

            <div className="form-group">
              <label htmlFor="address">Address Line</label>
              <input
                id="address"
                type="text"
                className="form-control"
                placeholder="123 Tech Street"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  className="form-control"
                  placeholder="San Francisco"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  type="text"
                  className="form-control"
                  placeholder="94103"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                className="form-control"
                placeholder="United States"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)', margin: '2rem 0' }} />

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={22} className="gradient-text" /> Payment Method
            </h2>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <label
                  key={method}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    background: localPaymentMethod === method ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${localPaymentMethod === method ? 'var(--color-primary)' : 'var(--border-glass)'}`,
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={localPaymentMethod === method}
                    onChange={(e) => setLocalPaymentMethod(e.target.value)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              Continue To Order Review <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Order Review */}
      {step === 2 && (
        <div className="cart-grid">
          {/* Items & Shipping review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Shipping Details</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <strong>Name:</strong> {user.name} <br />
                <strong>Address:</strong> {address}, {city}, {postalCode}, {country}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Payment Method</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                <strong>Method:</strong> {localPaymentMethod}
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Order Items</h2>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--border-glass)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <Link to={`/product/${item.product}`} className="navbar-link" style={{ fontWeight: 600 }}>
                      {item.name}
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Quantity: {item.qty} &times; ${item.price}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    ${(item.qty * item.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="cart-summary glass-panel">
            <h3>Place Your Order</h3>
            <div className="summary-row">
              <span>Items Total:</span>
              <span>${itemsPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (15% VAT):</span>
              <span>${taxPrice.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total Price:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">
                Back
              </button>
              <button onClick={handlePlaceOrder} className="btn btn-primary">
                Place Order & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && (
        <div
          className="glass-panel"
          style={{
            maxWidth: '600px',
            margin: '4rem auto 0',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <CheckCircle size={64} style={{ color: '#34d399' }} />
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
              Order Placed Successfully!
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Thank you for your purchase. We have received your order and are preparing it for shipment.
            </p>
            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
              }}
            >
              Order ID: {orderId}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/" className="btn btn-primary">
              Return Home
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Shop More
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
