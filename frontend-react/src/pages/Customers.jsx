import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Loader
} from 'lucide-react';
import './Customers.css';

function Customers() {
  const { makeAuthenticatedRequest } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, allCustomers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest('/api/customers');
      setAllCustomers(data);
      setCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setAllCustomers([]);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = allCustomers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    setCustomers(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await makeAuthenticatedRequest(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });
      
      await loadCustomers();
      showSuccess('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente: ' + error.message);
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return '--';
    // Format phone number if needed
    return phone;
  };

  const showSuccess = (message) => {
    console.log(message);
  };

  if (loading) {
    return (
      <div className="customers-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="customers-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Clientes</h1>
        <p className="page-subtitle">Gerencie seus clientes e contatos</p>
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
                  placeholder="Pesquisar clientes por nome, email ou telefone..."
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
                  Novo Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="customers-grid">
        {customers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>
              {searchTerm ? 
                'Nenhum cliente encontrado' : 
                'Nenhum cliente cadastrado'
              }
            </h3>
            <p>
              {searchTerm ? 
                'Tente ajustar os filtros de busca' : 
                'Comece adicionando seu primeiro cliente'
              }
            </p>
            {!searchTerm && (
              <button className="btn-primary-modern">
                <Plus size={16} />
                Adicionar Primeiro Cliente
              </button>
            )}
          </div>
        ) : (
          customers.map(customer => (
            <div key={customer.id} className="customer-card">
              <div className="customer-header">
                <div className="customer-avatar">
                  <Users size={24} />
                </div>
                <div className="customer-actions">
                  <button
                    className="btn-icon btn-edit"
                    title="Editar cliente"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteCustomer(customer.id)}
                    title="Excluir cliente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="customer-info">
                <h3 className="customer-name">{customer.name}</h3>
                
                <div className="customer-details">
                  {customer.email && (
                    <div className="customer-detail">
                      <Mail size={16} />
                      <span>{customer.email}</span>
                    </div>
                  )}
                  
                  {customer.phone && (
                    <div className="customer-detail">
                      <Phone size={16} />
                      <span>{formatPhone(customer.phone)}</span>
                    </div>
                  )}
                  
                  {customer.address && (
                    <div className="customer-detail">
                      <MapPin size={16} />
                      <span>{customer.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="customer-meta">
                  <span className="customer-id">ID: #{customer.id}</span>
                  {customer.created_at && (
                    <span className="customer-date">
                      Desde {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {customers.length > 0 && (
        <div className="customers-summary">
          <div className="modern-card">
            <div className="card-body">
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{allCustomers.length}</span>
                  <span className="stat-label">Total de Clientes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{customers.length}</span>
                  <span className="stat-label">
                    {searchTerm ? 'Resultados da Busca' : 'Exibindo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
