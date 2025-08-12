import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Settings as SettingsIcon, 
  Moon, 
  Sun,
  ChevronDown,
  X,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock
} from 'lucide-react';
import './Header.css';

function Header({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Estoque baixo',
      message: 'Produto XYZ com apenas 5 unidades',
      time: '5 min',
      icon: Package,
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Nova venda',
      message: 'Venda #1234 realizada com sucesso',
      time: '15 min',
      icon: ShoppingCart,
      unread: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Novo cliente',
      message: 'Cliente Maria Silva foi cadastrado',
      time: '1h',
      icon: Users,
      unread: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Relatório pronto',
      message: 'Relatório mensal de vendas disponível',
      time: '2h',
      icon: TrendingUp,
      unread: false
    }
  ];

  // Mock search results
  const mockSearchResults = [
    { id: 1, type: 'product', title: 'Produto ABC', subtitle: 'Estoque: 25 unidades' },
    { id: 2, type: 'customer', title: 'João Silva', subtitle: 'Cliente desde 2023' },
    { id: 3, type: 'sale', title: 'Venda #1234', subtitle: 'R$ 150,00 - Hoje' },
    { id: 4, type: 'supplier', title: 'Fornecedor XYZ', subtitle: 'Último pedido: 15/08' }
  ];

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 1) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchFocused(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return { icon: Package, color: 'text-orange' };
      case 'success': return { icon: ShoppingCart, color: 'text-green' };
      case 'info': return { icon: TrendingUp, color: 'text-blue' };
      default: return { icon: Bell, color: 'text-secondary' };
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Left Section */}
        <div className="header-left">
          {/* Mobile Menu Toggle */}
          <button 
            className="header-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Logo */}
          <div className="header-logo">
            <h1>Stock Web</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div 
            ref={searchRef}
            className={`header-search ${searchFocused ? 'header-search--focused' : ''}`}
          >
            <div className="header-search-input-wrapper">
              <Search size={18} className="header-search-icon" />
              <input
                type="text"
                className="header-search-input"
                placeholder="Buscar produtos, clientes, vendas..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
              />
              {searchQuery && (
                <button 
                  className="header-search-clear"
                  onClick={clearSearch}
                  aria-label="Limpar busca"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Results */}
            {searchFocused && searchResults.length > 0 && (
              <div className="header-search-results">
                <div className="header-search-results-header">
                  <span>Resultados da busca</span>
                </div>
                <div className="header-search-results-list">
                  {searchResults.map((result) => (
                    <button 
                      key={result.id}
                      className="header-search-result-item"
                      onClick={() => {
                        console.log('Navigate to:', result);
                        clearSearch();
                      }}
                    >
                      <div className="header-search-result-content">
                        <span className="header-search-result-title">{result.title}</span>
                        <span className="header-search-result-subtitle">{result.subtitle}</span>
                      </div>
                      <span className="header-search-result-type">{result.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {/* Theme Toggle */}
          <button 
            className="header-action-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div ref={notificationsRef} className="header-dropdown-container">
            <button 
              className="header-action-btn header-notifications-trigger"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-expanded={notificationsOpen}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="header-notification-badge">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="header-dropdown header-notifications-dropdown">
                <div className="header-dropdown-header">
                  <h3>Notificações</h3>
                  {unreadCount > 0 && (
                    <span className="header-notification-count">{unreadCount} novas</span>
                  )}
                </div>
                
                <div className="header-notifications-list">
                  {notifications.map((notification) => {
                    const { icon: IconComponent, color } = getNotificationIcon(notification.type);
                    return (
                      <div 
                        key={notification.id}
                        className={`header-notification-item ${notification.unread ? 'unread' : ''}`}
                      >
                        <div className={`header-notification-icon ${color}`}>
                          <IconComponent size={16} />
                        </div>
                        <div className="header-notification-content">
                          <h4 className="header-notification-title">{notification.title}</h4>
                          <p className="header-notification-message">{notification.message}</p>
                          <div className="header-notification-time">
                            <Clock size={12} />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                        {notification.unread && <div className="header-notification-dot" />}
                      </div>
                    );
                  })}
                </div>
                
                <div className="header-dropdown-footer">
                  <button className="header-dropdown-footer-btn">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div ref={profileRef} className="header-dropdown-container">
            <button 
              className="header-profile-trigger"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
            >
              <div className="header-user-avatar">
                <User size={16} />
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{user?.name || user?.username || 'Usuário'}</span>
                <span className="header-user-role">{user?.role || 'Admin'}</span>
              </div>
              <ChevronDown 
                size={14} 
                className={`header-dropdown-chevron ${profileOpen ? 'rotated' : ''}`}
              />
            </button>

            {profileOpen && (
              <div className="header-dropdown header-profile-dropdown">
                <div className="header-dropdown-header">
                  <div className="header-profile-avatar-large">
                    <User size={24} />
                  </div>
                  <div className="header-profile-info">
                    <h3>{user?.name || user?.username || 'Usuário'}</h3>
                    <p>{user?.email || 'admin@stockweb.com'}</p>
                  </div>
                </div>
                
                <div className="header-dropdown-divider" />
                
                <div className="header-dropdown-menu">
                  <button className="header-dropdown-item">
                    <User size={16} />
                    <span>Meu Perfil</span>
                  </button>
                  <button className="header-dropdown-item">
                    <SettingsIcon size={16} />
                    <span>Configurações</span>
                  </button>
                </div>
                
                <div className="header-dropdown-divider" />
                
                <button 
                  className="header-dropdown-item header-logout-btn"
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
