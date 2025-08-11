import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  ShoppingCart,
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Users,
  Package,
  Loader
} from 'lucide-react';
import SaleModal from '../components/SaleModal/SaleModal';
import './Sales.css';

function Sales() {
  const { makeAuthenticatedRequest } = useAuth();
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    totalSalesMonth: 0,
    totalTransactions: 0,
    averageTicket: 0
  });

  useEffect(() => {
    loadSalesData();
  }, []);

  useEffect(() => {
    filterSales();
  }, [searchTerm, allSales]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSales(),
        loadCustomers(),
        loadProducts()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      const data = await makeAuthenticatedRequest('/api/sales');
      setAllSales(data);
      setSales(data);
      calculateStats(data);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setAllSales([]);
      setSales([]);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await makeAuthenticatedRequest('/api/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setCustomers([]);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await makeAuthenticatedRequest('/api/inventory/products');
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    }
  };

  const calculateStats = (salesData) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Vendas de hoje
    const todaySales = salesData.filter(sale => {
      const saleDate = new Date(sale.created_at || sale.date);
      return saleDate.toDateString() === today.toDateString();
    });
    
    const totalSalesToday = todaySales.reduce((sum, sale) => 
      sum + (sale.final_amount || sale.totalAmount || 0), 0
    );

    // Vendas do mês
    const monthlySales = salesData.filter(sale => {
      const saleDate = new Date(sale.created_at || sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    
    const totalSalesMonth = monthlySales.reduce((sum, sale) => 
      sum + (sale.final_amount || sale.totalAmount || 0), 0
    );

    // Ticket médio
    const averageTicket = salesData.length > 0 ? 
      salesData.reduce((sum, sale) => sum + (sale.final_amount || sale.totalAmount || 0), 0) / salesData.length : 0;

    setStats({
      totalSalesToday,
      totalSalesMonth,
      totalTransactions: salesData.length,
      averageTicket
    });
  };

  const filterSales = () => {
    let filtered = allSales;

    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.id.toString().includes(searchTerm) ||
        (sale.customerName && sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sale.customer_name && sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setSales(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSalesData();
    setRefreshing(false);
  };

  const handleAddSale = async (saleData) => {
    try {
      await makeAuthenticatedRequest('/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });
      
      setShowAddModal(false);
      await loadSales();
      showSuccess('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      throw error;
    }
  };

  const handleEditSale = (sale) => {
    setEditingSale(sale);
    setShowEditModal(true);
  };

  const handleUpdateSale = async (saleData) => {
    try {
      await makeAuthenticatedRequest(`/api/sales/${editingSale.id}`, {
        method: 'PUT',
        body: JSON.stringify(saleData),
      });
      
      setShowEditModal(false);
      setEditingSale(null);
      await loadSales();
      showSuccess('Venda atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      throw error;
    }
  };

  const handleDeleteSale = async (saleId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) return;

    try {
      await makeAuthenticatedRequest(`/api/sales/${saleId}`, {
        method: 'DELETE',
      });
      
      await loadSales();
      showSuccess('Venda excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      alert('Erro ao excluir venda: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showSuccess = (message) => {
    console.log(message);
  };

  if (loading) {
    return (
      <div className="sales-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando vendas...</p>
      </div>
    );
  }

  return (
    <div className="sales-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Vendas</h1>
        <p className="page-subtitle">Registre e acompanhe suas vendas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="stat-card slide-in">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-number">{formatCurrency(stats.totalSalesToday)}</div>
            <div className="stat-label">Vendas Hoje</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card slide-in" style={{animationDelay: '0.1s'}}>
            <div className="stat-icon">
              <Calendar />
            </div>
            <div className="stat-number">{formatCurrency(stats.totalSalesMonth)}</div>
            <div className="stat-label">Vendas do Mês</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card slide-in" style={{animationDelay: '0.2s'}}>
            <div className="stat-icon">
              <ShoppingCart />
            </div>
            <div className="stat-number">{stats.totalTransactions}</div>
            <div className="stat-label">Transações</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card slide-in" style={{animationDelay: '0.3s'}}>
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-number">{formatCurrency(stats.averageTicket)}</div>
            <div className="stat-label">Ticket Médio</div>
          </div>
        </div>
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
                  placeholder="Pesquisar vendas por ID ou cliente..."
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
                  Nova Venda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="modern-card">
        <div className="card-header">
          <h2 className="card-title">Histórico de Vendas</h2>
          <span className="sales-count">
            {sales.length} venda{sales.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Subtotal</th>
                  <th>Desconto</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      <ShoppingCart size={32} />
                      <br /><br />
                      {searchTerm ? 
                        'Nenhuma venda encontrada com os filtros aplicados' : 
                        'Nenhuma venda registrada'
                      }
                    </td>
                  </tr>
                ) : (
                  sales.map(sale => (
                    <tr key={sale.id}>
                      <td>#{sale.id}</td>
                      <td>{formatDate(sale.created_at || sale.date)}</td>
                      <td>{sale.customerName || sale.customer_name || 'Cliente não informado'}</td>
                      <td>{sale.items?.length || 0} itens</td>
                      <td>{formatCurrency(sale.subtotal || 0)}</td>
                      <td>{formatCurrency(sale.discount || 0)}</td>
                      <td><strong>{formatCurrency(sale.final_amount || sale.totalAmount || 0)}</strong></td>
                      <td>
                        <span className="sale-status completed">
                          Concluída
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => {/* Ver detalhes */}}
                            title="Ver detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditSale(sale)}
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteSale(sale.id)}
                            title="Excluir"
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

      {/* Add Sale Modal */}
      {showAddModal && (
        <SaleModal
          title="Nova Venda"
          customers={customers}
          products={products}
          onSave={handleAddSale}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Sale Modal */}
      {showEditModal && editingSale && (
        <SaleModal
          title="Editar Venda"
          customers={customers}
          products={products}
          sale={editingSale}
          onSave={handleUpdateSale}
          onCancel={() => {
            setShowEditModal(false);
            setEditingSale(null);
          }}
        />
      )}
    </div>
  );
}

export default Sales;
