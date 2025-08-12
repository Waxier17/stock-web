function TestApp() {
  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0F172A',
      color: '#F1F5F9',
      minHeight: '100vh'
    }}>
      <h1>🎉 React App is Working!</h1>
      <p>Stock Web - Test Loading</p>
      <div style={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '20px'
      }}>
        <h2>Theme Test</h2>
        <p>Dark mode is active and working correctly!</p>
      </div>
    </div>
  );
}

export default TestApp;
