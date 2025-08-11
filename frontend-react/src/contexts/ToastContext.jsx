import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from './ThemeContext';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const { isDarkMode } = useTheme();

  const showToast = {
    success: (message, options = {}) => {
      toast.success(message, {
        duration: 4000,
        style: {
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          color: isDarkMode ? '#F1F5F9' : '#0F172A',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: isDarkMode ? '#1E293B' : '#FFFFFF',
        },
        ...options,
      });
    },
    
    error: (message, options = {}) => {
      toast.error(message, {
        duration: 5000,
        style: {
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          color: isDarkMode ? '#F1F5F9' : '#0F172A',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
          primary: isDarkMode ? '#EF4444' : '#DC2626',
          secondary: isDarkMode ? '#1E293B' : '#FFFFFF',
        },
        ...options,
      });
    },
    
    warning: (message, options = {}) => {
      toast(message, {
        duration: 4000,
        icon: '⚠️',
        style: {
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          color: isDarkMode ? '#F1F5F9' : '#0F172A',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        ...options,
      });
    },
    
    info: (message, options = {}) => {
      toast(message, {
        duration: 4000,
        icon: 'ℹ️',
        style: {
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          color: isDarkMode ? '#F1F5F9' : '#0F172A',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        ...options,
      });
    },
    
    loading: (message, options = {}) => {
      return toast.loading(message, {
        style: {
          background: isDarkMode ? '#1E293B' : '#FFFFFF',
          color: isDarkMode ? '#F1F5F9' : '#0F172A',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        ...options,
      });
    },
    
    dismiss: (toastId) => {
      toast.dismiss(toastId);
    },
    
    promise: (promise, messages, options = {}) => {
      return toast.promise(
        promise,
        {
          loading: messages.loading || 'Carregando...',
          success: messages.success || 'Sucesso!',
          error: messages.error || 'Erro!',
        },
        {
          style: {
            background: isDarkMode ? '#1E293B' : '#FFFFFF',
            color: isDarkMode ? '#F1F5F9' : '#0F172A',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            boxShadow: isDarkMode 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: isDarkMode ? '#1E293B' : '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: isDarkMode ? '#EF4444' : '#DC2626',
              secondary: isDarkMode ? '#1E293B' : '#FFFFFF',
            },
          },
          ...options,
        }
      );
    },
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: isDarkMode ? '#1E293B' : '#FFFFFF',
            color: isDarkMode ? '#F1F5F9' : '#0F172A',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '500px',
            boxShadow: isDarkMode 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </ToastContext.Provider>
  );
}
