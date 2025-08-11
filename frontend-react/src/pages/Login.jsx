import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Loader } from 'lucide-react';
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <h1 className="logo-title">Stock Web</h1>
          <p className="logo-subtitle">Sistema de Gerenciamento de Estoque</p>
        </div>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modern-form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu usuário"
              className="modern-input"
              required
              disabled={loading}
            />
            <label className="modern-label">Usuário</label>
          </div>

          <div className="modern-form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                className="modern-input"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <label className="modern-label">Senha</label>
            </div>
          </div>

          <div className="modern-checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="rememberMe">Lembrar de mim</label>
          </div>

          <button
            type="submit"
            className="modern-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={20} className="spinner" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Acesso restrito a usuários autorizados</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
