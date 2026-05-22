import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const { user, loading, error, setError, login, register } = useContext(AuthContext);

  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Clear errors on tab toggle
  useEffect(() => {
    setError(null);
    setLocalError(null);
  }, [isLoginTab, setError]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/' + redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match');
          setSubmitting(false);
          return;
        }
        await register(name, email, password);
      }
    } catch (err) {
      // Handled in Context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-wrapper glass-panel">
        {/* Tabs */}
        <div className="auth-tabs">
          <button
            onClick={() => setIsLoginTab(true)}
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLoginTab(false)}
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
          >
            Register
          </button>
        </div>

        {/* Errors display */}
        {localError && <ErrorMessage message={localError} />}
        {error && <ErrorMessage message={error} />}

        {/* Forms */}
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
          >
            {submitting ? (
              <span>Processing...</span>
            ) : isLoginTab ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Register Account
              </>
            )}
          </button>
        </form>

        {/* Helper values to copy */}
        {isLoginTab && (
          <div
            className="glass-panel"
            style={{
              marginTop: '2rem',
              padding: '1rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <strong>Test Accounts:</strong>
            <span>Standard: <code>user@example.com</code> / <code>user123</code></span>
            <span>Admin: <code>admin@example.com</code> / <code>admin123</code></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
