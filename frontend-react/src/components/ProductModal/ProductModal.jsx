import { useState, useEffect } from 'react';
import {
  PackagePlus,
  Edit3,
  X,
  Save,
  Info,
  DollarSign,
  Package,
  Truck,
  Loader
} from 'lucide-react';
import './ProductModal.css';

function ProductModal({ title, categories, suppliers, product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    cost: '',
    stock_quantity: '',
    min_stock_level: '',
    supplier_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  // Preencher formulário quando produto for fornecido (modo edição)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category_id: product.category_id || '',
        price: product.price || '',
        cost: product.cost || '',
        stock_quantity: product.stock_quantity || product.stock || '',
        min_stock_level: product.min_stock_level || product.minStock || '',
        supplier_id: product.supplier_id || ''
      });
    }
  }, [product]);

  // Calcular progresso do formulário
  useEffect(() => {
    const requiredFields = ['name', 'category_id', 'price', 'stock_quantity'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim() !== '');
    const progress = (filledFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [formData]);

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
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_level: formData.min_stock_level ? parseInt(formData.min_stock_level) : 10,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null
      };

      await onSave(processedData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!product;
  const IconComponent = isEditing ? Edit3 : PackagePlus;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-improved">
        <div className="modal-header-improved">
          <h2>
            <IconComponent size={24} />
            <span>{title}</span>
          </h2>
          <button className="btn-secondary-modern btn-sm" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body-improved">
          <form onSubmit={handleSubmit}>
            <div className="form-sections">

              {/* Informações Básicas */}
              <div className="form-section">
                <div className="section-header">
                  <Info className="section-icon" size={20} />
                  <h3>Informações Básicas</h3>
                </div>
                <div className="section-body">
                  <div className="field-group">
                    <div className="form-field">
                      <label>Nome do Produto <span className="required">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Smartphone Samsung Galaxy"
                      />
                      <div className="help-text">
                        <Info size={12} />
                        Nome claro e descritivo do produto
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Categoria <span className="required">*</span></label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field-group single">
                    <div className="form-field">
                      <label>Descrição</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Descrição detalhada do produto, características, especificações..."
                      />
                      <div className="help-text">Informações adicionais que ajudem na identificação do produto</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preços e Custos */}
              <div className="form-section">
                <div className="section-header">
                  <DollarSign className="section-icon" size={20} />
                  <h3>Preços e Custos</h3>
                </div>
                <div className="section-body">
                  <div className="field-group">
                    <div className="form-field">
                      <label>Preço de Venda <span className="required">*</span></label>
                      <div className="input-with-icon">
                        <DollarSign className="input-icon" size={16} />
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          required
                          placeholder="0,00"
                        />
                      </div>
                      <div className="help-text">Preço praticado na venda aos clientes</div>
                    </div>
                    <div className="form-field">
                      <label>Custo de Aquisição</label>
                      <div className="input-with-icon">
                        <Package className="input-icon" size={16} />
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleInputChange}
                          step="0.01"
                          placeholder="0,00"
                        />
                      </div>
                      <div className="help-text">Quanto custou para adquirir o produto</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controle de Estoque */}
              <div className="form-section">
                <div className="section-header">
                  <Package className="section-icon" size={20} />
                  <h3>Controle de Estoque</h3>
                </div>
                <div className="section-body">
                  <div className="field-group">
                    <div className="form-field">
                      <label>Quantidade em Estoque <span className="required">*</span></label>
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        required
                        placeholder="0"
                        min="0"
                      />
                      <div className="help-text">Quantidade atual disponível</div>
                    </div>
                    <div className="form-field">
                      <label>Estoque Mínimo</label>
                      <input
                        type="number"
                        name="min_stock_level"
                        value={formData.min_stock_level}
                        onChange={handleInputChange}
                        placeholder="10"
                        min="0"
                      />
                      <div className="help-text">Quantidade mínima antes do alerta</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fornecedor */}
              <div className="form-section">
                <div className="section-header">
                  <Truck className="section-icon" size={20} />
                  <h3>Informações do Fornecedor</h3>
                </div>
                <div className="section-body">
                  <div className="field-group single">
                    <div className="form-field">
                      <label>Fornecedor</label>
                      <select
                        name="supplier_id"
                        value={formData.supplier_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecione um fornecedor</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      <div className="help-text">Empresa ou pessoa que fornece este produto</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>

        <div className="modal-footer-improved">
          <div className="form-progress">
            <span>Progresso do formulário</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
            </div>
          </div>
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
                  {isEditing ? 'Atualizar Produto' : 'Salvar Produto'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
