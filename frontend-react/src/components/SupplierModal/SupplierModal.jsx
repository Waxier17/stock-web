import { useState, useEffect } from 'react';
import {
  Truck,
  X,
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Loader
} from 'lucide-react';
import './SupplierModal.css';

function SupplierModal({ title, supplier, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    contact_person: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        cnpj: supplier.cnpj || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        contact_person: supplier.contact_person || '',
        notes: supplier.notes || ''
      });
    }
  }, [supplier]);

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
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro ao salvar fornecedor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!supplier;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="supplier-modal">
        <div className="modal-header-improved">
          <h2>
            <Truck size={24} />
            <span>{title}</span>
          </h2>
          <button className="btn-secondary-modern btn-sm" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body-improved">
          <form onSubmit={handleSubmit}>
            <div className="supplier-form">

              {/* Informações Básicas */}
              <div className="form-section">
                <div className="section-header">
                  <Building className="section-icon" size={20} />
                  <h3>Informações da Empresa</h3>
                </div>
                <div className="section-body">
                  <div className="field-group">
                    <div className="form-field">
                      <label>Nome da Empresa <span className="required">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: Distribuidora ABC Ltda"
                      />
                    </div>
                    <div className="form-field">
                      <label>CNPJ</label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        placeholder="00.000.000/0000-00"
                        maxLength="18"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="form-section">
                <div className="section-header">
                  <Mail className="section-icon" size={20} />
                  <h3>Informações de Contato</h3>
                </div>
                <div className="section-body">
                  <div className="field-group">
                    <div className="form-field">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contato@empresa.com"
                      />
                    </div>
                    <div className="form-field">
                      <label>Telefone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                  
                  <div className="field-group single">
                    <div className="form-field">
                      <label>Pessoa de Contato</label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleInputChange}
                        placeholder="Nome do responsável pelo contato"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="form-section">
                <div className="section-header">
                  <MapPin className="section-icon" size={20} />
                  <h3>Endereço</h3>
                </div>
                <div className="section-body">
                  <div className="field-group single">
                    <div className="form-field">
                      <label>Endereço Completo</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Rua, número, bairro, cidade, estado, CEP"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="form-section">
                <div className="section-header">
                  <FileText className="section-icon" size={20} />
                  <h3>Observações</h3>
                </div>
                <div className="section-body">
                  <div className="field-group single">
                    <div className="form-field">
                      <label>Notas Adicionais</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Informações adicionais sobre o fornecedor..."
                        rows="3"
                      />
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
                  {isEditing ? 'Atualizar Fornecedor' : 'Salvar Fornecedor'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierModal;
