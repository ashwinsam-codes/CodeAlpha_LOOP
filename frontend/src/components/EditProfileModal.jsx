import React, { useState } from 'react';
import { X, Camera, Sparkles, Check } from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { REALISTIC_AVATARS } from '../utils/photoPresets';

const EditProfileModal = ({ onClose, onProfileUpdated }) => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [showPresets, setShowPresets] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle local avatar upload
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await userAPI.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        profilePic: profilePic.trim()
      });

      updateUser(res.data.user);
      if (onProfileUpdated) onProfileUpdated(res.data.user);
      onClose();
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Profile</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          {/* Avatar Edit Section */}
          <div className="edit-avatar-section">
            <div className="avatar-preview-container">
              <img
                src={profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt="Avatar preview"
                className="edit-avatar-img"
              />
              <label className="avatar-upload-overlay" title="Upload new photo">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  style={{ display: 'none' }}
                />
                <Camera size={20} color="#ffffff" />
              </label>
            </div>

            <div className="avatar-action-links">
              <button
                type="button"
                className="preset-toggle-btn"
                onClick={() => setShowPresets(!showPresets)}
              >
                <Sparkles size={14} />
                <span>{showPresets ? 'Hide presets' : 'Realistic portrait presets'}</span>
              </button>
            </div>
          </div>

          {/* Realistic Avatar Presets Grid */}
          {showPresets && (
            <div className="avatar-presets-grid">
              {REALISTIC_AVATARS.map((avatar, idx) => (
                <div
                  key={idx}
                  className={`avatar-preset-thumb ${profilePic === avatar.url ? 'active' : ''}`}
                  onClick={() => {
                    setProfilePic(avatar.url);
                  }}
                  title={avatar.name}
                >
                  <img src={avatar.url} alt={avatar.name} />
                  {profilePic === avatar.url && (
                    <div className="preset-selected-check">
                      <Check size={12} color="#ffffff" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              maxLength={50}
              required
            />
          </div>

          {/* Bio Field */}
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your interests, passions, or work..."
              rows={3}
              maxLength={200}
            />
            <span className="char-hint">{200 - bio.length} characters left</span>
          </div>

          {/* Profile Picture URL Field */}
          <div className="form-group">
            <label className="form-label">Or Custom Image URL</label>
            <input
              type="url"
              className="form-input"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {error && <div className="form-error-msg">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
