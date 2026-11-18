import React, { useState } from 'react';
import { LogIn, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = ({ setView }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(identifier.trim(), password);
      setView('home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (username) => {
    try {
      setLoading(true);
      setError('');
      await login(username, 'password123');
      setView('home');
    } catch (err) {
      console.error('Quick login error:', err);
      setError('Quick login failed. Make sure the backend database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="logo-badge">
            <div className="logo-inner-circle" />
          </div>
          <h2 className="auth-brand-name">LOOP</h2>
          <p className="auth-brand-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input icon-padded"
                placeholder="e.g. sarah_j or sarah@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input icon-padded"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width auth-btn" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Accounts Quick Login */}
        <div className="quick-login-section">
          <div className="divider-text">
            <span>Or try 1-click test account</span>
          </div>
          <div className="quick-login-buttons">
            <button
              type="button"
              className="quick-user-btn"
              onClick={() => handleQuickLogin('sarah_j')}
              disabled={loading}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                alt="Sarah"
              />
              <span>Sarah Jenkins</span>
            </button>

            <button
              type="button"
              className="quick-user-btn"
              onClick={() => handleQuickLogin('marcus_c')}
              disabled={loading}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                alt="Marcus"
              />
              <span>Marcus Chen</span>
            </button>

            <button
              type="button"
              className="quick-user-btn"
              onClick={() => handleQuickLogin('elena_r')}
              disabled={loading}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Elena"
              />
              <span>Elena Rostova</span>
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div className="auth-footer-prompt">
          <span>Don't have an account yet?</span>
          <button className="auth-link-btn" onClick={() => setView('register')}>
            Create an account <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
