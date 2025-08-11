import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const getUserInitial = () => {
    return user?.username ? user.username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      <header className="modern-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle" 
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <a href="/dashboard" className="header-brand">
              Stock Web
            </a>
          </div>
          
          <div className="header-user">
            <div className="user-avatar">
              {getUserInitial()}
            </div>
            <button 
              className="btn-secondary-modern btn-sm"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Modal de confirmação de logout */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Logout</h3>
            </div>
            <div className="modal-body">
              <p>Tem certeza que deseja sair do sistema?</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary-modern"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary-modern"
                onClick={handleLogout}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
