import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Menu, X, Cpu, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-content">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Cpu className="gradient-text" size={28} />
          <span className="gradient-text" style={{ letterSpacing: '1px' }}>ELECTRO.IO</span>
        </Link>

        {/* Desktop Links */}
        <nav className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Products
          </NavLink>
          {user && user.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* Action icons */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingBag size={22} className="navbar-link" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Profile Dropdown or Sign In */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-secondary"
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '20px',
                }}
              >
                <User size={16} />
                <span>{user.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '45px',
                    right: 0,
                    width: '180px',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    zIndex: 200,
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="admin-sidebar-btn"
                      style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={14} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="admin-sidebar-btn"
                    style={{
                      padding: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--color-accent)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '20px' }}>
              Sign In
            </Link>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
