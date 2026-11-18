import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import NavbarMobile from './components/NavbarMobile';
import CreatePost from './components/CreatePost';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import { X } from 'lucide-react';
import './App.css';

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [targetUsername, setTargetUsername] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Navigate to user profile
  const handleOpenProfile = (username) => {
    setTargetUsername(username || user?.username);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate back to previous view or home
  const handleBack = () => {
    setCurrentView('home');
    setTargetUsername(null);
  };

  if (loading) {
    return (
      <div className="app-loader">
        <div className="logo-badge large spin-slow">
          <div className="logo-inner-circle" />
        </div>
        <span className="logo-text-loader">LOOP</span>
      </div>
    );
  }

  // Full page view for Login / Register
  if (currentView === 'login') {
    return <Login setView={setCurrentView} />;
  }

  if (currentView === 'register') {
    return <Register setView={setCurrentView} />;
  }

  return (
    <div className="app-layout">
      {/* Left Navigation Sidebar (Desktop) */}
      <Sidebar
        currentView={currentView}
        setView={(view) => {
          if (view === 'profile') setTargetUsername(user?.username);
          setCurrentView(view);
        }}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
        onOpenProfile={handleOpenProfile}
      />

      {/* Main Center Content Column */}
      <main className="main-viewport">
        {currentView === 'home' && (
          <Home
            onOpenProfile={handleOpenProfile}
            onOpenCreatePostModal={() => setShowCreatePostModal(true)}
          />
        )}

        {currentView === 'explore' && (
          <Explore onOpenProfile={handleOpenProfile} />
        )}

        {currentView === 'profile' && (
          <Profile
            targetUsername={targetUsername}
            onBack={handleBack}
            onOpenProfile={handleOpenProfile}
          />
        )}
      </main>

      {/* Right Sidebar (Desktop) */}
      <RightSidebar onOpenProfile={handleOpenProfile} />

      {/* Bottom Navigation (Mobile) */}
      <NavbarMobile
        currentView={currentView}
        setView={(view) => {
          if (view === 'profile') setTargetUsername(user?.username);
          setCurrentView(view);
        }}
        onOpenCreatePost={() => setShowCreatePostModal(true)}
        onOpenProfile={handleOpenProfile}
      />

      {/* Global Create Post Modal */}
      {showCreatePostModal && (
        <div className="modal-backdrop" onClick={() => setShowCreatePostModal(false)}>
          <div className="modal-card post-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Post</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCreatePostModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <CreatePost
              isModal={true}
              onCloseModal={() => setShowCreatePostModal(false)}
              onPostCreated={() => {
                setShowCreatePostModal(false);
                setCurrentView('home');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
