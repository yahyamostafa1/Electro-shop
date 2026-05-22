import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, PlusCircle, CheckCircle, XCircle, FileText, Send } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'create-product'

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Product Form States
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Protect Admin Route
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'orders') {
        const { data } = await api.get('/orders');
        setOrders(data);
      } else if (activeTab === 'products') {
        const { data } = await api.get('/products');
        setProducts(data);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [activeTab, user]);

  const handleDeliver = async (orderId) => {
    try {
      setLoading(true);
      await api.put(`/orders/${orderId}/deliver`);
      fetchData(); // Refetch updated orders list
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update order');
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg('');

      const productPayload = {
        name: prodName,
        price: Number(prodPrice),
        description: prodDescription,
        image: prodImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
        brand: prodBrand,
        category: prodCategory,
        countInStock: Number(prodStock),
      };

      await api.post('/products', productPayload);

      setSuccessMsg('Product added successfully!');
      // Clear form
      setProdName('');
      setProdPrice('');
      setProdDescription('');
      setProdImage('');
      setProdBrand('');
      setProdCategory('');
      setProdStock('');

      // Redirect to products list tab after a brief delay
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create product');
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await api.delete(`/products/${prodId}`);
        fetchData(); // Refetch products list
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete product');
        setLoading(false);
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Admin <span className="gradient-text">Dashboard</span>
      </h1>

      {error && <ErrorMessage message={error} />}
      {successMsg && (
        <div className="glass-panel" style={{ padding: '1rem', color: '#34d399', borderColor: '#10b981', marginBottom: '1rem' }}>
          {successMsg}
        </div>
      )}

      <div className="admin-grid">
        {/* Admin Navigation Sidebar */}
        <aside className="admin-sidebar glass-panel">
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <FileText size={18} /> Orders List
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`admin-sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            <ShoppingBag size={18} /> Manage Inventory
          </button>
          <button
            onClick={() => setActiveTab('create-product')}
            className={`admin-sidebar-btn ${activeTab === 'create-product' ? 'active' : ''}`}
          >
            <PlusCircle size={18} /> Add New Product
          </button>
        </aside>

        {/* Dashboard Content area */}
        <main className="admin-content glass-panel" style={{ padding: '2rem' }}>
          {loading ? (
            <Loader />
          ) : activeTab === 'orders' ? (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Customer Orders</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No orders placed yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{order._id}</td>
                          <td>{order.user?.name || 'Deleted User'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>${order.totalPrice.toLocaleString()}</td>
                          <td>
                            {order.isPaid ? (
                              <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckCircle size={14} /> Yes
                              </span>
                            ) : (
                              <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <XCircle size={14} /> No
                              </span>
                            )}
                          </td>
                          <td>
                            {order.isDelivered ? (
                              <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckCircle size={14} /> Shipped
                              </span>
                            ) : (
                              <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <XCircle size={14} /> Pending
                              </span>
                            )}
                          </td>
                          <td>
                            {order.isPaid && !order.isDelivered && (
                              <button
                                onClick={() => handleDeliver(order._id)}
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}
                              >
                                Ship Order
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'products' ? (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Products Inventory</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td style={{ fontWeight: 600 }}>{prod.name}</td>
                      <td>{prod.brand}</td>
                      <td>{prod.category}</td>
                      <td>${prod.price.toLocaleString()}</td>
                      <td>{prod.countInStock} units</td>
                      <td>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Product</h2>
              <form onSubmit={handleCreateProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label htmlFor="prodName">Product Name</label>
                    <input
                      id="prodName"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sony WH-1000XM5"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prodBrand">Brand</label>
                    <input
                      id="prodBrand"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sony"
                      required
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="prodCategory">Category</label>
                    <select
                      id="prodCategory"
                      className="form-control"
                      required
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="Phones">Phones</option>
                      <option value="Computers">Computers</option>
                      <option value="Audio">Audio</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="prodPrice">Price ($)</label>
                    <input
                      id="prodPrice"
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="399"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prodStock">Stock Units</label>
                    <input
                      id="prodStock"
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="15"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="prodImage">Image URL</label>
                  <input
                    id="prodImage"
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="prodDescription">Product Description</label>
                  <textarea
                    id="prodDescription"
                    className="form-control"
                    placeholder="Enter detailed specifications..."
                    rows="4"
                    required
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}>
                  <Send size={18} /> Save Product
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
