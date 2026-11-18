import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Edit3, UserCheck, UserPlus } from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';

const Profile = ({ targetUsername, onBack, onOpenProfile }) => {
  const { user: currentUser, isAuthenticated, updateUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isSelf =
    currentUser &&
    (currentUser.username?.toLowerCase() === targetUsername?.toLowerCase() || !targetUsername);

  useEffect(() => {
    loadProfile();
  }, [targetUsername, currentUser?.username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const usernameToFetch = targetUsername || currentUser?.username;
      if (!usernameToFetch) return;

      const res = await userAPI.getProfile(usernameToFetch);
      const { user: fetchedUser, posts: userPosts } = res.data;

      setProfileData(fetchedUser);
      setPosts(userPosts || []);
      setFollowersCount(fetchedUser.followers?.length || 0);
      setFollowingCount(fetchedUser.following?.length || 0);

      // Check if logged-in user is following this profile
      if (currentUser && fetchedUser) {
        const followingMatch = fetchedUser.followers?.some(
          (f) => (f._id || f) === currentUser._id
        );
        setIsFollowing(followingMatch);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to follow users.');
      return;
    }

    try {
      setFollowLoading(true);
      const res = await userAPI.toggleFollow(profileData._id);
      setIsFollowing(res.data.following);
      setFollowersCount(res.data.followersCount);

      // Update following in local user state
      if (currentUser) {
        let updatedFollowing = [...(currentUser.following || [])];
        if (res.data.following) {
          updatedFollowing.push(profileData._id);
        } else {
          updatedFollowing = updatedFollowing.filter(
            (id) => (id._id || id) !== profileData._id
          );
        }
        updateUser({ ...currentUser, following: updatedFollowing });
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  if (loading) {
    return (
      <div className="page-container profile-page">
        <div className="stream-loading" style={{ padding: '2rem' }}>
          <div className="skeleton-post" style={{ height: '220px' }} />
          <div className="skeleton-post" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="page-container profile-page">
        <header className="page-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title">Profile</h1>
        </header>
        <div className="stream-empty">
          <h3>User not found</h3>
          <p>The profile you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container profile-page">
      {/* Top Header */}
      <header className="page-header profile-header-bar">
        <button className="back-btn" onClick={onBack} title="Back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title">{profileData.name}</h1>
          <span className="profile-post-count">{posts.length} posts</span>
        </div>
      </header>

      {/* Banner / Avatar Header */}
      <div className="profile-hero">
        <div className="profile-banner" />
        <div className="profile-meta-top">
          <div className="profile-avatar-wrap">
            <img
              src={profileData.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={profileData.name}
              className="profile-hero-avatar"
            />
          </div>

          <div className="profile-actions-header">
            {isSelf ? (
              <button
                className="btn btn-outline edit-profile-btn"
                onClick={() => setShowEditModal(true)}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            ) : isAuthenticated ? (
              <button
                className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'} follow-action-btn`}
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={16} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* Profile Bio & Details */}
        <div className="profile-details">
          <h2 className="profile-name">{profileData.name}</h2>
          <span className="profile-handle">@{profileData.username}</span>

          <p className="profile-bio-text">{profileData.bio || 'Exploring moments on LOOP ✨'}</p>

          <div className="profile-info-row">
            <span className="profile-info-item">
              <Calendar size={14} className="text-secondary" />
              <span>Joined {new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </span>
          </div>

          {/* Stats: Following & Followers */}
          <div className="profile-stats-row">
            <div className="profile-stat">
              <span className="stat-number">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-nav-tabs">
        <button className="profile-tab active">Posts</button>
      </div>

      {/* User Posts Stream */}
      <div className="posts-stream">
        {posts.length === 0 ? (
          <div className="stream-empty">
            <h3>No posts yet</h3>
            <p>@{profileData.username} hasn't published any posts yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDeletePost={handleDeletePost}
              onProfileClick={onOpenProfile}
            />
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={(updated) => {
            setProfileData(updated);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
