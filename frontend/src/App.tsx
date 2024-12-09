import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
