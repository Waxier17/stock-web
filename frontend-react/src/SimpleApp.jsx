import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import './styles/global.css';

function SimpleLogin() {
  return (
    <div className="dark-theme" style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-background-secondary)',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Stock Web</h1>
        <p style={{ marginBottom: '30px', color: 'var(--color-text-muted)' }}>
          Sistema de Gerenciamento de Estoque
        </p>
        <div style={{
          background: 'var(--gradient-primary)',
          padding: '12px 24px',
          borderRadius: '8px',
          color: 'white',
          display: 'inline-block'
        }}>
          Faça seu login
        </div>
      </div>
    </div>
  );
}

function SimpleApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<SimpleLogin />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default SimpleApp;
