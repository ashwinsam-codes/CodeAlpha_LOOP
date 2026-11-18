import React from 'react';
import { Home, Compass, PlusCircle, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavbarMobile = ({ currentView, setView, onOpenCreatePost, onOpenProfile }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => setView('home')}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'explore' ? 'active' : ''}`}
        onClick={() => setView('explore')}
      >
        <Compass size={22} />
        <span>Explore</span>
      </button>

      {isAuthenticated ? (
        <>
          <button
            className="mobile-nav-item mobile-post-btn"
            onClick={onOpenCreatePost}
          >
            <PlusCircle size={26} />
          </button>

          <button
            className={`mobile-nav-item ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => onOpenProfile(user?.username)}
          >
            <User size={22} />
            <span>Profile</span>
          </button>
        </>
      ) : (
        <button
          className={`mobile-nav-item ${currentView === 'login' ? 'active' : ''}`}
          onClick={() => setView('login')}
        >
          <LogIn size={22} />
          <span>Login</span>
        </button>
      )}
    </nav>
  );
};

export default NavbarMobile;
