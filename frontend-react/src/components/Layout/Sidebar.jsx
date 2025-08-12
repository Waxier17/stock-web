import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  FolderOpen, 
  Users, 
  Truck, 
  ShoppingCart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import './Sidebar.css';

// Navigation items configuration
const navigationItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: BarChart3,
    description: 'Visão geral com gráficos e indicadores'
  },
  {
    name: 'Produtos',
    path: '/inventory',
    icon: Package,
    description: 'Listagem, busca e filtro de produtos'
  },
  {
    name: 'Categorias',
    path: '/categories',
    icon: FolderOpen,
    description: 'Gerenciamento de categorias'
  },
  {
    name: 'Clientes',
    path: '/customers',
    icon: Users,
    description: 'Cadastro e listagem de clientes'
  },
  {
    name: 'Fornecedores',
    path: '/suppliers',
    icon: Truck,
    description: 'Controle de fornecedores'
  },
  {
    name: 'Vendas',
    path: '/sales',
    icon: ShoppingCart,
    description: 'Registro e histórico de vendas'
  },
  {
    name: 'Configurações',
    path: '/settings',
    icon: Settings,
    description: 'Ajustes gerais do sistema'
  }
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''} ${collapsed ? 'sidebar--collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Home size={24} />
            </div>
            {!collapsed && (
              <div className="sidebar-brand-text">
                <h2 className="sidebar-brand-title">Stock Web</h2>
                <p className="sidebar-brand-subtitle">Gestão de Estoque</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle - Desktop Only */}
          <button 
            className="sidebar-collapse-toggle"
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <li key={item.path} className="sidebar-nav-item">
                  <NavLink
                    to={item.path}
                    className={`sidebar-nav-link ${isActive ? 'sidebar-nav-link--active' : ''}`}
                    onClick={closeSidebar}
                    title={collapsed ? item.name : ''}
                  >
                    <div className="sidebar-nav-icon">
                      <IconComponent size={24} />
                    </div>
                    
                    {!collapsed && (
                      <div className="sidebar-nav-content">
                        <span className="sidebar-nav-text">{item.name}</span>
                        <span className="sidebar-nav-description">{item.description}</span>
                      </div>
                    )}

                    {/* Active Indicator */}
                    {isActive && <div className="sidebar-nav-indicator" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-footer-content">
              <div className="sidebar-stats">
                <div className="sidebar-stat">
                  <span className="sidebar-stat-label">Versão</span>
                  <span className="sidebar-stat-value">2.1.0</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
