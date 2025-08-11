import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import {
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiUpload,
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
  FiDollarSign,
  FiBarChart2,
  FiShoppingCart,
  FiCalendar,
  FiTag,
  FiTruck,
  FiBox,
  FiInfo
} from 'react-icons/fi';
import ProductModal from '../components/ProductModal/ProductModal';
import './Inventory.css';

function Inventory() {
  const { makeAuthenticatedRequest } = useAuth();
  const { isDarkMode } = useTheme();
  const toast = useToast();
  
  // State management
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI state
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    stockStatus: '', // 'low', 'normal', 'out'
    priceRange: { min: '', max: '' },
    stockRange: { min: '', max: '' }
  });
  
  // Statistics
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    categoriesCount: 0
  });

  // Load initial data
  useEffect(() => {
    loadInventoryData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, allProducts]);

  // Calculate statistics when products change
  useEffect(() => {
    calculateStats();
  }, [allProducts]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        makeAuthenticatedRequest('/api/inventory/products'),
        makeAuthenticatedRequest('/api/categories'),
        makeAuthenticatedRequest('/api/suppliers')
      ]);
      
      setAllProducts(productsData || []);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setSuppliers(suppliersData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados do estoque:', error);
      toast.error('Erro ao carregar dados do estoque');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalProducts = allProducts.length;
    const totalValue = allProducts.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const stock = parseInt(product.stock_quantity || product.stock) || 0;
      return sum + (price * stock);
    }, 0);
    
    const lowStockItems = allProducts.filter(product => {
      const stock = parseInt(product.stock_quantity || product.stock) || 0;
      const minStock = parseInt(product.min_stock_level || product.minStock) || 10;
      return stock <= minStock && stock > 0;
    }).length;
    
    const outOfStockItems = allProducts.filter(product => {
      const stock = parseInt(product.stock_quantity || product.stock) || 0;
      return stock === 0;
    }).length;
    
    const categoriesCount = new Set(allProducts.map(p => p.category_id).filter(Boolean)).size;
    
    setStats({
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categoriesCount
    });
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category_name?.toLowerCase().includes(searchTerm) ||
        product.supplier_name?.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category_id === parseInt(filters.category));
    }

    // Supplier filter
    if (filters.supplier) {
      filtered = filtered.filter(product => product.supplier_id === parseInt(filters.supplier));
    }

    // Stock status filter
    if (filters.stockStatus) {
      filtered = filtered.filter(product => {
        const stock = parseInt(product.stock_quantity || product.stock) || 0;
        const minStock = parseInt(product.min_stock_level || product.minStock) || 10;
        
        switch (filters.stockStatus) {
          case 'low': return stock <= minStock && stock > 0;
          case 'out': return stock === 0;
          case 'normal': return stock > minStock;
          default: return true;
        }
      });
    }

    // Price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price) || 0;
        const min = parseFloat(filters.priceRange.min) || 0;
        const max = parseFloat(filters.priceRange.max) || Infinity;
        return price >= min && price <= max;
      });
    }

    // Stock range filter
    if (filters.stockRange.min || filters.stockRange.max) {
      filtered = filtered.filter(product => {
        const stock = parseInt(product.stock_quantity || product.stock) || 0;
        const min = parseInt(filters.stockRange.min) || 0;
        const max = parseInt(filters.stockRange.max) || Infinity;
        return stock >= min && stock <= max;
      });
    }

    setProducts(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInventoryData();
    setRefreshing(false);
    toast.success('Dados atualizados com sucesso!');
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
      category: '',
      supplier: '',
      stockStatus: '',
      priceRange: { min: '', max: '' },
      stockRange: { min: '', max: '' }
    });
  };

  const handleAddProduct = async (productData) => {
    try {
      await makeAuthenticatedRequest('/api/inventory/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      setShowAddModal(false);
      await loadInventoryData();
      toast.success('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao adicionar produto: ' + error.message);
      throw error;
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await makeAuthenticatedRequest(`/api/inventory/products/${editingProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      
      setShowEditModal(false);
      setEditingProduct(null);
      await loadInventoryData();
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto: ' + error.message);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${productName}"?`)) return;

    try {
      await makeAuthenticatedRequest(`/api/inventory/products/${productId}`, {
        method: 'DELETE',
      });
      
      await loadInventoryData();
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const getStockStatus = (product) => {
    const stock = parseInt(product.stock_quantity || product.stock) || 0;
    const minStock = parseInt(product.min_stock_level || product.minStock) || 10;
    
    if (stock === 0) {
      return { status: 'out', label: 'Sem estoque', className: 'stock-status-out', icon: FiAlertTriangle };
    } else if (stock <= minStock) {
      return { status: 'low', label: 'Estoque baixo', className: 'stock-status-low', icon: FiTrendingDown };
    } else {
      return { status: 'normal', label: 'Normal', className: 'stock-status-normal', icon: FiTrendingUp };
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, trend, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {change && (
          <span className={`stat-change ${trend}`}>
            {trend === 'up' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            {change}
          </span>
        )}
      </div>
    </div>
  );

  const ProductCard = ({ product }) => {
    const stockStatus = getStockStatus(product);
    const StatusIcon = stockStatus.icon;
    
    return (
      <div className="product-card">
        <div className="product-card-header">
          <div className="product-image">
            <FiPackage size={32} />
          </div>
          <div className={`stock-badge ${stockStatus.className}`}>
            <StatusIcon size={14} />
            {parseInt(product.stock_quantity || product.stock) || 0}
          </div>
        </div>
        
        <div className="product-card-body">
          <h4 className="product-name">{product.name}</h4>
          <p className="product-category">{product.category_name || 'Sem categoria'}</p>
          <p className="product-price">{formatCurrency(product.price)}</p>
          <p className="product-supplier">{product.supplier_name || 'Sem fornecedor'}</p>
        </div>
        
        <div className="product-card-actions">
          <button 
            className="btn-icon btn-view"
            onClick={() => handleViewDetails(product)}
            title="Ver detalhes"
          >
            <FiEye size={16} />
          </button>
          <button 
            className="btn-icon btn-edit"
            onClick={() => handleEditProduct(product)}
            title="Editar"
          >
            <FiEdit2 size={16} />
          </button>
          <button 
            className="btn-icon btn-delete"
            onClick={() => handleDeleteProduct(product.id, product.name)}
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
      <div className="inventory-loading">
        <div className="spinner"></div>
        <p>Carregando inventário...</p>
      </div>
    );
  }

  return (
    <div className="inventory-page">
      {/* Page Header */}
      <div className="inventory-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Inventário</h1>
            <p>Gestão completa do seu estoque</p>
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
              Novo Produto
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <StatCard
            icon={FiPackage}
            title="Total de Produtos"
            value={stats.totalProducts.toLocaleString()}
            color="blue"
          />
          <StatCard
            icon={FiDollarSign}
            title="Valor do Estoque"
            value={formatCurrency(stats.totalValue)}
            color="green"
          />
          <StatCard
            icon={FiAlertTriangle}
            title="Estoque Baixo"
            value={stats.lowStockItems.toLocaleString()}
            color="orange"
          />
          <StatCard
            icon={FiBox}
            title="Sem Estoque"
            value={stats.outOfStockItems.toLocaleString()}
            color="red"
          />
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
                  placeholder="Nome, descrição, categoria..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Categoria</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Fornecedor</label>
              <select
                value={filters.supplier}
                onChange={(e) => handleFilterChange('supplier', e.target.value)}
              >
                <option value="">Todos os fornecedores</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status do Estoque</label>
              <select
                value={filters.stockStatus}
                onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="normal">Normal</option>
                <option value="low">Estoque baixo</option>
                <option value="out">Sem estoque</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Faixa de Preço</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterRangeChange('priceRange', 'min', e.target.value)}
                />
                <span>até</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterRangeChange('priceRange', 'max', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Quantidade em Estoque</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Mín"
                  value={filters.stockRange.min}
                  onChange={(e) => handleFilterRangeChange('stockRange', 'min', e.target.value)}
                />
                <span>até</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={filters.stockRange.max}
                  onChange={(e) => handleFilterRangeChange('stockRange', 'max', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="inventory-content">
        {/* Toolbar */}
        <div className="content-toolbar">
          <div className="toolbar-left">
            <span className="results-count">
              {products.length} de {allProducts.length} produtos
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

        {/* Products Display */}
        {products.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={64} />
            <h3>Nenhum produto encontrado</h3>
            <p>
              {Object.values(filters).some(v => v && v !== '' && (typeof v !== 'object' || Object.values(v).some(x => x)))
                ? 'Tente ajustar os filtros para encontrar produtos.'
                : 'Comece adicionando seu primeiro produto.'
              }
            </p>
            {!Object.values(filters).some(v => v && v !== '' && (typeof v !== 'object' || Object.values(v).some(x => x))) && (
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <FiPlus size={16} />
                Adicionar Primeiro Produto
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Fornecedor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const stockStatus = getStockStatus(product);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <tr key={product.id}>
                      <td className="product-info">
                        <div className="product-name">{product.name}</div>
                        {product.description && (
                          <div className="product-description">{product.description}</div>
                        )}
                      </td>
                      <td>{product.category_name || 'Sem categoria'}</td>
                      <td className="price">{formatCurrency(product.price)}</td>
                      <td>{parseInt(product.stock_quantity || product.stock) || 0}</td>
                      <td>
                        <span className={`status-badge ${stockStatus.className}`}>
                          <StatusIcon size={14} />
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>{product.supplier_name || 'Sem fornecedor'}</td>
                      <td className="actions">
                        <button 
                          className="btn-icon btn-view"
                          onClick={() => handleViewDetails(product)}
                          title="Ver detalhes"
                        >
                          <FiEye size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEditProduct(product)}
                          title="Editar"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
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
        <ProductModal
          title="Adicionar Novo Produto"
          categories={categories}
          suppliers={suppliers}
          onSave={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && editingProduct && (
        <ProductModal
          title="Editar Produto"
          categories={categories}
          suppliers={suppliers}
          product={editingProduct}
          onSave={handleUpdateProduct}
          onCancel={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="modal-backdrop" onClick={() => setShowDetailsModal(false)}>
          <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Produto</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>
                <FiX size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="product-details-grid">
                <div className="detail-section">
                  <h3><FiInfo size={16} /> Informações Gerais</h3>
                  <div className="detail-item">
                    <label>Nome:</label>
                    <span>{selectedProduct.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Descrição:</label>
                    <span>{selectedProduct.description || 'Não informado'}</span>
                  </div>
                  <div className="detail-item">
                    <label>ID:</label>
                    <span>#{selectedProduct.id}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3><FiTag size={16} /> Categoria e Fornecedor</h3>
                  <div className="detail-item">
                    <label>Categoria:</label>
                    <span>{selectedProduct.category_name || 'Sem categoria'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Fornecedor:</label>
                    <span>{selectedProduct.supplier_name || 'Sem fornecedor'}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3><FiDollarSign size={16} /> Valores</h3>
                  <div className="detail-item">
                    <label>Preço de Venda:</label>
                    <span>{formatCurrency(selectedProduct.price)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Custo:</label>
                    <span>{selectedProduct.cost ? formatCurrency(selectedProduct.cost) : 'Não informado'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Margem:</label>
                    <span>
                      {selectedProduct.cost ? 
                        `${(((selectedProduct.price - selectedProduct.cost) / selectedProduct.cost) * 100).toFixed(1)}%` : 
                        'N/A'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3><FiBox size={16} /> Estoque</h3>
                  <div className="detail-item">
                    <label>Quantidade:</label>
                    <span>{parseInt(selectedProduct.stock_quantity || selectedProduct.stock) || 0} unidades</span>
                  </div>
                  <div className="detail-item">
                    <label>Estoque Mínimo:</label>
                    <span>{parseInt(selectedProduct.min_stock_level || selectedProduct.minStock) || 10} unidades</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={getStockStatus(selectedProduct).className}>
                      {getStockStatus(selectedProduct).label}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Valor Total:</label>
                    <span>
                      {formatCurrency((selectedProduct.price * (parseInt(selectedProduct.stock_quantity || selectedProduct.stock) || 0)))}
                    </span>
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
                  handleEditProduct(selectedProduct);
                }}
              >
                <FiEdit2 size={16} />
                Editar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
