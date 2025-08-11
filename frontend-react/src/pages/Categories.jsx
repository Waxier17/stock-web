import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Folder,
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Package,
  Tag,
  FileText,
  Loader
} from 'lucide-react';
import CategoryModal from '../components/CategoryModal/CategoryModal';
import './Categories.css';

function Categories() {
  const { makeAuthenticatedRequest } = useAuth();
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, allCategories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest('/api/inventory/categories');
      setAllCategories(data);
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setAllCategories([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = allCategories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setCategories(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await makeAuthenticatedRequest('/api/inventory/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      
      setShowAddModal(false);
      await loadCategories();
      showSuccess('Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      await makeAuthenticatedRequest(`/api/inventory/categories/${editingCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      
      setShowEditModal(false);
      setEditingCategory(null);
      await loadCategories();
      showSuccess('Categoria atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await makeAuthenticatedRequest(`/api/inventory/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      await loadCategories();
      showSuccess('Categoria excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria: ' + error.message);
    }
  };

  const getCategoryIcon = (categoryName) => {
    // Mapear ícones baseado no nome da categoria
    const iconMap = {
      'eletrônicos': '📱',
      'roupas': '👕',
      'livros': '📚',
      'casa': '🏠',
      'esportes': '⚽',
      'ferramentas': '🔧',
      'alimentação': '🍕',
      'bebidas': '🥤',
      'higiene': '🧴',
      'beleza': '💄'
    };

    const normalizedName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (normalizedName.includes(key)) {
        return icon;
      }
    }
    return '📂'; // Ícone padrão
  };

  const showSuccess = (message) => {
    console.log(message);
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <Loader size={40} className="spinner" />
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="categories-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Gerenciamento de Categorias</h1>
        <p className="page-subtitle">Organize seus produtos por categorias</p>
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
                  placeholder="Pesquisar categorias por nome ou descrição..."
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
                  Nova Categoria
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <Folder size={48} />
            <h3>
              {searchTerm ? 
                'Nenhuma categoria encontrada' : 
                'Nenhuma categoria cadastrada'
              }
            </h3>
            <p>
              {searchTerm ? 
                'Tente ajustar os filtros de busca' : 
                'Comece organizando seus produtos em categorias'
              }
            </p>
            {!searchTerm && (
              <button 
                className="btn-primary-modern"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                Criar Primeira Categoria
              </button>
            )}
          </div>
        ) : (
          categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-header">
                <div className="category-icon">
                  <span className="category-emoji">{getCategoryIcon(category.name)}</span>
                </div>
                <div className="category-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleEditCategory(category)}
                    title="Editar categoria"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteCategory(category.id)}
                    title="Excluir categoria"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                
                <div className="category-stats">
                  <div className="stat-item">
                    <Package size={16} />
                    <span className="stat-number">{category.product_count || 0}</span>
                    <span className="stat-label">Produtos</span>
                  </div>
                </div>
                
                <div className="category-meta">
                  <span className="category-id">ID: #{category.id}</span>
                  {category.created_at && (
                    <span className="category-date">
                      Criada em {new Date(category.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {categories.length > 0 && (
        <div className="categories-summary">
          <div className="modern-card">
            <div className="card-body">
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{allCategories.length}</span>
                  <span className="stat-label">Total de Categorias</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{categories.length}</span>
                  <span className="stat-label">
                    {searchTerm ? 'Resultados da Busca' : 'Exibindo'}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-number">
                    {allCategories.reduce((sum, cat) => sum + (cat.product_count || 0), 0)}
                  </span>
                  <span className="stat-label">Total de Produtos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <CategoryModal
          title="Nova Categoria"
          onSave={handleAddCategory}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <CategoryModal
          title="Editar Categoria"
          category={editingCategory}
          onSave={handleUpdateCategory}
          onCancel={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

export default Categories;
