import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { userAPI } from '../services/api';
import UserCard from './UserCard';
import { useAuth } from '../context/AuthContext';

const RightSidebar = ({ onOpenProfile }) => {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Fetch suggestions
  useEffect(() => {
    if (isAuthenticated) {
      loadSuggestions();
    }
  }, [isAuthenticated]);

  const loadSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const res = await userAPI.getSuggestions();
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await userAPI.search(query.trim());
        setSearchResults(res.data.users || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query]);

  return (
    <aside className="right-sidebar">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search people on LOOP..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {query.trim().length > 0 && (
          <div className="search-dropdown">
            <div className="search-dropdown-header">
              {isSearching ? 'Searching...' : `Results for "${query}"`}
            </div>
            {searchResults.length === 0 && !isSearching ? (
              <div className="search-no-results">No accounts found matching "{query}"</div>
            ) : (
              searchResults.map((user) => (
                <UserCard
                  key={user._id}
                  targetUser={user}
                  onProfileClick={(uname) => {
                    setQuery('');
                    onOpenProfile(uname);
                  }}
                  compact={true}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Suggested Users Section */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <div className="widget-title-row">
            <Sparkles size={16} className="text-secondary" />
            <h3 className="widget-title">Suggested For You</h3>
          </div>
          {isAuthenticated && (
            <button className="widget-action-btn" onClick={loadSuggestions}>
              Refresh
            </button>
          )}
        </div>

        <div className="widget-content">
          {loadingSuggestions ? (
            <div className="loading-spinner-small">Loading suggestions...</div>
          ) : suggestions.length === 0 ? (
            <div className="empty-widget-text">No new suggestions at the moment.</div>
          ) : (
            suggestions.slice(0, 4).map((user) => (
              <UserCard
                key={user._id}
                targetUser={user}
                onProfileClick={onOpenProfile}
                compact={true}
              />
            ))
          )}
        </div>
      </div>

      {/* About LOOP Micro-Card */}
      <div className="sidebar-widget loop-info-card">
        <h4 className="info-card-title">Welcome to LOOP</h4>
        <p className="info-card-text">
          A minimalist social space designed for genuine sharing, natural photography, and clean aesthetics.
        </p>
        <div className="info-card-tags">
          <span className="info-pill">#Minimal</span>
          <span className="info-pill">#Photography</span>
          <span className="info-pill">#EverydayLife</span>
        </div>
      </div>

      <footer className="footer-links">
        <span>© 2026 LOOP Inc.</span>
        <span>Privacy</span>
        <span>Terms</span>
        <span>Explore</span>
      </footer>
    </aside>
  );
};

export default RightSidebar;
