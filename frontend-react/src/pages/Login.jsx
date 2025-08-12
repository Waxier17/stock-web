import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader, ShieldCheck, Package, TrendingUp, BarChart3 } from 'lucide-react';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando o usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro interno do servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupAdmin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar usuário admin');
      } else {
        setError('');
        // Auto-fill form with admin credentials
        setFormData({
          username: 'admin',
          password: 'password123'
        });
        alert('Usuário admin criado com sucesso!\nCredenciais: admin / password123');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background decorative elements */}
      <div className="background-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Left side - Branding and features */}
      <div className="login-sidebar">
        <div className="branding-section">
          <div className="logo-section">
            <div className="logo-icon">
              <Package size={32} />
            </div>
            <h1 className="brand-title">Stock Web</h1>
          </div>
          
          <h2 className="brand-subtitle">
            Sistema Completo de Gerenciamento de Estoque
          </h2>
          
          <p className="brand-description">
            Controle total do seu inventário com relatórios avançados, 
            análises em tempo real e gestão inteligente de fornecedores.
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Package size={20} />
              </div>
              <div className="feature-content">
                <h4>Gestão de Inventário</h4>
                <p>Controle completo de produtos</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <TrendingUp size={20} />
              </div>
              <div className="feature-content">
                <h4>Análise de Vendas</h4>
                <p>Relatórios em tempo real</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <BarChart3 size={20} />
              </div>
              <div className="feature-content">
                <h4>Dashboard Inteligente</h4>
                <p>Insights e métricas avançadas</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="feature-content">
                <h4>Segurança Avançada</h4>
                <p>Proteção de dados garantida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="login-form-section">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Bem-vindo de volta!</h2>
            <p className="login-subtitle">Entre com suas credenciais para acessar o sistema</p>
          </div>

          {error && (
            <div className="alert-error">
              <div className="alert-icon">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Usuário</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome de usuário"
                  className="form-input"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  className="form-input"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkbox-checkmark"></span>
                <span className="checkbox-label">Lembrar de mim</span>
              </label>
              
              <a href="#" className="forgot-password">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="button-spinner" />
                  Entrando...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="security-note">
              <ShieldCheck size={16} />
              <span>Conexão segura protegida por SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
