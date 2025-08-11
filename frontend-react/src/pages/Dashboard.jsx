import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Plus,
  ShoppingCart,
  UserPlus,
  Truck,
  FolderPlus,
  UserCog,
  BarChart3,
  RefreshCw,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { user, makeAuthenticatedRequest } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    lowStockItems: 0,
    totalCustomers: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar dados do dashboard
  const loadDashboardData = async () => {
    try {
      const isRefresh = !loading;
      if (isRefresh) setRefreshing(true);

      // Carregar dados em paralelo
      const [products, sales, customers] = await Promise.all([
        makeAuthenticatedRequest('/api/inventory/products'),
        makeAuthenticatedRequest('/api/sales'),
        makeAuthenticatedRequest('/api/customers')
      ]);

      // Calcular estatísticas
      const lowStock = products.filter(p => {
        const stock = p.stock_quantity || p.stock || 0;
        const minStock = p.min_stock_level || p.minStock || 10;
        return stock <= minStock;
      });

      // Vendas do mês atual
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.created_at || sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      });

      const totalValue = monthlySales.reduce((sum, sale) => 
        sum + (sale.final_amount || sale.totalAmount || 0), 0
      );

      setStats({
        totalProducts: products.length,
        totalSales: totalValue,
        lowStockItems: lowStock.length,
        totalCustomers: customers.length
      });

      // Vendas recentes (últimas 5)
      const recentSalesData = sales
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
        .slice(0, 5);
      
      setRecentSales(recentSalesData);

      // Alertas de estoque baixo (primeiros 5)
      setLowStockAlerts(lowStock.slice(0, 5));

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    let greeting = 'Boa noite';
    
    if (currentHour < 12) greeting = 'Bom dia';
    else if (currentHour < 18) greeting = 'Boa tarde';
    
    return `${greeting}, ${user?.username || 'Usuário'}!`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h1 className="page-title">{getGreeting()}</h1>
        <p className="page-subtitle">Visão geral do seu negócio em tempo real</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="stat-card slide-in">
            <div className="stat-icon">
              <Package />
            </div>
            <div className="stat-number">{stats.totalProducts}</div>
            <div className="stat-label">Total de Produtos</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card slide-in" style={{animationDelay: '0.1s'}}>
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-number">{formatCurrency(stats.totalSales)}</div>
            <div className="stat-label">Vendas do Mês</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card slide-in" style={{animationDelay: '0.2s'}}>
            <div className="stat-icon">
              <AlertTriangle />
            </div>
            <div className="stat-number">{stats.lowStockItems}</div>
            <div className="stat-label">Estoque Baixo</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card slide-in" style={{animationDelay: '0.3s'}}>
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-number">{stats.totalCustomers}</div>
            <div className="stat-label">Clientes Ativos</div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="modern-card mb-5">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Ações Rápidas</h2>
          <span className="badge-modern">Acesso direto às principais funcionalidades</span>
        </div>
        <div className="card-body">
          <div className="quick-actions-grid">
            {/* Principais */}
            <div className="action-section">
              <h3 className="action-section-title">Principais</h3>
              <div className="action-buttons">
                <button 
                  className="btn-primary-modern action-btn"
                  onClick={() => window.location.href = '/inventory'}
                >
                  <Plus />
                  <span>Adicionar Produto</span>
                </button>
                <button 
                  className="btn-primary-modern action-btn"
                  onClick={() => window.location.href = '/sales'}
                >
                  <ShoppingCart />
                  <span>Nova Venda</span>
                </button>
              </div>
            </div>

            {/* Cadastros */}
            <div className="action-section">
              <h3 className="action-section-title">Cadastros</h3>
              <div className="action-buttons">
                <button 
                  className="btn-secondary-modern action-btn"
                  onClick={() => window.location.href = '/customers'}
                >
                  <UserPlus />
                  <span>Novo Cliente</span>
                </button>
                <button 
                  className="btn-secondary-modern action-btn"
                  onClick={() => window.location.href = '/suppliers'}
                >
                  <Truck />
                  <span>Novo Fornecedor</span>
                </button>
                <button 
                  className="btn-secondary-modern action-btn"
                  onClick={() => window.location.href = '/categories'}
                >
                  <FolderPlus />
                  <span>Nova Categoria</span>
                </button>
                <button 
                  className="btn-secondary-modern action-btn"
                  onClick={() => window.location.href = '/users'}
                >
                  <UserCog />
                  <span>Novo Usuário</span>
                </button>
              </div>
            </div>

            {/* Relatórios */}
            <div className="action-section">
              <h3 className="action-section-title">Relatórios</h3>
              <div className="action-buttons">
                <button 
                  className="btn-accent-modern action-btn"
                  onClick={() => window.location.href = '/reports'}
                >
                  <BarChart3 />
                  <span>Relatórios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Vendas Recentes */}
        <div className="col-md-8">
          <div className="modern-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title">Vendas Recentes</h2>
              <button 
                className="btn-secondary-modern btn-sm"
                onClick={loadDashboardData}
                disabled={refreshing}
              >
                <RefreshCw size={16} className={refreshing ? 'spinner' : ''} />
                Atualizar
              </button>
            </div>
            <div className="card-body">
              <div style={{overflowX: 'auto'}}>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center" style={{padding: '2rem', color: 'var(--gray-500)'}}>
                          <ShoppingCart size={24} />
                          <br /><br />Nenhuma venda encontrada
                        </td>
                      </tr>
                    ) : (
                      recentSales.map(sale => (
                        <tr key={sale.id}>
                          <td>#{sale.id}</td>
                          <td>{sale.customerName || 'Cliente não informado'}</td>
                          <td>{formatDate(sale.created_at || sale.date)}</td>
                          <td>{formatCurrency(sale.final_amount || sale.totalAmount || 0)}</td>
                          <td>
                            <span className="badge-success">
                              Concluída
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas de Estoque */}
        <div className="col-md-4">
          <div className="modern-card">
            <div className="card-header">
              <h2 className="card-title">Alertas de Estoque</h2>
            </div>
            <div className="card-body">
              {lowStockAlerts.length === 0 ? (
                <div className="text-center" style={{padding: '1rem', color: 'var(--success-500)'}}>
                  <CheckCircle size={32} />
                  <br /><br />
                  <strong>Tudo em ordem!</strong><br />
                  Nenhum produto com estoque baixo
                </div>
              ) : (
                lowStockAlerts.map(product => (
                  <div key={product.id} className="low-stock-item">
                    <div>
                      <strong>{product.name}</strong><br />
                      <small style={{color: 'var(--warning-500)'}}>
                        Estoque: {product.stock_quantity || product.stock || 0} unidades
                      </small>
                    </div>
                    <AlertTriangle size={20} style={{color: 'var(--warning-500)'}} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
