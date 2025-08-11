import { useState, useEffect } from 'react';
import {
  Folder,
  X,
  Save,
  Tag,
  FileText,
  Loader
} from 'lucide-react';
import './CategoryModal.css';

function CategoryModal({ title, category, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!category;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="category-modal">
        <div className="modal-header-improved">
          <h2>
            <Folder size={24} />
            <span>{title}</span>
          </h2>
          <button className="btn-secondary-modern btn-sm" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body-improved">
          <form onSubmit={handleSubmit}>
            <div className="category-form">

              {/* Informações Básicas */}
              <div className="form-section">
                <div className="section-header">
                  <Tag className="section-icon" size={20} />
                  <h3>Informações da Categoria</h3>
                </div>
                <div className="section-body">
                  <div className="form-field">
                    <label>Nome da Categoria <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Eletrônicos, Roupas, Livros..."
                    />
                    <div className="help-text">
                      Nome claro e descritivo para a categoria
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="form-section">
                <div className="section-header">
                  <FileText className="section-icon" size={20} />
                  <h3>Descrição</h3>
                </div>
                <div className="section-body">
                  <div className="form-field">
                    <label>Descrição da Categoria</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Descreva que tipos de produtos pertencem a esta categoria..."
                      rows="4"
                    />
                    <div className="help-text">
                      Descrição opcional para ajudar na organização dos produtos
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>

        <div className="modal-footer-improved">
          <div className="btn-group">
            <button
              type="button"
              className="btn-secondary-modern"
              onClick={onCancel}
              disabled={loading}
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary-modern"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="spinner" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEditing ? 'Atualizar Categoria' : 'Salvar Categoria'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
