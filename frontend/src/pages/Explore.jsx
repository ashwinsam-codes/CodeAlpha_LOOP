import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { userAPI, postAPI } from '../services/api';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';

const Explore = ({ onOpenProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [explorePosts, setExplorePosts] = useState([]);
  const [suggestedPeople, setSuggestedPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    try {
      setLoading(true);
      const [postsRes, usersRes] = await Promise.allSettled([
        postAPI.getAll(),
        userAPI.search('') // gets top users
      ]);

      if (postsRes.status === 'fulfilled') {
        setExplorePosts(postsRes.value.data.posts || []);
      }
      if (usersRes.status === 'fulfilled') {
        setSuggestedPeople(usersRes.value.data.users || []);
      }
    } catch (err) {
      console.error('Explore load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setSearching(true);
      const res = await userAPI.search(searchTerm.trim());
      setSearchResults(res.data.users || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="page-container explore-page">
      <header className="page-header">
        <h1 className="page-title">Explore</h1>
      </header>

      {/* Explore Search Box */}
      <form onSubmit={handleSearchSubmit} className="explore-search-bar">
        <Search size={18} className="text-secondary" />
        <input
          type="text"
          placeholder="Search by name or @username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="explore-input"
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search"
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Search Results Display */}
      {searchTerm.trim().length > 0 && (
        <section className="explore-section">
          <h2 className="section-title">
            People matching "{searchTerm}"
          </h2>
          {searching ? (
            <div className="loading-spinner-small">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="empty-widget-text">No people found matching your query.</div>
          ) : (
            <div className="search-results-grid">
              {searchResults.map((u) => (
                <UserCard
                  key={u._id}
                  targetUser={u}
                  onProfileClick={onOpenProfile}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Suggested Members */}
      <section className="explore-section">
        <div className="section-header-row">
          <Sparkles size={16} />
          <h2 className="section-title">Discover Creators</h2>
        </div>
        <div className="creators-horizontal-scroll">
          {suggestedPeople.map((u) => (
            <div
              key={u._id}
              className="creator-card"
              onClick={() => onOpenProfile(u.username)}
            >
              <img
                src={u.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={u.name}
                className="creator-avatar"
              />
              <span className="creator-name">{u.name}</span>
              <span className="creator-handle">@{u.username}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Posts Stream */}
      <section className="explore-section">
        <h2 className="section-title">Trending Moments</h2>
        <div className="posts-stream">
          {loading ? (
            <div className="stream-loading">
              <div className="skeleton-post" />
              <div className="skeleton-post" />
            </div>
          ) : (
            explorePosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onProfileClick={onOpenProfile}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Explore;
