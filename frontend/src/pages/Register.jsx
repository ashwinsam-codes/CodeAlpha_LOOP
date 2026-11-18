import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, Sparkles, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { REALISTIC_AVATARS } from '../utils/photoPresets';

const Register = ({ setView }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: 'Exploring moments on LOOP ✨',
    profilePic: REALISTIC_AVATARS[0].url
  });
  const [showPresets, setShowPresets] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        bio: formData.bio.trim(),
        profilePic: formData.profilePic.trim()
      });
      setView('home');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card register-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="logo-badge">
            <div className="logo-inner-circle" />
          </div>
          <h2 className="auth-brand-name">LOOP</h2>
          <p className="auth-brand-subtitle">Join the minimal social community</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Avatar Selection */}
          <div className="register-avatar-select">
            <img
              src={formData.profilePic}
              alt="Selected avatar"
              className="register-avatar-preview"
            />
            <button
              type="button"
              className="preset-toggle-btn"
              onClick={() => setShowPresets(!showPresets)}
            >
              <Sparkles size={14} />
              <span>{showPresets ? 'Close realistic avatars' : 'Choose realistic photo avatar'}</span>
            </button>
          </div>

          {showPresets && (
            <div className="avatar-presets-grid">
              {REALISTIC_AVATARS.map((avatar, idx) => (
                <div
                  key={idx}
                  className={`avatar-preset-thumb ${formData.profilePic === avatar.url ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, profilePic: avatar.url })}
                  title={avatar.name}
                >
                  <img src={avatar.url} alt={avatar.name} />
                  {formData.profilePic === avatar.url && (
                    <div className="preset-selected-check">
                      <Check size={12} color="#ffffff" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                className="form-input icon-padded"
                placeholder="e.g. Maya Patel"
                value={formData.name}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username *</label>
            <div className="input-with-icon">
              <span className="input-prefix">@</span>
              <input
                type="text"
                name="username"
                className="form-input prefix-padded"
                placeholder="maya_p"
                value={formData.username}
                onChange={handleChange}
                maxLength={30}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="form-input icon-padded"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password * (min 6 characters)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                name="password"
                className="form-input icon-padded"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Bio (optional)</label>
            <textarea
              name="bio"
              className="form-textarea"
              placeholder="Tell others a bit about yourself..."
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              maxLength={200}
            />
          </div>

          <button type="submit" className="btn btn-primary full-width auth-btn" disabled={loading}>
            <UserPlus size={18} />
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already have an account?</span>
          <button className="auth-link-btn" onClick={() => setView('login')}>
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
