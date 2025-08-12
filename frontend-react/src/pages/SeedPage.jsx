import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function SeedPage() {
  const { makeAuthenticatedRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seed/seed-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Seed Database</h1>
      <p>Populate the database with sample data for testing.</p>
      
      <button 
        onClick={handleSeed}
        disabled={loading}
        style={{
          padding: '1rem 2rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          marginTop: '1rem'
        }}
      >
        {loading ? 'Seeding...' : 'Seed Database'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: result.error ? '#fee2e2' : '#dcfce7',
          border: `1px solid ${result.error ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '8px'
        }}>
          <h3>{result.error ? 'Error' : 'Success'}</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SeedPage;
