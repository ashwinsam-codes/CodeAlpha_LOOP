import React from 'react';
import { Home, Compass, User as UserIcon, LogOut, PlusCircle, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentView, setView, onOpenCreatePost, onOpenProfile }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Logo */}
        <div className="logo-container" onClick={() => setView('home')}>
          <div className="logo-badge">
            <div className="logo-inner-circle" />
          </div>
          <span className="logo-text">LOOP</span>
        </div>

        {/* Navigation Items */}
        <nav className="nav-menu">
          <button
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setView('home')}
          >
            <Home className="nav-icon" size={22} />
            <span className="nav-label">Home</span>
          </button>

          <button
            className={`nav-item ${currentView === 'explore' ? 'active' : ''}`}
            onClick={() => setView('explore')}
          >
            <Compass className="nav-icon" size={22} />
            <span className="nav-label">Explore</span>
          </button>

          {isAuthenticated && (
            <button
              className={`nav-item ${currentView === 'profile' && !window.viewOtherUser ? 'active' : ''}`}
              onClick={() => {
                onOpenProfile(user?.username);
              }}
            >
              <UserIcon className="nav-icon" size={22} />
              <span className="nav-label">Profile</span>
            </button>
          )}
        </nav>

        {isAuthenticated && (
          <button className="create-post-sidebar-btn" onClick={onOpenCreatePost}>
            <PlusCircle size={20} />
            <span>Create Post</span>
          </button>
        )}
      </div>

      {/* Sidebar Bottom / User Profile Card */}
      <div className="sidebar-bottom">
        {isAuthenticated && user ? (
          <div className="sidebar-user-card">
            <img
              src={user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="sidebar-avatar"
              onClick={() => onOpenProfile(user.username)}
            />
            <div className="sidebar-user-info" onClick={() => onOpenProfile(user.username)}>
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-handle">@{user.username}</div>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={logout}
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="sidebar-auth-actions">
            <button
              className="btn btn-outline full-width"
              onClick={() => setView('login')}
            >
              <LogIn size={18} />
              <span>Log In</span>
            </button>
            <button
              className="btn btn-primary full-width"
              onClick={() => setView('register')}
            >
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
