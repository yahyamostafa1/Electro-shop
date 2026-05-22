import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Globe, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-main">
      <div className="container">
        <div className="footer-grid">
          {/* Logo & About */}
          <div className="footer-col">
            <Link to="/" className="navbar-logo" style={{ marginBottom: '1rem' }}>
              <Cpu className="gradient-text" size={24} />
              <span className="gradient-text" style={{ fontSize: '1.25rem' }}>ELECTRO.IO</span>
            </Link>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your premium destination for modern electronics, gaming consoles, and futuristic accessories. Elevate your setup today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
              <a href="#" className="navbar-link" title="Website"><Globe size={20} /></a>
              <a href="#" className="navbar-link" title="Email"><Mail size={20} /></a>
              <a href="#" className="navbar-link" title="Phone"><Phone size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Phones">Smartphones</Link></li>
              <li><Link to="/products?category=Computers">Laptops</Link></li>
              <li><Link to="/products?category=Audio">Audio</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ & Help</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Refunds</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3>Contact Us</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email: support@electro.io</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Phone: +1 (555) 019-2834</p>
            <p style={{ fontSize: '0.9rem' }}>Address: 100 Tech Avenue, Silicon Valley, CA</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} ELECTRO.IO. All rights reserved. Created for premium demo presentation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
