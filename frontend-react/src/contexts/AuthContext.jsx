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
    const checkAuthState = async () => {
      // Pequeno delay para evitar flickering
      await new Promise(resolve => setTimeout(resolve, 100));

      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        console.log('Found saved token, setting user as authenticated');
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('No saved token found - user needs to login');
      }

      setLoading(false);
    };

    checkAuthState();
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
    // Verificar se há token
    if (!token) {
      console.error('No token available for request to:', url);
      logout();
      throw new Error('Não autenticado. Faça login primeiro.');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, { ...options, ...defaultOptions });

      console.log(`Response status: ${response.status} for ${url}`);

      if (response.status === 401) {
        // Token expirado ou inválido
        console.warn('Token expired or invalid, logging out');
        logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error(`Request failed for ${url}:`, error);

      // Se o erro for de rede, tentar diagnosticar
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Network error - possible proxy issue or backend down');
        throw new Error('Erro de conexão. Verifique se o servidor está funcionando.');
      }

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
