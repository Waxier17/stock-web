import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  Package,
  ShoppingCart,
  Users,
  Loader
} from 'lucide-react';
import './Reports.css';

function Reports() {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    salesByMonth: [],
    topProducts: [],
    categoriesStats: [],
    monthlyRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      
      // Simular dados de relatório (implementar APIs reais conforme necessário)
      const [sales, products, customers] = await Promise.all([
        makeAuthenticatedRequest('/api/sales'),
        makeAuthenticatedRequest('/api/inventory/products'),
        makeAuthenticatedRequest('/api/customers')
      ]);

      // Processar dados para relatórios
      const processedData = processReportData(sales, products, customers);
      setReportData(processedData);
    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (sales, products, customers) => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    // Filtrar vendas por período
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.created_at || sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    // Receita do período
    const monthlyRevenue = filteredSales.reduce((sum, sale) => 
      sum + (sale.final_amount || sale.totalAmount || 0), 0
    );

    // Vendas por mês (últimos 6 meses)
    const salesByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('pt-BR', { month: 'short' });
      
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.created_at || sale.date);
        return saleDate.getMonth() === date.getMonth() && 
               saleDate.getFullYear() === date.getFullYear();
      });
      
      const revenue = monthSales.reduce((sum, sale) => 
        sum + (sale.final_amount || sale.totalAmount || 0), 0
      );
      
      salesByMonth.push({ month: monthName, revenue, sales: monthSales.length });
    }

    // Top produtos (mock data - implementar com dados reais)
    const topProducts = products.slice(0, 5).map((product, index) => ({
      ...product,
      soldQuantity: Math.floor(Math.random() * 100) + 10,
      revenue: (product.price || 0) * (Math.floor(Math.random() * 100) + 10)
    }));

    // Estatísticas por categoria
    const categoriesStats = products.reduce((acc, product) => {
      const category = product.category_name || 'Sem categoria';
      if (!acc[category]) {
        acc[category] = { name: category, count: 0, value: 0 };
      }
      acc[category].count++;
      acc[category].value += product.price || 0;
      return acc;
    }, {});

    return {
      salesByMonth,
      topProducts,
      categoriesStats: Object.values(categoriesStats),
      monthlyRevenue,
      totalProducts: products.length,
      totalCustomers: customers.length,
      totalSales: filteredSales.length
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportReport = (type) => {
    console.log(`Exportando relatório: ${type}`);
    // Implementar exportação real aqui
    alert(`Funcionalidade de exportação ${type} será implementada`);
  };

  if (loading) {
    return (
      <div className="reports-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="reports-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Relatórios e Análises</h1>
        <p className="page-subtitle">Análise completa do seu negócio</p>
      </div>

      {/* Filtros */}
      <div className="modern-card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="date-filters">
                <div className="filter-group">
                  <label>Data Inicial</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="filter-group">
                  <label>Data Final</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="export-buttons">
                <button 
                  className="btn-secondary-modern"
                  onClick={() => exportReport('PDF')}
                >
                  <Download size={16} />
                  Exportar PDF
                </button>
                <button 
                  className="btn-secondary-modern"
                  onClick={() => exportReport('Excel')}
                >
                  <Download size={16} />
                  Exportar Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-number">{formatCurrency(reportData.monthlyRevenue)}</div>
            <div className="stat-label">Receita do Período</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingCart />
            </div>
            <div className="stat-number">{reportData.totalSales}</div>
            <div className="stat-label">Total de Vendas</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon">
              <Package />
            </div>
            <div className="stat-number">{reportData.totalProducts}</div>
            <div className="stat-label">Produtos Cadastrados</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon">
              <Users />
            </div>
            <div className="stat-number">{reportData.totalCustomers}</div>
            <div className="stat-label">Clientes Ativos</div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Gráfico de Vendas por Mês */}
        <div className="col-md-8">
          <div className="modern-card">
            <div className="card-header">
              <h2 className="card-title">
                <BarChart3 size={20} />
                Vendas por Mês
              </h2>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <div className="simple-chart">
                  {reportData.salesByMonth.map((item, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar" 
                        style={{ 
                          height: `${Math.max(20, (item.revenue / Math.max(...reportData.salesByMonth.map(i => i.revenue))) * 100)}%` 
                        }}
                      ></div>
                      <div className="bar-label">{item.month}</div>
                      <div className="bar-value">{formatCurrency(item.revenue)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Produtos */}
        <div className="col-md-4">
          <div className="modern-card">
            <div className="card-header">
              <h2 className="card-title">
                <Package size={20} />
                Top Produtos
              </h2>
            </div>
            <div className="card-body">
              <div className="top-products-list">
                {reportData.topProducts.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-stats">
                        <span>{product.soldQuantity} vendidos</span>
                        <span>{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="modern-card">
            <div className="card-header">
              <h2 className="card-title">
                <PieChart size={20} />
                Distribuição por Categorias
              </h2>
            </div>
            <div className="card-body">
              <div className="categories-chart">
                {reportData.categoriesStats.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{
                          width: `${(category.count / Math.max(...reportData.categoriesStats.map(c => c.count))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="category-info">
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count} produtos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
