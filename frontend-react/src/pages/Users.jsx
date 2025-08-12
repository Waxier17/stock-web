import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UserCog,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
  Loader
} from 'lucide-react';
import './Users.css';

function Users() {
  const { makeAuthenticatedRequest, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, allUsers]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest('/api/users');
      setAllUsers(data);
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setAllUsers([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = allUsers;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setUsers(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      alert('Você não pode excluir seu próprio usuário!');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await makeAuthenticatedRequest(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      await loadUsers();
      showSuccess('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário: ' + error.message);
    }
  };

  const getUserRoleBadge = (role) => {
    const roleConfig = {
      admin: { class: 'badge-admin', label: 'Administrador', icon: Shield },
      user: { class: 'badge-user', label: 'Usuário', icon: User }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    const IconComponent = config.icon;
    
    return (
      <span className={`user-badge ${config.class}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const showSuccess = (message) => {
    console.log(message);
  };

  const isCurrentUser = (userId) => currentUser?.id === userId;

  if (loading) {
    return (
      <div className="users-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="users-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Usuários</h1>
        <p className="page-subtitle">Controle de acesso e permissões do sistema</p>
      </div>

      {/* Action Bar */}
      <div className="modern-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Pesquisar usuários por nome, email ou função..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="action-buttons-container">
                <button
                  className="btn-secondary-modern"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw size={16} className={refreshing ? 'spinner' : ''} />
                  Atualizar
                </button>
                <button className="btn-primary-modern">
                  <Plus size={16} />
                  Novo Usuário
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="modern-card">
        <div className="card-header">
          <h2 className="card-title">
            <UserCog size={20} />
            Usuários do Sistema
          </h2>
          <span className="users-count">
            {users.length} usuário{users.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Último Acesso</th>
                  <th>Criado em</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <UserCog size={32} />
                      <br /><br />
                      {searchTerm ? 
                        'Nenhum usuário encontrado com os filtros aplicados' : 
                        'Nenhum usuário cadastrado'
                      }
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className={isCurrentUser(user.id) ? 'current-user' : ''}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-name">
                              {user.username}
                              {isCurrentUser(user.id) && (
                                <span className="current-user-badge">(Você)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-email">
                          <Mail size={14} />
                          {user.email || '--'}
                        </div>
                      </td>
                      <td>{getUserRoleBadge(user.role)}</td>
                      <td>
                        <div className="last-access">
                          <Calendar size={14} />
                          {user.last_login ? formatDate(user.last_login) : 'Nunca'}
                        </div>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <span className="status-badge active">
                          Ativo
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            title="Editar usuário"
                            disabled={!isCurrentUser(user.id) && user.role === 'admin'}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Excluir usuário"
                            disabled={isCurrentUser(user.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary */}
      {users.length > 0 && (
        <div className="users-summary">
          <div className="modern-card">
            <div className="card-body">
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{allUsers.length}</span>
                  <span className="stat-label">Total de Usuários</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {allUsers.filter(u => u.role === 'admin').length}
                  </span>
                  <span className="stat-label">Administradores</span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {allUsers.filter(u => u.role === 'user').length}
                  </span>
                  <span className="stat-label">Usuários Padrão</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
