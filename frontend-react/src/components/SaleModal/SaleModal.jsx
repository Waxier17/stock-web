import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import {
  FiShoppingCart,
  FiX,
  FiSave,
  FiUsers,
  FiPackage,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiPercent,
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiSearch,
  FiInfo,
  FiTrendingUp,
  FiEdit3,
  FiEye,
  FiCheckCircle
} from 'react-icons/fi';
import './SaleModal.css';

function SaleModal({ title, customers, products, sale, onSave, onCancel }) {
  const { isDarkMode } = useTheme();
  const toast = useToast();
  const customerSelectRef = useRef(null);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    items: [],
    subtotal: 0,
    discount: 0,
    discount_type: 'amount', // 'amount' or 'percentage'
    final_amount: 0,
    payment_method: '',
    notes: ''
  });

  const [validation, setValidation] = useState({
    customer_id: { isValid: false, message: '' },
    items: { isValid: false, message: '' },
    payment_method: { isValid: false, message: '' }
  });

  const [loading, setLoading] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Product selection state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const steps = [
    { id: 'customer', label: 'Cliente', icon: FiUsers },
    { id: 'products', label: 'Produtos', icon: FiPackage },
    { id: 'payment', label: 'Pagamento', icon: FiCreditCard },
    { id: 'summary', label: 'Resumo', icon: FiBarChart2 }
  ];

  const paymentMethods = [
    'Dinheiro',
    'Cartão de Crédito',
    'Cartão de Débito',
    'PIX',
    'Transferência Bancária',
    'Boleto',
    'Cheque'
  ];

  // Focus no primeiro input quando modal abre
  useEffect(() => {
    if (customerSelectRef.current) {
      setTimeout(() => customerSelectRef.current.focus(), 100);
    }
  }, []);

  // Preencher formulário quando venda for fornecida (modo edição)
  useEffect(() => {
    if (sale) {
      setFormData({
        customer_id: sale.customer_id || '',
        customer_name: sale.customerName || sale.customer_name || '',
        items: sale.items || [],
        subtotal: sale.subtotal || 0,
        discount: sale.discount || 0,
        discount_type: 'amount',
        final_amount: sale.final_amount || sale.totalAmount || 0,
        payment_method: sale.payment_method || '',
        notes: sale.notes || ''
      });
    }
  }, [sale]);

  // Filter products based on search
  useEffect(() => {
    if (productSearch) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [productSearch, products]);

  // Validação em tempo real
  useEffect(() => {
    validateField('customer_id', formData.customer_id);
    validateField('items', formData.items);
    validateField('payment_method', formData.payment_method);
  }, [formData]);

  // Calcular totais quando items ou desconto mudam
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discount, formData.discount_type]);

  // Calcular progresso do formulário
  useEffect(() => {
    const requiredFields = ['customer_id', 'items', 'payment_method'];
    const validFields = requiredFields.filter(field => validation[field]?.isValid);
    const progress = (validFields.length / requiredFields.length) * 100;
    setFormProgress(progress);
  }, [validation]);

  const validateField = (fieldName, value) => {
    let isValid = false;
    let message = '';

    switch (fieldName) {
      case 'customer_id':
        if (!value) {
          message = 'Cliente é obrigatório';
        } else {
          isValid = true;
        }
        break;

      case 'items':
        if (!Array.isArray(value) || value.length === 0) {
          message = 'Adicione pelo menos um produto';
        } else {
          isValid = true;
        }
        break;

      case 'payment_method':
        if (!value) {
          message = 'Método de pagamento é obrigatório';
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

    // Update customer name when customer_id changes
    if (name === 'customer_id') {
      const customer = customers.find(c => c.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        customer_name: customer ? customer.name : ''
      }));
    }
  };

  const addProduct = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    // Check stock availability
    const currentStock = product.stock_quantity || product.stock || 0;
    const existingItem = formData.items.find(item => item.product_id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (currentQuantityInCart + selectedQuantity > currentStock) {
      toast.warning(`Estoque insuficiente. Disponível: ${currentStock - currentQuantityInCart} unidades`);
      return;
    }

    if (existingItem) {
      // Update quantity if product already exists
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + selectedQuantity, total: (item.quantity + selectedQuantity) * item.price }
            : item
        )
      }));
    } else {
      // Add new item
      const newItem = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: selectedQuantity,
        total: product.price * selectedQuantity,
        available_stock: currentStock
      };

      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }

    setSelectedProduct('');
    setSelectedQuantity(1);
    setProductSearch('');
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const item = formData.items.find(i => i.product_id === productId);
    if (item && newQuantity > item.available_stock) {
      alert(`Estoque insuficiente. Máximo: ${item.available_stock} unidades`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    }));
  };

  const removeItem = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.product_id !== productId)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    let discountAmount = 0;

    if (formData.discount > 0) {
      if (formData.discount_type === 'percentage') {
        discountAmount = (subtotal * parseFloat(formData.discount)) / 100;
      } else {
        discountAmount = parseFloat(formData.discount);
      }
    }

    const finalAmount = Math.max(0, subtotal - discountAmount);

    setFormData(prev => ({
      ...prev,
      subtotal,
      final_amount: finalAmount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos os campos obrigatórios
    const requiredFields = ['customer_id', 'items', 'payment_method'];
    const allValid = requiredFields.every(field => validation[field]?.isValid);
    
    if (!allValid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const processedData = {
        ...formData,
        discount: parseFloat(formData.discount) || 0,
        customer_id: parseInt(formData.customer_id)
      };

      await onSave(processedData);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const calculateDiscountDisplay = () => {
    if (formData.discount_type === 'percentage') {
      return `${formData.discount}%`;
    }
    return formatCurrency(formData.discount);
  };

  const getStockStatus = (item) => {
    const ratio = item.quantity / item.available_stock;
    if (ratio >= 0.8) return { status: 'high', color: 'var(--color-warning)' };
    if (ratio >= 0.5) return { status: 'medium', color: 'var(--color-primary)' };
    return { status: 'low', color: 'var(--color-success)' };
  };

  const isEditing = !!sale;
  const IconComponent = isEditing ? FiEdit3 : FiShoppingCart;

  const FormField = ({ name, label, required = false, icon: Icon, help, children, ...props }) => {
    const fieldValidation = validation[name];
    const hasError = fieldValidation && !fieldValidation.isValid;
    const hasSuccess = fieldValidation && fieldValidation.isValid;

    return (
      <div className={`form-field ${hasError ? 'error' : ''} ${hasSuccess ? 'success' : ''}`}>
        <label>
          {Icon && <Icon size={14} />}
          {label}
          {required && <span className="required">*</span>}
        </label>
        {children}
        {hasError && <span className="field-message error">{fieldValidation.message}</span>}
        {help && !hasError && <span className="field-help">{help}</span>}
      </div>
    );
  };

  const StepContent = () => {
    switch (steps[currentStep].id) {
      case 'customer':
        return (
          <div className="step-content">
            <FormField
              name="customer_id"
              label="Cliente"
              required
              icon={FiUsers}
              help="Selecione o cliente para esta venda"
            >
              <select
                ref={customerSelectRef}
                name="customer_id"
                value={formData.customer_id}
                onChange={handleInputChange}
              >
                <option value="">Selecione um cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.email && `(${customer.email})`}
                  </option>
                ))}
              </select>
            </FormField>

            {formData.customer_id && (
              <div className="customer-preview">
                <h4><FiInfo size={16} /> Dados do Cliente</h4>
                {(() => {
                  const customer = customers.find(c => c.id === parseInt(formData.customer_id));
                  return customer ? (
                    <div className="customer-details">
                      <p><strong>Nome:</strong> {customer.name}</p>
                      {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
                      {customer.phone && <p><strong>Telefone:</strong> {customer.phone}</p>}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        );

      case 'products':
        return (
          <div className="step-content">
            <FormField
              name="items"
              label="Produtos da Venda"
              required
              icon={FiPackage}
              help="Adicione os produtos que serão vendidos"
            >
              <div className="product-selection">
                <div className="product-search">
                  <FiSearch size={16} />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <div className="add-product-form">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Selecione um produto</option>
                    {filteredProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)} 
                        (Estoque: {product.stock_quantity || product.stock || 0})
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    placeholder="Qtd"
                  />
                  
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addProduct}
                    disabled={!selectedProduct}
                  >
                    <FiPlus size={16} />
                    Adicionar
                  </button>
                </div>
              </div>
            </FormField>

            {/* Items List */}
            <div className="items-list">
              {formData.items.length === 0 ? (
                <div className="empty-items">
                  <FiPackage size={48} />
                  <p>Nenhum produto adicionado</p>
                  <span>Selecione produtos acima para adicionar à venda</span>
                </div>
              ) : (
                <div className="items-table-container">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Preço Unit.</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map(item => {
                        const stockStatus = getStockStatus(item);
                        return (
                          <tr key={item.product_id}>
                            <td>
                              <div className="product-info">
                                <span className="product-name">{item.product_name}</span>
                                <span className="stock-info" style={{ color: stockStatus.color }}>
                                  {item.quantity} de {item.available_stock} disponíveis
                                </span>
                              </div>
                            </td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>
                              <div className="quantity-controls">
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)}
                                >
                                  <FiMinus size={12} />
                                </button>
                                <span className="qty-display">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)}
                                >
                                  <FiPlus size={12} />
                                </button>
                              </div>
                            </td>
                            <td className="item-total">{formatCurrency(item.total)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn-icon btn-delete"
                                onClick={() => removeItem(item.product_id)}
                                title="Remover item"
                              >
                                <FiTrash2 size={14} />
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
          </div>
        );

      case 'payment':
        return (
          <div className="step-content">
            <FormField
              name="payment_method"
              label="Método de Pagamento"
              required
              icon={FiCreditCard}
              help="Selecione como o cliente irá pagar"
            >
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
              >
                <option value="">Selecione o método de pagamento</option>
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="discount-section">
              <h4><FiPercent size={16} /> Desconto</h4>
              <div className="discount-controls">
                <div className="discount-type">
                  <label>
                    <input
                      type="radio"
                      name="discount_type"
                      value="amount"
                      checked={formData.discount_type === 'amount'}
                      onChange={handleInputChange}
                    />
                    Valor (R$)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="discount_type"
                      value="percentage"
                      checked={formData.discount_type === 'percentage'}
                      onChange={handleInputChange}
                    />
                    Porcentagem (%)
                  </label>
                </div>

                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  step={formData.discount_type === 'amount' ? '0.01' : '1'}
                  min="0"
                  max={formData.discount_type === 'percentage' ? '100' : formData.subtotal}
                  placeholder={formData.discount_type === 'amount' ? '0,00' : '0'}
                />
              </div>
            </div>

            <FormField
              name="notes"
              label="Observações"
              icon={FiInfo}
              help="Informações adicionais sobre a venda"
            >
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Observações sobre a venda..."
                rows="3"
              />
            </FormField>
          </div>
        );

      case 'summary':
        return (
          <div className="step-content">
            <div className="sale-summary">
              <h4><FiBarChart2 size={16} /> Resumo da Venda</h4>
              
              <div className="summary-sections">
                <div className="summary-section">
                  <h5>Cliente</h5>
                  <p>{formData.customer_name || 'Cliente não selecionado'}</p>
                </div>

                <div className="summary-section">
                  <h5>Produtos ({formData.items.length})</h5>
                  <div className="products-summary">
                    {formData.items.map(item => (
                      <div key={item.product_id} className="product-summary-item">
                        <span>{item.product_name}</span>
                        <span>{item.quantity}x {formatCurrency(item.price)}</span>
                        <span>{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summary-section">
                  <h5>Pagamento</h5>
                  <p>{formData.payment_method || 'Método não selecionado'}</p>
                </div>

                <div className="summary-section totals-summary">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(formData.subtotal)}</span>
                  </div>
                  {formData.discount > 0 && (
                    <div className="total-line discount">
                      <span>Desconto ({calculateDiscountDisplay()}):</span>
                      <span>-{formatCurrency(formData.subtotal - formData.final_amount)}</span>
                    </div>
                  )}
                  <div className="total-line final">
                    <span>Total Final:</span>
                    <span>{formatCurrency(formData.final_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="sale-modal-enhanced">
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
                  disabled={currentStep === 0 && !validation.customer_id?.isValid}
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
                      {isEditing ? 'Atualizar Venda' : 'Finalizar Venda'}
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

export default SaleModal;
