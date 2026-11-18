import React, { useState } from 'react';
import { Image as ImageIcon, Link, X, Send, Sparkles } from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { REALISTIC_POST_PHOTOS } from '../utils/photoPresets';

const CreatePost = ({ onPostCreated, isModal = false, onCloseModal }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle local image file upload (converts to base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please enter some text for your post.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await postAPI.create({
        content: content.trim(),
        image: imageUrl.trim()
      });

      setContent('');
      setImageUrl('');
      setShowPhotoPicker(false);
      setShowUrlInput(false);

      if (onPostCreated) {
        onPostCreated(res.data.post);
      }
      if (isModal && onCloseModal) {
        onCloseModal();
      }
    } catch (err) {
      console.error('Post creation error:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`create-post-container ${isModal ? 'create-post-modal-content' : ''}`}>
      <div className="create-post-header">
        <img
          src={user?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt={user?.name}
          className="create-post-avatar"
        />
        <div className="create-post-main">
          <textarea
            className="create-post-textarea"
            placeholder="Share a thought, moment, or realistic photo..."
            rows={3}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError('');
            }}
            maxLength={1000}
          />

          {/* Image Preview Box */}
          {imageUrl && (
            <div className="image-preview-wrapper">
              <img
                src={imageUrl}
                alt="Post preview"
                className="image-preview"
                onError={() => setError('Unable to load image from provided source.')}
              />
              <button
                type="button"
                className="image-remove-btn"
                onClick={() => setImageUrl('')}
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Photo Preset Gallery Drawer */}
          {showPhotoPicker && (
            <div className="photo-picker-drawer">
              <div className="photo-picker-title-row">
                <span className="photo-picker-title">
                  <Sparkles size={14} /> Realistic Photographs (Unsplash)
                </span>
                <button
                  type="button"
                  className="close-drawer-btn"
                  onClick={() => setShowPhotoPicker(false)}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="photo-presets-grid">
                {REALISTIC_POST_PHOTOS.map((photo, i) => (
                  <div
                    key={i}
                    className={`photo-preset-item ${imageUrl === photo.url ? 'selected' : ''}`}
                    onClick={() => {
                      setImageUrl(photo.url);
                      setShowPhotoPicker(false);
                    }}
                  >
                    <img src={photo.url} alt={photo.title} />
                    <span className="photo-preset-label">{photo.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom URL Input Field */}
          {showUrlInput && (
            <div className="custom-url-input-row">
              <input
                type="url"
                placeholder="Paste real image URL (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="url-input-field"
              />
              <button
                type="button"
                className="btn-tiny"
                onClick={() => setShowUrlInput(false)}
              >
                Done
              </button>
            </div>
          )}

          {error && <div className="post-error-banner">{error}</div>}

          {/* Action Row */}
          <div className="create-post-actions">
            <div className="media-buttons-group">
              {/* Device Photo Upload */}
              <label className="media-btn" title="Upload realistic photo from computer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <ImageIcon size={18} />
                <span className="media-btn-label">Photo</span>
              </label>

              {/* Realistic Preset Photos */}
              <button
                type="button"
                className="media-btn"
                title="Choose from realistic photo collection"
                onClick={() => {
                  setShowPhotoPicker(!showPhotoPicker);
                  setShowUrlInput(false);
                }}
              >
                <Sparkles size={18} />
                <span className="media-btn-label">Presets</span>
              </button>

              {/* URL input toggle */}
              <button
                type="button"
                className="media-btn"
                title="Paste image link"
                onClick={() => {
                  setShowUrlInput(!showUrlInput);
                  setShowPhotoPicker(false);
                }}
              >
                <Link size={18} />
                <span className="media-btn-label">Link</span>
              </button>
            </div>

            <div className="post-submit-group">
              <span className={`char-counter ${content.length > 900 ? 'warn' : ''}`}>
                {1000 - content.length}
              </span>
              <button
                type="button"
                className="btn btn-primary post-btn"
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
              >
                <Send size={15} />
                <span>{loading ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
