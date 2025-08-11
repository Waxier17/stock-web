import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar se existe token salvo no localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Funç��o de login
  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Salvar dados no estado e localStorage
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Função de logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Função para fazer requisições autenticadas
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...options, ...defaultOptions });
      
      if (response.status === 401) {
        // Token expirado ou inválido
        logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na requisição');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    makeAuthenticatedRequest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
