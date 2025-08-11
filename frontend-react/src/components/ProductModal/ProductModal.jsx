import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FiPackage,
  FiEdit3,
  FiX,
  FiSave,
  FiInfo,
  FiDollarSign,
  FiBox,
  FiTruck,
  FiCheck,
  FiAlertCircle,
  FiPercent,
  FiBarChart2,
  FiCalendar,
  FiImage,
  FiCamera,
  FiUpload
} from 'react-icons/fi';
import './ProductModal.css';

function ProductModal({ title, categories, suppliers, product, onSave, onCancel }) {
  const { isDarkMode } = useTheme();
  const nameInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    cost: '',
    stock_quantity: '',
    min_stock_level: '10',
    supplier_id: '',
    sku: '',
    barcode: '',
    unit: 'un',
    weight: '',
    dimensions: ''
  });

  const [validation, setValidation] = useState({
    name: { isValid: false, message: '' },
    price: { isValid: false, message: '' },
    stock_quantity: { isValid: false, message: '' },
    category_id: { isValid: false, message: '' }
  });

  const [loading, setLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const steps = [
    { id: 'basic', label: 'Informações Básicas', icon: FiInfo },
    { id: 'pricing', label: 'Preços e Custos', icon: FiDollarSign },
    { id: 'stock', label: 'Controle de Estoque', icon: FiBox },
    { id: 'supplier', label: 'Fornecedor', icon: FiTruck }
  ];

  // Focus no primeiro input quando modal abre
  useEffect(() => {
    if (nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 100);
    }
  }, []);

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
        min_stock_level: product.min_stock_level || product.minStock || '10',
        supplier_id: product.supplier_id || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        unit: product.unit || 'un',
        weight: product.weight || '',
        dimensions: product.dimensions || ''
      });
    }
  }, [product]);

  // Validação em tempo real
  useEffect(() => {
    validateField('name', formData.name);
    validateField('price', formData.price);
    validateField('stock_quantity', formData.stock_quantity);
    validateField('category_id', formData.category_id);
  }, [formData]);

  // Calcular progresso do formulário
  useEffect(() => {
    const requiredFields = ['name', 'category_id', 'price', 'stock_quantity'];
    const validFields = requiredFields.filter(field => validation[field]?.isValid);
    const progress = (validFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [validation]);

  const validateField = (fieldName, value) => {
    let isValid = false;
    let message = '';

    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length < 2) {
          message = 'Nome deve ter pelo menos 2 caracteres';
        } else if (value.trim().length > 100) {
          message = 'Nome muito longo (máximo 100 caracteres)';
        } else {
          isValid = true;
        }
        break;

      case 'price':
        const price = parseFloat(value);
        if (!value || isNaN(price)) {
          message = 'Preço é obrigatório';
        } else if (price <= 0) {
          message = 'Preço deve ser maior que zero';
        } else if (price > 999999.99) {
          message = 'Preço muito alto';
        } else {
          isValid = true;
        }
        break;

      case 'stock_quantity':
        const stock = parseInt(value);
        if (value === '' || isNaN(stock)) {
          message = 'Quantidade é obrigatória';
        } else if (stock < 0) {
          message = 'Quantidade não pode ser negativa';
        } else if (stock > 999999) {
          message = 'Quantidade muito alta';
        } else {
          isValid = true;
        }
        break;

      case 'category_id':
        if (!value) {
          message = 'Categoria é obrigatória';
        } else {
          isValid = true;
        }
        break;

      default:
        isValid = true;
    }

    setValidation(prev => ({
      ...prev,
      [fieldName]: { isValid, message }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos os campos obrigatórios
    const requiredFields = ['name', 'category_id', 'price', 'stock_quantity'];
    const allValid = requiredFields.every(field => validation[field]?.isValid);
    
    if (!allValid) {
      alert('Por favor, corrija os erros no formulário antes de continuar.');
      return;
    }

    setLoading(true);

    try {
      const processedData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_level: formData.min_stock_level ? parseInt(formData.min_stock_level) : 10,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        weight: formData.weight ? parseFloat(formData.weight) : null
      };

      await onSave(processedData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (cost > 0) {
      return (((price - cost) / cost) * 100).toFixed(1);
    }
    return 0;
  };

  const calculateStockValue = () => {
    const price = parseFloat(formData.price) || 0;
    const stock = parseInt(formData.stock_quantity) || 0;
    return price * stock;
  };

  const isEditing = !!product;
  const IconComponent = isEditing ? FiEdit3 : FiPackage;

  const FormField = ({ name, label, type = 'text', required = false, icon: Icon, help, children, ...props }) => {
    const fieldValidation = validation[name];
    const hasError = fieldValidation && !fieldValidation.isValid && formData[name];
    const hasSuccess = fieldValidation && fieldValidation.isValid && formData[name];

    return (
      <div className={`form-field ${hasError ? 'error' : ''} ${hasSuccess ? 'success' : ''}`}>
        <label>
          {Icon && <Icon size={14} />}
          {label}
          {required && <span className="required">*</span>}
        </label>
        {children || (
          <div className="input-wrapper">
            <input
              ref={name === 'name' ? nameInputRef : undefined}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              {...props}
            />
            {hasError && <FiAlertCircle className="field-icon error" size={16} />}
            {hasSuccess && <FiCheck className="field-icon success" size={16} />}
          </div>
        )}
        {hasError && <span className="field-message error">{fieldValidation.message}</span>}
        {help && !hasError && <span className="field-help">{help}</span>}
      </div>
    );
  };

  const StepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <div className="step-content">
            <FormField
              name="name"
              label="Nome do Produto"
              required
              icon={FiPackage}
              placeholder="Ex: Smartphone Samsung Galaxy S21"
              help="Nome claro e descritivo do produto"
              maxLength="100"
            />
            
            <FormField
              name="category_id"
              label="Categoria"
              required
              icon={FiBarChart2}
              help="Selecione a categoria que melhor descreve o produto"
            >
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              name="description"
              label="Descrição"
              icon={FiInfo}
              help="Informações adicionais sobre o produto"
            >
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descrição detalhada do produto, características, especificações..."
                rows="3"
              />
            </FormField>

            {showAdvanced && (
              <>
                <div className="field-row">
                  <FormField
                    name="sku"
                    label="SKU"
                    placeholder="COD123"
                    help="Código interno do produto"
                  />
                  <FormField
                    name="barcode"
                    label="Código de Barras"
                    placeholder="1234567890123"
                    help="EAN ou UPC do produto"
                  />
                </div>
                
                <div className="field-row">
                  <FormField
                    name="unit"
                    label="Unidade"
                    help="Unidade de medida"
                  >
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                    >
                      <option value="un">Unidade</option>
                      <option value="kg">Quilograma</option>
                      <option value="g">Grama</option>
                      <option value="l">Litro</option>
                      <option value="ml">Mililitro</option>
                      <option value="m">Metro</option>
                      <option value="cm">Centímetro</option>
                      <option value="caixa">Caixa</option>
                      <option value="pacote">Pacote</option>
                    </select>
                  </FormField>
                  <FormField
                    name="weight"
                    label="Peso (kg)"
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    help="Peso do produto em quilogramas"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'pricing':
        return (
          <div className="step-content">
            <FormField
              name="price"
              label="Preço de Venda"
              type="number"
              step="0.01"
              required
              icon={FiDollarSign}
              placeholder="0,00"
              help="Preço praticado na venda aos clientes"
            />

            <FormField
              name="cost"
              label="Custo de Aquisição"
              type="number"
              step="0.01"
              icon={FiBox}
              placeholder="0,00"
              help="Quanto custou para adquirir o produto"
            />

            {formData.price && formData.cost && (
              <div className="pricing-analysis">
                <h4><FiPercent size={16} /> Análise de Preços</h4>
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <label>Margem de Lucro</label>
                    <span className="value success">{calculateMargin()}%</span>
                  </div>
                  <div className="analysis-item">
                    <label>Lucro por Unidade</label>
                    <span className="value">
                      R$ {(parseFloat(formData.price) - parseFloat(formData.cost) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'stock':
        return (
          <div className="step-content">
            <div className="field-row">
              <FormField
                name="stock_quantity"
                label="Quantidade em Estoque"
                type="number"
                required
                icon={FiBox}
                placeholder="0"
                min="0"
                help="Quantidade atual disponível"
              />
              <FormField
                name="min_stock_level"
                label="Estoque Mínimo"
                type="number"
                icon={FiAlertCircle}
                placeholder="10"
                min="0"
                help="Quantidade mínima antes do alerta"
              />
            </div>

            {formData.stock_quantity && formData.price && (
              <div className="stock-analysis">
                <h4><FiBarChart2 size={16} /> Análise de Estoque</h4>
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <label>Valor Total do Estoque</label>
                    <span className="value primary">
                      R$ {calculateStockValue().toFixed(2)}
                    </span>
                  </div>
                  <div className="analysis-item">
                    <label>Status do Estoque</label>
                    <span className={`status ${parseInt(formData.stock_quantity) <= parseInt(formData.min_stock_level) ? 'warning' : 'success'}`}>
                      {parseInt(formData.stock_quantity) <= parseInt(formData.min_stock_level) ? 'Baixo' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'supplier':
        return (
          <div className="step-content">
            <FormField
              name="supplier_id"
              label="Fornecedor"
              icon={FiTruck}
              help="Empresa ou pessoa que fornece este produto"
            >
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
            </FormField>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="product-modal-enhanced">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-title">
              <IconComponent size={24} />
              <div>
                <h2>{title}</h2>
                <p>Passo {currentStep + 1} de {steps.length}</p>
              </div>
            </div>
            <button className="btn-close" onClick={onCancel}>
              <FiX size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(formProgress)}% completo</span>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="steps-nav">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <button
                key={step.id}
                className={`step-button ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="step-icon">
                  <StepIcon size={16} />
                </div>
                <span className="step-label">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <StepContent />
            
            {currentStep === 0 && (
              <div className="advanced-toggle">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? 'Ocultar' : 'Mostrar'} campos avançados
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-content">
            <div className="footer-left">
              {currentStep > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Anterior
                </button>
              )}
            </div>
            
            <div className="footer-right">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validation[['name', 'category_id', 'price', 'stock_quantity'][currentStep]]?.isValid}
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading || formProgress < 100}
                >
                  {loading ? (
                    <>
                      <div className="spinner small"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      {isEditing ? 'Atualizar Produto' : 'Salvar Produto'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
