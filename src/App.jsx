import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { AuthClientProvider } from './features/auth/hooks/useAuthClient';
import { CartProvider } from './features/landing/context/CartContext';


const App = () => {
  return (
    <AuthClientProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthClientProvider>
  );
};

export default App;
