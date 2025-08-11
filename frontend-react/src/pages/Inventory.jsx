import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Package,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  PackagePlus,
  Info,
  DollarSign,
  Truck,
  X,
  Save,
  Loader,
  AlertCircle
} from 'lucide-react';
import ProductModal from '../components/ProductModal/ProductModal';
import './Inventory.css';

function Inventory() {
  const { makeAuthenticatedRequest } = useAuth();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Carregar dados do estoque
  useEffect(() => {
    loadInventoryData();
  }, []);

  // Filtrar produtos quando mudarem search/category
  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, allProducts]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadProducts(),
        loadCategories(),
        loadSuppliers()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const cacheBuster = Date.now();
      const data = await makeAuthenticatedRequest(`/api/inventory/products?_=${cacheBuster}`);
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setAllProducts([]);
      setProducts([]);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await makeAuthenticatedRequest('/api/inventory/categories');
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories([]);
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await makeAuthenticatedRequest('/api/suppliers');
      setSuppliers(data);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setSuppliers([]);
    }
  };

  const filterProducts = () => {
    let filtered = allProducts;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.supplier_name && product.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por categoria
    if (categoryFilter) {
      filtered = filtered.filter(product =>
        product.category_name === categoryFilter
      );
    }

    setProducts(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInventoryData();
    setRefreshing(false);
  };

  const handleAddProduct = async (productData) => {
    try {
      await makeAuthenticatedRequest('/api/inventory/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      setShowAddModal(false);
      await loadProducts();
      showSuccess('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
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
      await loadProducts();
      showSuccess('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await makeAuthenticatedRequest(`/api/inventory/products/${productId}`, {
        method: 'DELETE',
      });
      
      await loadProducts();
      showSuccess('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const getStockStatus = (product) => {
    const stock = product.stock_quantity || product.stock || 0;
    const minStock = product.min_stock_level || product.minStock || 10;
    const isLowStock = stock <= minStock;
    
    return {
      isLow: isLowStock,
      text: isLowStock ? 'Estoque Baixo' : 'Normal',
      className: isLowStock ? 'stock-status low' : 'stock-status normal'
    };
  };

  const showSuccess = (message) => {
    // Implementar notificação de sucesso aqui
    console.log(message);
  };

  if (loading) {
    return (
      <div className="inventory-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando estoque...</p>
      </div>
    );
  }

  return (
    <div className="inventory-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Estoque</h1>
        <p className="page-subtitle">Controle completo do seu inventário</p>
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
                  placeholder="Pesquisar produtos..."
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
                  Adicionar Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="modern-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Produtos</h2>
          <div className="table-controls">
            <span className="products-count">
              {products.length} produto{products.length !== 1 ? 's' : ''}
            </span>
            <select
              className="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Fornecedor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <Package size={32} />
                      <br /><br />
                      {searchTerm || categoryFilter ? 
                        'Nenhum produto encontrado com os filtros aplicados' : 
                        'Nenhum produto cadastrado'
                      }
                    </td>
                  </tr>
                ) : (
                  products.map(product => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id}>
                        <td>#{product.id}</td>
                        <td><strong>{product.name}</strong></td>
                        <td>{product.category_name || 'Sem categoria'}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock_quantity || product.stock || 0} un.</td>
                        <td>
                          <span className={stockStatus.className}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td>{product.supplier_name || 'Não informado'}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => handleEditProduct(product)}
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          title="Adicionar Novo Produto"
          categories={categories}
          suppliers={suppliers}
          onSave={handleAddProduct}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Product Modal */}
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
    </div>
  );
}

export default Inventory;
