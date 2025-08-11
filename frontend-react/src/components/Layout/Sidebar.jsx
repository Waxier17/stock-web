import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  Folder,
  UserCog,
  BarChart3
} from 'lucide-react';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Painel'
    },
    {
      path: '/inventory',
      icon: Package,
      label: 'Estoque'
    },
    {
      path: '/sales',
      icon: ShoppingCart,
      label: 'Vendas'
    },
    {
      path: '/customers',
      icon: Users,
      label: 'Clientes'
    },
    {
      path: '/suppliers',
      icon: Truck,
      label: 'Fornecedores'
    },
    {
      path: '/categories',
      icon: Folder,
      label: 'Categorias'
    },
    {
      path: '/users',
      icon: UserCog,
      label: 'Usuários'
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Relatórios'
    }
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <nav className={`modern-sidebar ${isOpen ? 'show' : ''}`}>
        <ul className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <IconComponent className="nav-icon" size={20} />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
