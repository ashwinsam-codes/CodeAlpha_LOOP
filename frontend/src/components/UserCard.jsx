import React, { useState } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserCard = ({ targetUser, onProfileClick, compact = false }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.some((id) => (id._id || id) === targetUser._id) || false
  );
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to follow users.');
      return;
    }
    try {
      setLoading(true);
      const res = await userAPI.toggleFollow(targetUser._id);
      setIsFollowing(res.data.following);
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isSelf = currentUser?._id === targetUser._id;

  return (
    <div
      className={`user-card ${compact ? 'user-card-compact' : ''}`}
      onClick={() => onProfileClick(targetUser.username)}
    >
      <img
        src={targetUser.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
        alt={targetUser.name}
        className="user-card-avatar"
      />
      <div className="user-card-info">
        <span className="user-card-name">{targetUser.name}</span>
        <span className="user-card-username">@{targetUser.username}</span>
        {!compact && targetUser.bio && (
          <p className="user-card-bio">{targetUser.bio}</p>
        )}
      </div>

      {!isSelf && isAuthenticated && (
        <button
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
          onClick={handleFollowToggle}
          disabled={loading}
        >
          {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
