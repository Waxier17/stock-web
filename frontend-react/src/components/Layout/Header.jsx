import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiSettings, 
  FiMoon, 
  FiSun,
  FiChevronDown 
} from 'react-icons/fi';
import './Header.css';

function Header({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Menu Toggle para Mobile */}
        <button 
          className="header-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Logo/Title para Mobile */}
        <div className="header-logo">
          <h1>Stock Web</h1>
        </div>

        {/* Right Side Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button 
            className="header-action-btn theme-toggle"
            onClick={toggleTheme}
            title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* User Profile Dropdown */}
          <div className="header-profile-container">
            <button 
              className="header-profile-trigger"
              onClick={toggleProfile}
              aria-expanded={profileOpen}
            >
              <div className="header-user-avatar">
                <FiUser size={16} />
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{user?.name || user?.username || 'Usuário'}</span>
                <span className="header-user-role">{user?.role || 'Admin'}</span>
              </div>
              <FiChevronDown 
                size={16} 
                className={`header-dropdown-icon ${profileOpen ? 'rotated' : ''}`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <>
                <div className="header-profile-overlay" onClick={closeProfile} />
                <div className="header-profile-dropdown">
                  <div className="header-profile-header">
                    <div className="header-profile-avatar">
                      <FiUser size={20} />
                    </div>
                    <div className="header-profile-details">
                      <p className="header-profile-name">{user?.name || user?.username || 'Usuário'}</p>
                      <p className="header-profile-email">{user?.email || 'admin@stockweb.com'}</p>
                    </div>
                  </div>
                  
                  <div className="header-profile-divider" />
                  
                  <div className="header-profile-menu">
                    <button className="header-profile-item">
                      <FiUser size={16} />
                      <span>Meu Perfil</span>
                    </button>
                    <button className="header-profile-item">
                      <FiSettings size={16} />
                      <span>Configurações</span>
                    </button>
                  </div>
                  
                  <div className="header-profile-divider" />
                  
                  <button 
                    className="header-profile-item logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
