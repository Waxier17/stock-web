import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiTruck, 
  FiTag, 
  FiUser, 
  FiBarChart3,
  FiX,
  FiChevronLeft
} from 'react-icons/fi';
import './Sidebar.css';

const navigationItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: FiHome,
    description: 'Visão geral do sistema'
  },
  {
    path: '/inventory',
    label: 'Produtos',
    icon: FiPackage,
    description: 'Gerenciar estoque'
  },
  {
    path: '/sales',
    label: 'Vendas',
    icon: FiShoppingCart,
    description: 'Controle de vendas'
  },
  {
    path: '/customers',
    label: 'Clientes',
    icon: FiUsers,
    description: 'Base de clientes'
  },
  {
    path: '/suppliers',
    label: 'Fornecedores',
    icon: FiTruck,
    description: 'Gestão de fornecedores'
  },
  {
    path: '/categories',
    label: 'Categorias',
    icon: FiTag,
    description: 'Organizar produtos'
  },
  {
    path: '/users',
    label: 'Usuários',
    icon: FiUser,
    description: 'Gerenciar usuários'
  },
  {
    path: '/reports',
    label: 'Relatórios',
    icon: FiBarChart3,
    description: 'Análises e relatórios'
  }
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <FiPackage size={24} />
            </div>
            <div className="sidebar-logo-text">
              <h1>Stock Web</h1>
              <p>Sistema de Gestão</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Fechar menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} className="sidebar-nav-item">
                  <NavLink
                    to={item.path}
                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeSidebar}
                    title={item.description}
                  >
                    <div className="sidebar-nav-icon">
                      <Icon size={20} />
                    </div>
                    <div className="sidebar-nav-content">
                      <span className="sidebar-nav-label">{item.label}</span>
                      <span className="sidebar-nav-description">{item.description}</span>
                    </div>
                    {isActive && <div className="sidebar-nav-indicator" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="sidebar-version">
              <p>Stock Web v2.0</p>
              <p>Sistema de Gestão</p>
            </div>
            <button 
              className="sidebar-collapse-btn"
              onClick={() => setSidebarOpen(false)}
              title="Recolher menu"
            >
              <FiChevronLeft size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
