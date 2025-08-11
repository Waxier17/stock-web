import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Truck,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  Loader
} from 'lucide-react';
import SupplierModal from '../components/SupplierModal/SupplierModal';
import './Suppliers.css';

function Suppliers() {
  const { makeAuthenticatedRequest } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, allSuppliers]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest('/api/suppliers');
      setAllSuppliers(data);
      setSuppliers(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setAllSuppliers([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = allSuppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (supplier.phone && supplier.phone.includes(searchTerm)) ||
        (supplier.cnpj && supplier.cnpj.includes(searchTerm))
      );
    }

    setSuppliers(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSuppliers();
    setRefreshing(false);
  };

  const handleAddSupplier = async (supplierData) => {
    try {
      await makeAuthenticatedRequest('/api/suppliers', {
        method: 'POST',
        body: JSON.stringify(supplierData),
      });
      
      setShowAddModal(false);
      await loadSuppliers();
      showSuccess('Fornecedor adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      throw error;
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowEditModal(true);
  };

  const handleUpdateSupplier = async (supplierData) => {
    try {
      await makeAuthenticatedRequest(`/api/suppliers/${editingSupplier.id}`, {
        method: 'PUT',
        body: JSON.stringify(supplierData),
      });
      
      setShowEditModal(false);
      setEditingSupplier(null);
      await loadSuppliers();
      showSuccess('Fornecedor atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      throw error;
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) return;

    try {
      await makeAuthenticatedRequest(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
      });
      
      await loadSuppliers();
      showSuccess('Fornecedor excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      alert('Erro ao excluir fornecedor: ' + error.message);
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return '--';
    return phone;
  };

  const formatCNPJ = (cnpj) => {
    if (!cnpj) return '--';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const showSuccess = (message) => {
    console.log(message);
  };

  if (loading) {
    return (
      <div className="suppliers-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando fornecedores...</p>
      </div>
    );
  }

  return (
    <div className="suppliers-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Fornecedores</h1>
        <p className="page-subtitle">Controle completo dos seus fornecedores</p>
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
                  placeholder="Pesquisar fornecedores por nome, email, telefone ou CNPJ..."
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
                <button
                  className="btn-primary-modern"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} />
                  Novo Fornecedor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="suppliers-grid">
        {suppliers.length === 0 ? (
          <div className="empty-state">
            <Truck size={48} />
            <h3>
              {searchTerm ? 
                'Nenhum fornecedor encontrado' : 
                'Nenhum fornecedor cadastrado'
              }
            </h3>
            <p>
              {searchTerm ? 
                'Tente ajustar os filtros de busca' : 
                'Comece adicionando seu primeiro fornecedor'
              }
            </p>
            {!searchTerm && (
              <button 
                className="btn-primary-modern"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                Adicionar Primeiro Fornecedor
              </button>
            )}
          </div>
        ) : (
          suppliers.map(supplier => (
            <div key={supplier.id} className="supplier-card">
              <div className="supplier-header">
                <div className="supplier-avatar">
                  <Truck size={24} />
                </div>
                <div className="supplier-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleEditSupplier(supplier)}
                    title="Editar fornecedor"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    title="Excluir fornecedor"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="supplier-info">
                <h3 className="supplier-name">{supplier.name}</h3>
                
                <div className="supplier-details">
                  {supplier.cnpj && (
                    <div className="supplier-detail">
                      <FileText size={16} />
                      <span>CNPJ: {formatCNPJ(supplier.cnpj)}</span>
                    </div>
                  )}
                  
                  {supplier.email && (
                    <div className="supplier-detail">
                      <Mail size={16} />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="supplier-detail">
                      <Phone size={16} />
                      <span>{formatPhone(supplier.phone)}</span>
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="supplier-detail">
                      <MapPin size={16} />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                  
                  {supplier.contact_person && (
                    <div className="supplier-detail">
                      <Building size={16} />
                      <span>Contato: {supplier.contact_person}</span>
                    </div>
                  )}
                </div>
                
                <div className="supplier-meta">
                  <span className="supplier-id">ID: #{supplier.id}</span>
                  {supplier.created_at && (
                    <span className="supplier-date">
                      Desde {new Date(supplier.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {suppliers.length > 0 && (
        <div className="suppliers-summary">
          <div className="modern-card">
            <div className="card-body">
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{allSuppliers.length}</span>
                  <span className="stat-label">Total de Fornecedores</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{suppliers.length}</span>
                  <span className="stat-label">
                    {searchTerm ? 'Resultados da Busca' : 'Exibindo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddModal && (
        <SupplierModal
          title="Novo Fornecedor"
          onSave={handleAddSupplier}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Supplier Modal */}
      {showEditModal && editingSupplier && (
        <SupplierModal
          title="Editar Fornecedor"
          supplier={editingSupplier}
          onSave={handleUpdateSupplier}
          onCancel={() => {
            setShowEditModal(false);
            setEditingSupplier(null);
          }}
        />
      )}
    </div>
  );
}

export default Suppliers;
