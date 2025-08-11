import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  X,
  Save,
  Users,
  Package,
  Plus,
  Minus,
  Trash2,
  Loader
} from 'lucide-react';
import './SaleModal.css';

function SaleModal({ title, customers, products, sale, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    items: [],
    subtotal: 0,
    discount: 0,
    final_amount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (sale) {
      setFormData({
        customer_id: sale.customer_id || '',
        customer_name: sale.customerName || sale.customer_name || '',
        items: sale.items || [],
        subtotal: sale.subtotal || 0,
        discount: sale.discount || 0,
        final_amount: sale.final_amount || sale.totalAmount || 0,
        notes: sale.notes || ''
      });
    }
  }, [sale]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addProduct = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    const existingItem = formData.items.find(item => item.product_id === product.id);
    
    if (existingItem) {
      // Update quantity if product already exists
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + selectedQuantity }
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
        total: product.price * selectedQuantity
      };

      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }

    setSelectedProduct('');
    setSelectedQuantity(1);
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
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
    const discount = parseFloat(formData.discount) || 0;
    const finalAmount = subtotal - discount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      final_amount: Math.max(0, finalAmount)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Adicione pelo menos um produto à venda');
      return;
    }

    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
      alert('Erro ao salvar venda: ' + error.message);
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

  const isEditing = !!sale;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="sale-modal">
        <div className="modal-header-improved">
          <h2>
            <ShoppingCart size={24} />
            <span>{title}</span>
          </h2>
          <button className="btn-secondary-modern btn-sm" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body-improved">
          <form onSubmit={handleSubmit}>
            <div className="sale-form">

              {/* Cliente */}
              <div className="form-section">
                <div className="section-header">
                  <Users className="section-icon" size={20} />
                  <h3>Cliente</h3>
                </div>
                <div className="section-body">
                  <div className="form-field">
                    <label>Cliente</label>
                    <select
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione um cliente</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div className="form-section">
                <div className="section-header">
                  <Package className="section-icon" size={20} />
                  <h3>Produtos</h3>
                </div>
                <div className="section-body">
                  {/* Add Product */}
                  <div className="add-product-container">
                    <div className="add-product-form">
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                      >
                        <option value="">Selecione um produto</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {formatCurrency(product.price)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                        placeholder="Qtd"
                      />
                      <button
                        type="button"
                        className="btn-primary-modern"
                        onClick={addProduct}
                        disabled={!selectedProduct}
                      >
                        <Plus size={16} />
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="items-list">
                    {formData.items.length === 0 ? (
                      <div className="empty-items">
                        <Package size={32} />
                        <p>Nenhum produto adicionado</p>
                      </div>
                    ) : (
                      <table className="items-table">
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map(item => (
                            <tr key={item.product_id}>
                              <td>{item.product_name}</td>
                              <td>{formatCurrency(item.price)}</td>
                              <td>
                                <div className="quantity-controls">
                                  <button
                                    type="button"
                                    onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </td>
                              <td>{formatCurrency(item.total)}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn-icon btn-delete"
                                  onClick={() => removeItem(item.product_id)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Totais */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">💰</span>
                  <h3>Totais</h3>
                </div>
                <div className="section-body">
                  <div className="totals-grid">
                    <div className="form-field">
                      <label>Desconto (R$)</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                      />
                    </div>
                    <div className="totals-summary">
                      <div className="total-line">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(formData.subtotal)}</span>
                      </div>
                      <div className="total-line">
                        <span>Desconto:</span>
                        <span>-{formatCurrency(formData.discount)}</span>
                      </div>
                      <div className="total-line final">
                        <span>Total Final:</span>
                        <span>{formatCurrency(formData.final_amount)}</span>
                      </div>
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
              disabled={loading || formData.items.length === 0}
            >
              {loading ? (
                <>
                  <Loader size={16} className="spinner" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEditing ? 'Atualizar Venda' : 'Finalizar Venda'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleModal;
