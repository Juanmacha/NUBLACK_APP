import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { AuthClientProvider } from './features/auth/hooks/useAuthClient';


const App = () => {
  return (
    <AuthClientProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthClientProvider>
  );
};

export default App;
