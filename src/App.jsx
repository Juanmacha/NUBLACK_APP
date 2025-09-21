import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { AuthClientProvider } from './features/auth/hooks/useAuthClient';
import { CartProvider } from './features/landing/context/CartContext';
import { ToastProvider } from './shared/context/ToastContext';


const App = () => {
  return (
    <ToastProvider>
      <AuthClientProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthClientProvider>
    </ToastProvider>
  );
};

export default App;
