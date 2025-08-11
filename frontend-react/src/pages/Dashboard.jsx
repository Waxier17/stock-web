import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
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
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiEye
} from 'react-icons/fi';
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
  // const toast = useToast();
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
      // In a real app, this would come from your API
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
      console.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAuthenticated, token]);

  // Chart configurations
  const chartTheme = {
    backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
    textColor: isDarkMode ? '#F1F5F9' : '#0F172A',
    gridColor: isDarkMode ? '#334155' : '#E2E8F0',
    primaryColor: colors?.primary || '#3B82F6',
    secondaryColor: colors?.secondary || '#8B5CF6'
  };

  const salesChartData = {
    labels: dashboardData.salesChart.labels,
    datasets: [
      {
        label: 'Vendas Mensais (R$)',
        data: dashboardData.salesChart.data,
        backgroundColor: `${chartTheme.primaryColor}20`,
        borderColor: chartTheme.primaryColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: dashboardData.categoryChart.labels,
    datasets: [
      {
        data: dashboardData.categoryChart.data,
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
          font: {
            size: 12,
          },
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
        grid: {
          color: chartTheme.gridColor,
        },
        ticks: {
          color: chartTheme.textColor,
        },
      },
      y: {
        grid: {
          color: chartTheme.gridColor,
        },
        ticks: {
          color: chartTheme.textColor,
        },
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
          font: {
            size: 12,
          },
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const MetricCard = ({ icon: Icon, title, value, change, isPositive, isCurrency = false }) => (
    <div className="metric-card">
      <div className="metric-icon">
        <Icon size={24} />
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">
          {isCurrency ? formatCurrency(value) : value.toLocaleString('pt-BR')}
        </p>
        {change && (
          <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Dashboard</h1>
          <p>Visão geral do seu negócio</p>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn btn-secondary"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <FiRefreshCw size={16} className={loading ? 'spinner' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <MetricCard
          icon={FiPackage}
          title="Total de Produtos"
          value={dashboardData.metrics.totalProducts}
          change={8.2}
          isPositive={true}
        />
        <MetricCard
          icon={FiShoppingCart}
          title="Vendas do Mês"
          value={dashboardData.metrics.monthlySales}
          change={12.5}
          isPositive={true}
          isCurrency={true}
        />
        <MetricCard
          icon={FiUsers}
          title="Clientes Ativos"
          value={dashboardData.metrics.activeCustomers}
          change={-2.1}
          isPositive={false}
        />
        <MetricCard
          icon={FiDollarSign}
          title="Valor em Estoque"
          value={dashboardData.metrics.totalStockValue}
          change={5.8}
          isPositive={true}
          isCurrency={true}
        />
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Vendas Mensais</h3>
            <p>Evolução das vendas ao longo do ano</p>
          </div>
          <div className="chart-content">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Vendas por Categoria</h3>
            <p>Distribuição das vendas por categoria</p>
          </div>
          <div className="chart-content">
            <Doughnut data={categoryChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="recent-sales">
        <div className="recent-sales-header">
          <h3>Vendas Recentes</h3>
          <button className="btn btn-secondary btn-sm">
            <FiEye size={14} />
            Ver Todas
          </button>
        </div>
        <div className="recent-sales-table">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Itens</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentSales.map(sale => (
                <tr key={sale.id}>
                  <td className="sale-customer">{sale.customer}</td>
                  <td className="sale-amount">{formatCurrency(sale.amount)}</td>
                  <td className="sale-items">{sale.items} {sale.items === 1 ? 'item' : 'itens'}</td>
                  <td className="sale-date">{formatDate(sale.date)}</td>
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
