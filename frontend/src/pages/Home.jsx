import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = ({ onOpenProfile, onOpenCreatePostModal }) => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await postAPI.getAll();
      setPosts(res.data.posts || []);
      setError('');
    } catch (err) {
      console.error('Fetch feed error:', err);
      setError('Could not connect to LOOP backend. Ensure the server is running on port 5000.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (deletedPostId) => {
    setPosts(posts.filter((p) => p._id !== deletedPostId));
  };

  return (
    <div className="page-container feed-page">
      {/* Top Header */}
      <header className="page-header">
        <h1 className="page-title">Home Feed</h1>
        <button
          className="refresh-feed-btn"
          onClick={() => fetchPosts(true)}
          disabled={refreshing}
          title="Refresh feed"
        >
          <RefreshCw size={17} className={refreshing ? 'spin-anim' : ''} />
        </button>
      </header>

      {/* Inline Create Post Box (if authenticated) */}
      {isAuthenticated && (
        <CreatePost onPostCreated={handlePostCreated} />
      )}

      {/* Error Banner */}
      {error && (
        <div className="feed-error-state">
          <p>{error}</p>
          <button className="btn btn-outline" onClick={() => fetchPosts()}>
            Try Again
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="posts-stream">
        {loading ? (
          <div className="stream-loading">
            <div className="skeleton-post" />
            <div className="skeleton-post" />
            <div className="skeleton-post" />
          </div>
        ) : posts.length === 0 ? (
          <div className="stream-empty">
            <h3>No posts in your feed yet</h3>
            <p>Be the first to share an authentic moment or follow other creators!</p>
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
    </div>
  );
};

export default Home;
