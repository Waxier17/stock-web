import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Monitor, 
  Database, 
  Download,
  Upload,
  Save,
  RefreshCw
} from 'lucide-react';

function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      lowStock: true,
      sales: true
    },
    appearance: {
      theme: isDarkMode ? 'dark' : 'light',
      language: 'pt-BR',
      currency: 'BRL'
    },
    backup: {
      autoBackup: true,
      frequency: 'daily'
    }
  });

  const tabs = [
    { id: 'general', name: 'Geral', icon: SettingsIcon },
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'appearance', name: 'Aparência', icon: Monitor },
    { id: 'backup', name: 'Backup', icon: Database }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', settings);
    // Implementar lógica de salvamento
  };

  const handleExport = () => {
    console.log('Exportando dados...');
  };

  const handleImport = () => {
    console.log('Importando dados...');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <SettingsIcon size={24} />
            Configurações
          </h1>
          <p className="page-description">
            Ajustes gerais do sistema e preferências do usuário
          </p>
        </div>
        
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} />
            Exportar
          </button>
          <button className="btn btn-secondary" onClick={handleImport}>
            <Upload size={16} />
            Importar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Salvar
          </button>
        </div>
      </div>

      <div className="settings-layout">
        {/* Settings Tabs */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <IconComponent size={20} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Configurações Gerais</h2>
              
              <div className="settings-group">
                <h3 className="settings-group-title">Sistema</h3>
                <div className="settings-row">
                  <div className="settings-item">
                    <label className="settings-label">
                      Nome da Empresa
                      <input 
                        type="text" 
                        className="form-input"
                        defaultValue="Minha Empresa Ltda"
                      />
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-label">
                      CNPJ
                      <input 
                        type="text" 
                        className="form-input"
                        defaultValue="00.000.000/0001-00"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="settings-group-title">Estoque</h3>
                <div className="settings-row">
                  <div className="settings-item">
                    <label className="settings-label">
                      Alerta de Estoque Baixo
                      <input 
                        type="number" 
                        className="form-input"
                        defaultValue="10"
                        min="0"
                      />
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-label">
                      Unidade de Medida Padrão
                      <select className="form-input">
                        <option value="un">Unidade</option>
                        <option value="kg">Quilograma</option>
                        <option value="l">Litro</option>
                        <option value="m">Metro</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Aparência</h2>
              
              <div className="settings-group">
                <h3 className="settings-group-title">Tema</h3>
                <div className="settings-row">
                  <div className="settings-item">
                    <label className="settings-checkbox">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode}
                        onChange={toggleTheme}
                      />
                      <span>Modo Escuro</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="settings-group-title">Localização</h3>
                <div className="settings-row">
                  <div className="settings-item">
                    <label className="settings-label">
                      Idioma
                      <select 
                        className="form-input"
                        value={settings.appearance.language}
                        onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-label">
                      Moeda
                      <select 
                        className="form-input"
                        value={settings.appearance.currency}
                        onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
                      >
                        <option value="BRL">Real (R$)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Notificações</h2>
              
              <div className="settings-group">
                <h3 className="settings-group-title">Tipos de Notificação</h3>
                <div className="settings-column">
                  <div className="settings-item">
                    <label className="settings-checkbox">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                      />
                      <span>Notificações por Email</span>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-checkbox">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                      />
                      <span>Notificações Push</span>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-checkbox">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.lowStock}
                        onChange={(e) => handleSettingChange('notifications', 'lowStock', e.target.checked)}
                      />
                      <span>Alerta de Estoque Baixo</span>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-checkbox">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.sales}
                        onChange={(e) => handleSettingChange('notifications', 'sales', e.target.checked)}
                      />
                      <span>Notificações de Vendas</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="settings-section">
              <h2 className="settings-section-title">Backup e Dados</h2>
              
              <div className="settings-group">
                <h3 className="settings-group-title">Backup Automático</h3>
                <div className="settings-row">
                  <div className="settings-item">
                    <label className="settings-checkbox">
                      <input 
                        type="checkbox" 
                        checked={settings.backup.autoBackup}
                        onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                      />
                      <span>Ativar Backup Automático</span>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-label">
                      Frequência
                      <select 
                        className="form-input"
                        value={settings.backup.frequency}
                        onChange={(e) => handleSettingChange('backup', 'frequency', e.target.value)}
                        disabled={!settings.backup.autoBackup}
                      >
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="settings-group-title">Ações</h3>
                <div className="settings-actions">
                  <button className="btn btn-secondary">
                    <RefreshCw size={16} />
                    Criar Backup Agora
                  </button>
                  <button className="btn btn-secondary">
                    <Upload size={16} />
                    Restaurar Backup
                  </button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'profile' || activeTab === 'security') && (
            <div className="settings-section">
              <h2 className="settings-section-title">
                {activeTab === 'profile' ? 'Perfil do Usuário' : 'Segurança'}
              </h2>
              <div className="settings-placeholder">
                <p>Esta seção estará disponível em breve.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .page-container {
          padding: var(--space-6);
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-8);
          gap: var(--space-6);
        }

        .page-title-section {
          flex: 1;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-2) 0;
        }

        .page-description {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .page-actions {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-8);
          min-height: 600px;
        }

        .settings-sidebar {
          background: var(--color-background-secondary);
          border: 1px solid var(--color-secondary-200);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          height: fit-content;
          position: sticky;
          top: var(--space-6);
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .settings-nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border: none;
          background: none;
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: var(--transition-all);
          text-align: left;
          width: 100%;
        }

        .settings-nav-item:hover {
          background: var(--color-secondary-50);
          color: var(--color-text-primary);
        }

        .settings-nav-item.active {
          background: var(--color-primary-50);
          color: var(--color-primary-600);
          font-weight: var(--font-weight-semibold);
        }

        .settings-content {
          background: var(--color-background-secondary);
          border: 1px solid var(--color-secondary-200);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .settings-section {
          padding: var(--space-8);
        }

        .settings-section-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-6) 0;
        }

        .settings-group {
          margin-bottom: var(--space-8);
        }

        .settings-group:last-child {
          margin-bottom: 0;
        }

        .settings-group-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-4) 0;
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-secondary-200);
        }

        .settings-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }

        .settings-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .settings-item {
          display: flex;
          flex-direction: column;
        }

        .settings-label {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
        }

        .settings-checkbox {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          cursor: pointer;
        }

        .settings-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }

        .settings-actions {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        .settings-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: var(--space-4);
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .page-actions {
            justify-content: flex-start;
          }

          .settings-layout {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }

          .settings-sidebar {
            position: static;
          }

          .settings-nav {
            flex-direction: row;
            overflow-x: auto;
            gap: var(--space-2);
          }

          .settings-nav-item {
            white-space: nowrap;
            flex-shrink: 0;
          }

          .settings-section {
            padding: var(--space-6);
          }

          .settings-row {
            grid-template-columns: 1fr;
            gap: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;
