import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './components/app/AppContent';

// Main App content wrapped with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
