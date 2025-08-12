import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  ArrowUpRight,
  Info
} from 'lucide-react';
import './Dashboard.css';

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

function Dashboard() {
  const { isAuthenticated, token, makeAuthenticatedRequest } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalProducts: 0,
      monthlySales: 0,
      activeCustomers: 0,
      totalStockValue: 0
    },
    salesChart: {
      labels: [],
      data: []
    },
    categoryChart: {
      labels: [],
      data: []
    },
    recentSales: []
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Simulated data for demonstration
      const mockData = {
        metrics: {
          totalProducts: 127,
          monthlySales: 25890,
          activeCustomers: 342,
          totalStockValue: 186450
        },
        salesChart: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          data: [12500, 19000, 15000, 22000, 18500, 25000, 28000, 24000, 30000, 27000, 31000, 35000]
        },
        categoryChart: {
          labels: ['Eletrônicos', 'Roupas', 'Casa & Jardim', 'Esportes', 'Livros'],
          data: [35, 25, 20, 15, 5]
        },
        recentSales: [
          { id: 1, customer: 'João Silva', amount: 1250.00, date: '2024-01-15', items: 3 },
          { id: 2, customer: 'Maria Santos', amount: 850.50, date: '2024-01-15', items: 2 },
          { id: 3, customer: 'Pedro Costa', amount: 2100.00, date: '2024-01-14', items: 5 },
          { id: 4, customer: 'Ana Lima', amount: 675.75, date: '2024-01-14', items: 1 },
          { id: 5, customer: 'Carlos Oliveira', amount: 1450.25, date: '2024-01-13', items: 4 }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData(mockData);
      
    } catch (error) {
      console.error('Dashboard data error:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAuthenticated, token]);

  // Chart configurations with enhanced styling
  const chartTheme = {
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    textColor: isDarkMode ? '#F1F5F9' : '#1F2937',
    gridColor: isDarkMode ? '#334155' : '#F1F5F9',
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe']
  };

  const salesChartData = {
    labels: dashboardData.salesChart.labels,
    datasets: [
      {
        label: 'Vendas Mensais (R$)',
        data: dashboardData.salesChart.data,
        backgroundColor: (context) => {
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext('2d');
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
          gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
          return gradient;
        },
        borderColor: chartTheme.primaryColor,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartTheme.primaryColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const categoryChartData = {
    labels: dashboardData.categoryChart.labels,
    datasets: [
      {
        data: dashboardData.categoryChart.data,
        backgroundColor: chartTheme.accentColors,
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        labels: {
          color: chartTheme.textColor,
          font: {
            size: 13,
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: chartTheme.textColor,
        bodyColor: chartTheme.textColor,
        borderColor: chartTheme.primaryColor,
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: chartTheme.gridColor,
          drawBorder: false,
        },
        ticks: {
          color: chartTheme.textColor,
          font: {
            size: 12,
            weight: '500',
          },
          padding: 10,
        },
      },
      y: {
        grid: {
          color: chartTheme.gridColor,
          drawBorder: false,
        },
        ticks: {
          color: chartTheme.textColor,
          font: {
            size: 12,
            weight: '500',
          },
          padding: 10,
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: chartTheme.textColor,
          padding: 25,
          font: {
            size: 13,
            weight: '500',
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: chartTheme.textColor,
        bodyColor: chartTheme.textColor,
        borderColor: chartTheme.primaryColor,
        borderWidth: 2,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.parsed / total) * 100);
            return `${context.label}: ${percentage}%`;
          }
        }
      },
    },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  // Enhanced MetricCard with click functionality and tooltip
  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    change, 
    isPositive, 
    isCurrency = false,
    onClick,
    tooltip,
    variant = 'default'
  }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div 
        className={`metric-card ${variant} ${onClick ? 'clickable' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role={onClick ? 'button' : 'presentation'}
        tabIndex={onClick ? 0 : -1}
      >
        <div className="metric-icon">
          <Icon size={18} />
        </div>
        <div className="metric-content">
          <h3 className="metric-title">
            {title}
            {tooltip && (
              <Info size={14} className="metric-info-icon" />
            )}
          </h3>
          <p className="metric-value">
            {isCurrency ? formatCurrency(value) : value.toLocaleString('pt-BR')}
          </p>
          {change && (
            <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(change)}%</span>
              <span className="change-period">vs mês anterior</span>
            </div>
          )}
        </div>
        {onClick && (
          <div className="metric-action">
            <ArrowUpRight size={16} />
          </div>
        )}
        {showTooltip && tooltip && (
          <div className="metric-tooltip">
            {tooltip}
          </div>
        )}
      </div>
    );
  };

  // Navigation handlers for clickable cards
  const handleCardClick = (type) => {
    switch (type) {
      case 'products':
        navigate('/inventory');
        break;
      case 'sales':
        navigate('/sales');
        break;
      case 'customers':
        navigate('/customers');
        break;
      case 'stock':
        navigate('/inventory');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Enhanced Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Dashboard</h1>
          <p>Visão geral completa do seu negócio em tempo real</p>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn btn-secondary"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* Enhanced Metrics Cards */}
      <div className="metrics-grid">
        <MetricCard
          icon={Package}
          title="Total de Produtos"
          value={dashboardData.metrics.totalProducts}
          change={8.2}
          isPositive={true}
          variant="primary"
          onClick={() => handleCardClick('products')}
          tooltip="Número total de produtos cadastrados no sistema"
        />
        <MetricCard
          icon={ShoppingCart}
          title="Vendas do Mês"
          value={dashboardData.metrics.monthlySales}
          change={12.5}
          isPositive={true}
          isCurrency={true}
          variant="success"
          onClick={() => handleCardClick('sales')}
          tooltip="Receita total gerada nas vendas do mês atual"
        />
        <MetricCard
          icon={Users}
          title="Clientes Ativos"
          value={dashboardData.metrics.activeCustomers}
          change={-2.1}
          isPositive={false}
          variant="warning"
          onClick={() => handleCardClick('customers')}
          tooltip="Clientes que fizeram pelo menos uma compra nos últimos 30 dias"
        />
        <MetricCard
          icon={DollarSign}
          title="Valor em Estoque"
          value={dashboardData.metrics.totalStockValue}
          change={5.8}
          isPositive={true}
          isCurrency={true}
          variant="info"
          onClick={() => handleCardClick('stock')}
          tooltip="Valor total dos produtos disponíveis em estoque"
        />
      </div>

      {/* Enhanced Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-container chart-large">
          <div className="chart-header">
            <div className="chart-title-section">
              <h3>Evolução de Vendas</h3>
              <p>Acompanhe o crescimento das vendas ao longo do ano</p>
            </div>
            <div className="chart-actions">
              <button className="chart-action-btn" title="Expandir gráfico">
                <Eye size={16} />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container chart-compact">
          <div className="chart-header">
            <div className="chart-title-section">
              <h3>Vendas por Categoria</h3>
              <p>Distribuição percentual das vendas</p>
            </div>
            <div className="chart-actions">
              <button className="chart-action-btn" title="Detalhes da categoria">
                <Info size={16} />
              </button>
            </div>
          </div>
          <div className="chart-content">
            <Doughnut data={categoryChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Enhanced Recent Sales */}
      <div className="recent-sales">
        <div className="recent-sales-header">
          <div className="section-title">
            <h3>Vendas Recentes</h3>
            <p>Últimas transações realizadas</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/sales')}
          >
            <Eye size={14} />
            Ver Todas as Vendas
          </button>
        </div>
        <div className="recent-sales-table">
          <table className="enhanced-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Itens</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentSales.map(sale => (
                <tr key={sale.id} className="table-row-clickable">
                  <td className="sale-customer">
                    <div className="customer-info">
                      <span className="customer-name">{sale.customer}</span>
                    </div>
                  </td>
                  <td className="sale-amount">{formatCurrency(sale.amount)}</td>
                  <td className="sale-items">
                    <span className="items-count">{sale.items}</span>
                    <span className="items-label">{sale.items === 1 ? 'item' : 'itens'}</span>
                  </td>
                  <td className="sale-date">{formatDate(sale.date)}</td>
                  <td className="sale-actions">
                    <button className="action-btn" title="Ver detalhes">
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
