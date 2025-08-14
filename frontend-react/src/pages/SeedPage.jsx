import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Database, Trash2, Download, AlertTriangle, CheckCircle } from 'lucide-react';

function SeedPage() {
  const { makeAuthenticatedRequest } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleSeedData = async () => {
    try {
      setLoading(true);
      toast.info('Populando banco de dados com dados de teste...');
      
      const response = await makeAuthenticatedRequest('/api/seed/seed-database', {
        method: 'POST'
      });
      
      if (response.success) {
        toast.success('Dados de teste adicionados com sucesso!');
        setStats(response.data);
      } else {
        toast.error('Erro ao popular dados: ' + (response.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Seed error:', error);
      toast.error('Erro ao popular dados de teste');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setLoading(true);
      toast.info('Limpando banco de dados...');
      
      // Note: You would need to create this endpoint in the backend
      const response = await makeAuthenticatedRequest('/api/cleanup/clear-all', {
        method: 'POST'
      });
      
      if (response.success) {
        toast.success('Banco de dados limpo com sucesso!');
        setStats(null);
      } else {
        toast.error('Erro ao limpar dados: ' + (response.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Erro ao limpar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seed-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <Database size={24} />
            Gerenciar Dados de Teste
          </h1>
          <p className="page-description">
            Popule o banco de dados com dados fictícios para testar o sistema
          </p>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section-header">
          <h2 className="content-section-title">Dados de Demonstração</h2>
        </div>

        <div className="seed-info">
          <div className="alert alert-info">
            <AlertTriangle size={20} />
            <div>
              <strong>Sobre os dados de teste:</strong>
              <ul style={{ margin: '8px 0 0 20px' }}>
                <li>30 produtos distribuídos em 6 categorias</li>
                <li>5 fornecedores com informações completas</li>
                <li>5 clientes cadastrados</li>
                <li>Usuário admin (admin/password123)</li>
                <li>Alguns produtos com estoque baixo/zerado para teste</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="seed-actions">
          <button
            className="btn btn-primary"
            onClick={handleSeedData}
            disabled={loading}
            style={{ marginRight: '16px' }}
          >
            <Database size={16} />
            {loading ? 'Populando...' : 'Popular Banco de Dados'}
          </button>

          <button
            className="btn btn-error"
            onClick={handleClearData}
            disabled={loading}
          >
            <Trash2 size={16} />
            Limpar Todos os Dados
          </button>
        </div>

        {stats && (
          <div className="seed-results">
            <h3 style={{ color: 'var(--color-success-600)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} />
              Dados populados com sucesso!
            </h3>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="stat-card">
                <h4>Usuários</h4>
                <p className="stat-value">{stats.users}</p>
              </div>
              <div className="stat-card">
                <h4>Categorias</h4>
                <p className="stat-value">{stats.categories}</p>
              </div>
              <div className="stat-card">
                <h4>Fornecedores</h4>
                <p className="stat-value">{stats.suppliers}</p>
              </div>
              <div className="stat-card">
                <h4>Clientes</h4>
                <p className="stat-value">{stats.customers}</p>
              </div>
              <div className="stat-card">
                <h4>Produtos</h4>
                <p className="stat-value">{stats.products}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="content-section">
        <div className="content-section-header">
          <h2 className="content-section-title">Próximos Passos</h2>
        </div>
        
        <div className="steps-list">
          <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Após popular os dados, acesse o <strong>Dashboard</strong> para ver as métricas</li>
            <li>Vá para <strong>Produtos</strong> para gerenciar o inventário</li>
            <li>Teste as funcionalidades de <strong>Vendas</strong> e <strong>Clientes</strong></li>
            <li>Explore os <strong>Relatórios</strong> com dados reais</li>
            <li>Configure suas próprias <strong>Categorias</strong> e <strong>Fornecedores</strong></li>
          </ol>
        </div>
      </div>

      <style jsx>{`
        .seed-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .seed-info {
          margin-bottom: var(--space-6);
        }

        .seed-actions {
          margin-bottom: var(--space-8);
        }

        .seed-results {
          margin-top: var(--space-6);
          padding: var(--space-6);
          background: var(--color-success-50);
          border: 1px solid var(--color-success-200);
          border-radius: var(--radius-lg);
        }

        .steps-list {
          color: var(--color-text-secondary);
          font-size: var(--font-size-base);
        }

        .stat-value {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary-600);
          margin: var(--space-2) 0 0 0;
        }
      `}</style>
    </div>
  );
}

export default SeedPage;
