import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import {
  FiShoppingCart,
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiPackage,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiPrinter,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBarChart2,
  FiPieChart,
  FiTrendingDown,
  FiPercent,
  FiCreditCard,
  FiX,
  FiInfo
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import SaleModal from '../components/SaleModal/SaleModal';
import './Sales.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Sales() {
  const { makeAuthenticatedRequest } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const toast = useToast();
  
  // State management
  const [sales, setSales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI state
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    customer: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
    status: '',
    paymentMethod: ''
  });
  
  // Statistics
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    totalSalesWeek: 0,
    totalSalesMonth: 0,
    totalTransactions: 0,
    averageTicket: 0,
    growthRate: 0,
    topProducts: [],
    paymentMethods: []
  });

  // Chart data
  const [chartData, setChartData] = useState({
    salesTrend: { labels: [], data: [] },
    paymentMethods: { labels: [], data: [] }
  });

  useEffect(() => {
    loadSalesData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allSales]);

  useEffect(() => {
    if (allSales.length > 0) {
      calculateStats();
      generateChartData();
    }
  }, [allSales]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const [salesData, customersData, productsData] = await Promise.all([
        makeAuthenticatedRequest('/api/sales').catch(() => []),
        makeAuthenticatedRequest('/api/customers').catch(() => []),
        makeAuthenticatedRequest('/api/inventory/products').catch(() => [])
      ]);
      
      // Mock data for demonstration
      const mockSales = salesData.length > 0 ? salesData : generateMockSales();
      
      setAllSales(mockSales);
      setSales(mockSales);
      setCustomers(customersData);
      setProducts(productsData);
      
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error);
      toast.error('Erro ao carregar dados de vendas');
    } finally {
      setLoading(false);
    }
  };

  const generateMockSales = () => {
    const customers = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Oliveira'];
    const paymentMethods = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX'];
    const statuses = ['Concluída', 'Pendente', 'Cancelada'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const subtotal = 50 + Math.random() * 500;
      const discount = Math.random() * 20;
      
      return {
        id: i + 1,
        created_at: date.toISOString(),
        customer_name: customers[Math.floor(Math.random() * customers.length)],
        items: Math.floor(Math.random() * 5) + 1,
        subtotal,
        discount,
        final_amount: subtotal - discount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      };
    });
  };

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filter sales by periods
    const todaySales = allSales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= today;
    });

    const weekSales = allSales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= weekAgo;
    });

    const monthSales = allSales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= monthStart;
    });

    const lastMonthSales = allSales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= lastMonthStart && saleDate <= lastMonthEnd;
    });

    // Calculate totals
    const totalSalesToday = todaySales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0);
    const totalSalesWeek = weekSales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0);
    const totalSalesMonth = monthSales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0);
    const totalLastMonth = lastMonthSales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0);

    // Calculate growth rate
    const growthRate = totalLastMonth > 0 ? 
      ((totalSalesMonth - totalLastMonth) / totalLastMonth) * 100 : 0;

    // Calculate average ticket
    const averageTicket = allSales.length > 0 ? 
      allSales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0) / allSales.length : 0;

    // Payment methods distribution
    const paymentMethods = allSales.reduce((acc, sale) => {
      const method = sale.payment_method || 'Não informado';
      acc[method] = (acc[method] || 0) + (sale.final_amount || 0);
      return acc;
    }, {});

    setStats({
      totalSalesToday,
      totalSalesWeek,
      totalSalesMonth,
      totalTransactions: allSales.length,
      averageTicket,
      growthRate,
      paymentMethods
    });
  };

  const generateChartData = () => {
    // Sales trend over last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const salesByDay = last7Days.map(date => {
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const daySales = allSales.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate >= dayStart && saleDate < dayEnd;
      });
      
      return daySales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0);
    });

    // Payment methods for pie chart
    const paymentMethodsData = Object.entries(stats.paymentMethods || {});

    setChartData({
      salesTrend: {
        labels: last7Days.map(date => date.toLocaleDateString('pt-BR', { weekday: 'short' })),
        data: salesByDay
      },
      paymentMethods: {
        labels: paymentMethodsData.map(([method]) => method),
        data: paymentMethodsData.map(([, amount]) => amount)
      }
    });
  };

  const applyFilters = () => {
    let filtered = [...allSales];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.id.toString().includes(searchTerm) ||
        sale.customer_name?.toLowerCase().includes(searchTerm)
      );
    }

    // Customer filter
    if (filters.customer) {
      filtered = filtered.filter(sale => sale.customer_name === filters.customer);
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at);
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (start && saleDate < start) return false;
        if (end && saleDate > end) return false;
        return true;
      });
    }

    // Amount range filter
    if (filters.amountRange.min || filters.amountRange.max) {
      filtered = filtered.filter(sale => {
        const amount = sale.final_amount || 0;
        const min = parseFloat(filters.amountRange.min) || 0;
        const max = parseFloat(filters.amountRange.max) || Infinity;
        return amount >= min && amount <= max;
      });
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(sale => sale.status === filters.status);
    }

    // Payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(sale => sale.payment_method === filters.paymentMethod);
    }

    setSales(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFilterRangeChange = (filterType, rangeType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [rangeType]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      customer: '',
      dateRange: { start: '', end: '' },
      amountRange: { min: '', max: '' },
      status: '',
      paymentMethod: ''
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSalesData();
    setRefreshing(false);
    toast.success('Dados atualizados com sucesso!');
  };

  const handleAddSale = async (saleData) => {
    try {
      await makeAuthenticatedRequest('/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });
      
      setShowAddModal(false);
      await loadSalesData();
      toast.success('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast.error('Erro ao registrar venda: ' + error.message);
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
      await loadSalesData();
      toast.success('Venda atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      toast.error('Erro ao atualizar venda: ' + error.message);
      throw error;
    }
  };

  const handleDeleteSale = async (saleId, customerName) => {
    if (!window.confirm(`Tem certeza que deseja excluir a venda #${saleId} de ${customerName}?`)) return;

    try {
      await makeAuthenticatedRequest(`/api/sales/${saleId}`, {
        method: 'DELETE',
      });
      
      await loadSalesData();
      toast.success('Venda excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      toast.error('Erro ao excluir venda: ' + error.message);
    }
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetailsModal(true);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Concluída': return FiCheckCircle;
      case 'Pendente': return FiClock;
      case 'Cancelada': return FiXCircle;
      default: return FiAlertCircle;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Concluída': return 'status-completed';
      case 'Pendente': return 'status-pending';
      case 'Cancelada': return 'status-cancelled';
      default: return 'status-unknown';
    }
  };

  // Chart configurations
  const chartTheme = {
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    textColor: isDarkMode ? '#F1F5F9' : '#0F172A',
    gridColor: isDarkMode ? '#334155' : '#E2E8F0',
    primaryColor: colors?.primary || '#3B82F6',
    secondaryColor: colors?.secondary || '#8B5CF6'
  };

  const salesTrendData = {
    labels: chartData.salesTrend.labels,
    datasets: [
      {
        label: 'Vendas Diárias (R$)',
        data: chartData.salesTrend.data,
        backgroundColor: `${chartTheme.primaryColor}20`,
        borderColor: chartTheme.primaryColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const paymentMethodsData = {
    labels: chartData.paymentMethods.labels,
    datasets: [
      {
        data: chartData.paymentMethods.data,
        backgroundColor: [
          chartTheme.primaryColor,
          chartTheme.secondaryColor,
          '#10B981',
          '#F59E0B',
          '#EF4444',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: chartTheme.textColor,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: chartTheme.backgroundColor,
        titleColor: chartTheme.textColor,
        bodyColor: chartTheme.textColor,
        borderColor: chartTheme.gridColor,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: chartTheme.gridColor },
        ticks: { color: chartTheme.textColor },
      },
      y: {
        grid: { color: chartTheme.gridColor },
        ticks: { color: chartTheme.textColor },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartTheme.textColor,
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: chartTheme.backgroundColor,
        titleColor: chartTheme.textColor,
        bodyColor: chartTheme.textColor,
        borderColor: chartTheme.gridColor,
        borderWidth: 1,
      },
    },
  };

  const StatCard = ({ icon: Icon, title, value, change, trend, color }) => (
    <div className={`sales-stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {change !== undefined && (
          <span className={`stat-change ${trend}`}>
            {trend === 'up' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );

  const SaleCard = ({ sale }) => {
    const StatusIcon = getStatusIcon(sale.status);
    
    return (
      <div className="sale-card">
        <div className="sale-card-header">
          <div className="sale-id">#{sale.id}</div>
          <div className={`sale-status ${getStatusClass(sale.status)}`}>
            <StatusIcon size={14} />
            {sale.status}
          </div>
        </div>
        
        <div className="sale-card-body">
          <h4 className="customer-name">{sale.customer_name}</h4>
          <p className="sale-date">{formatDate(sale.created_at)}</p>
          <p className="sale-amount">{formatCurrency(sale.final_amount)}</p>
          <p className="sale-items">{sale.items} itens</p>
        </div>
        
        <div className="sale-card-actions">
          <button 
            className="btn-icon btn-view"
            onClick={() => handleViewDetails(sale)}
            title="Ver detalhes"
          >
            <FiEye size={16} />
          </button>
          <button 
            className="btn-icon btn-edit"
            onClick={() => handleEditSale(sale)}
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button 
            className="btn-icon btn-delete"
            onClick={() => handleDeleteSale(sale.id, sale.customer_name)}
            title="Excluir"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="sales-loading">
        <div className="spinner"></div>
        <p>Carregando vendas...</p>
      </div>
    );
  }

  return (
    <div className="sales-page">
      {/* Page Header */}
      <div className="sales-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Vendas</h1>
            <p>Gestão completa de vendas e faturamento</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter size={16} />
              Filtros
            </button>
            <button className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing}>
              <FiRefreshCw size={16} className={refreshing ? 'spinner' : ''} />
              Atualizar
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <FiPlus size={16} />
              Nova Venda
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <StatCard
            icon={FiDollarSign}
            title="Vendas Hoje"
            value={formatCurrency(stats.totalSalesToday)}
            color="blue"
          />
          <StatCard
            icon={FiCalendar}
            title="Vendas do Mês"
            value={formatCurrency(stats.totalSalesMonth)}
            change={stats.growthRate}
            trend={stats.growthRate >= 0 ? 'up' : 'down'}
            color="green"
          />
          <StatCard
            icon={FiShoppingCart}
            title="Transações"
            value={stats.totalTransactions.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={FiPercent}
            title="Ticket Médio"
            value={formatCurrency(stats.averageTicket)}
            color="orange"
          />
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Tendência de Vendas (7 dias)</h3>
            </div>
            <div className="chart-content">
              <Line data={salesTrendData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Métodos de Pagamento</h3>
            </div>
            <div className="chart-content">
              <Doughnut data={paymentMethodsData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filtros Avançados</h3>
            <button className="btn btn-sm btn-secondary" onClick={clearFilters}>
              Limpar Filtros
            </button>
          </div>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Buscar</label>
              <div className="search-input-group">
                <FiSearch size={16} />
                <input
                  type="text"
                  placeholder="ID da venda ou cliente..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Cliente</label>
              <select
                value={filters.customer}
                onChange={(e) => handleFilterChange('customer', e.target.value)}
              >
                <option value="">Todos os clientes</option>
                {[...new Set(allSales.map(sale => sale.customer_name).filter(Boolean))].map(customer => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Data Início</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleFilterRangeChange('dateRange', 'start', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Data Fim</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleFilterRangeChange('dateRange', 'end', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Valor Mínimo</label>
              <input
                type="number"
                placeholder="0,00"
                value={filters.amountRange.min}
                onChange={(e) => handleFilterRangeChange('amountRange', 'min', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Valor Máximo</label>
              <input
                type="number"
                placeholder="0,00"
                value={filters.amountRange.max}
                onChange={(e) => handleFilterRangeChange('amountRange', 'max', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="sales-content">
        {/* Toolbar */}
        <div className="content-toolbar">
          <div className="toolbar-left">
            <span className="results-count">
              {sales.length} de {allSales.length} vendas
            </span>
          </div>
          <div className="toolbar-right">
            <div className="view-toggle">
              <button 
                className={`btn-toggle ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                <FiList size={16} />
              </button>
              <button 
                className={`btn-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sales Display */}
        {sales.length === 0 ? (
          <div className="empty-state">
            <FiShoppingCart size={64} />
            <h3>Nenhuma venda encontrada</h3>
            <p>
              {Object.values(filters).some(v => v && v !== '' && (typeof v !== 'object' || Object.values(v).some(x => x)))
                ? 'Tente ajustar os filtros para encontrar vendas.'
                : 'Registre sua primeira venda para começar.'
              }
            </p>
            {!Object.values(filters).some(v => v && v !== '' && (typeof v !== 'object' || Object.values(v).some(x => x))) && (
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <FiPlus size={16} />
                Registrar Primeira Venda
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="sales-grid">
            {sales.map(sale => (
              <SaleCard key={sale.id} sale={sale} />
            ))}
          </div>
        ) : (
          <div className="sales-table-container">
            <table className="sales-table">
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
                {sales.map(sale => {
                  const StatusIcon = getStatusIcon(sale.status);
                  
                  return (
                    <tr key={sale.id}>
                      <td className="sale-id">#{sale.id}</td>
                      <td>{formatDate(sale.created_at)}</td>
                      <td className="customer-name">{sale.customer_name}</td>
                      <td>{sale.items} itens</td>
                      <td>{formatCurrency(sale.subtotal || 0)}</td>
                      <td>{formatCurrency(sale.discount || 0)}</td>
                      <td className="total-amount">{formatCurrency(sale.final_amount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(sale.status)}`}>
                          <StatusIcon size={14} />
                          {sale.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="btn-icon btn-view"
                          onClick={() => handleViewDetails(sale)}
                          title="Ver detalhes"
                        >
                          <FiEye size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEditSale(sale)}
                          title="Editar"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteSale(sale.id, sale.customer_name)}
                          title="Excluir"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <SaleModal
          title="Nova Venda"
          customers={customers}
          products={products}
          onSave={handleAddSale}
          onCancel={() => setShowAddModal(false)}
        />
      )}

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

      {/* Sale Details Modal */}
      {showDetailsModal && selectedSale && (
        <div className="modal-backdrop" onClick={() => setShowDetailsModal(false)}>
          <div className="sale-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes da Venda #{selectedSale.id}</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>
                <FiX size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="sale-details-grid">
                <div className="detail-section">
                  <h3><FiInfo size={16} /> Informações da Venda</h3>
                  <div className="detail-item">
                    <label>ID:</label>
                    <span>#{selectedSale.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Data:</label>
                    <span>{formatDate(selectedSale.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Cliente:</label>
                    <span>{selectedSale.customer_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={getStatusClass(selectedSale.status)}>
                      {selectedSale.status}
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3><FiDollarSign size={16} /> Valores</h3>
                  <div className="detail-item">
                    <label>Subtotal:</label>
                    <span>{formatCurrency(selectedSale.subtotal)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Desconto:</label>
                    <span>{formatCurrency(selectedSale.discount)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total:</label>
                    <span className="total-highlight">{formatCurrency(selectedSale.final_amount)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Método de Pagamento:</label>
                    <span>{selectedSale.payment_method || 'Não informado'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Fechar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditSale(selectedSale);
                }}
              >
                <FiEdit2 size={16} />
                Editar Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
