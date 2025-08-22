import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const AuthClientContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

const CLIENT_STORAGE_KEY = 'nublack_clients';
const SESSION_STORAGE_KEY = 'nublack_session';

// Credenciales del administrador demo
const ADMIN_DEMO = {
  email: "admin@nublack.com",
  password: "admin123",
  role: "Administrador",
  firstName: "Admin",
  lastName: "NUBLACK",
  name: "Administrador NUBLACK",
  phone: "3001234567",
  documentType: "CC",
  documentNumber: "12345678",
};

const loadClients = () => {
  try {
    const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading clients:', error);
    return [];
  }
};

const saveClients = (clients) => {
  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients:', error);
  }
};

const loadSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

const saveSession = (session) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token, 
        loading: false, 
        error: null 
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null };
    case 'HYDRATE_SESSION':
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token, 
        loading: false 
      };
    default:
      return state;
  }
};

export const useAuthClient = () => {
  const context = useContext(AuthClientContext);
  if (!context) {
    throw new Error('useAuthClient must be used within an AuthClientProvider');
  }
  return context;
};

export const AuthClientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const session = loadSession();
    if (session && session.token) {
      dispatch({ type: 'HYDRATE_SESSION', payload: session });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Verificar si es admin demo
      if (email === ADMIN_DEMO.email && password === ADMIN_DEMO.password) {
        const token = `admin-${Date.now()}`;
        const session = {
          user: {
            name: ADMIN_DEMO.name,
            email: ADMIN_DEMO.email,
            role: ADMIN_DEMO.role,
            firstName: ADMIN_DEMO.firstName,
            lastName: ADMIN_DEMO.lastName,
            phone: ADMIN_DEMO.phone,
            documentType: ADMIN_DEMO.documentType,
            documentNumber: ADMIN_DEMO.documentNumber,
          },
          token,
        };
        saveSession(session);
        dispatch({ type: 'LOGIN_SUCCESS', payload: session });
        return session;
      }

      // Verificar clientes registrados
      const clients = loadClients();
      const found = clients.find(client => client.email === email && client.password === password);
      
      if (!found) {
        throw new Error('Credenciales inválidas');
      }

      const token = `client-${Date.now()}`;
      const displayName = found.name || `${found.firstName || ""} ${found.lastName || ""}`.trim();
      
      const session = {
        user: {
          name: displayName || found.email,
          email: found.email,
          role: found.role || "Cliente",
          firstName: found.firstName || null,
          lastName: found.lastName || null,
          phone: found.phone || null,
          documentType: found.documentType || null,
          documentNumber: found.documentNumber || null,
        },
        token,
      };
      
      saveSession(session);
      dispatch({ type: 'LOGIN_SUCCESS', payload: session });
      return session;
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const clients = loadClients();
      const { email } = userData;
      
      if (clients.find(client => client.email === email)) {
        throw new Error('El correo electrónico ya está registrado');
      }

      const newClient = {
        documentType: userData.documentType || null,
        documentNumber: userData.documentNumber || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        phone: userData.phone || null,
        email: userData.email,
        password: userData.password,
        role: "Cliente",
        name: userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      };

      const updatedClients = [...clients, newClient];
      saveClients(updatedClients);

      const token = `client-${Date.now()}`;
      const displayName = newClient.name || `${newClient.firstName || ""} ${newClient.lastName || ""}`.trim();
      
      const session = {
        user: {
          name: displayName || newClient.email,
          email: newClient.email,
          role: newClient.role,
          firstName: newClient.firstName,
          lastName: newClient.lastName,
          phone: newClient.phone,
          documentType: newClient.documentType,
          documentNumber: newClient.documentNumber,
        },
        token,
      };
      
      saveSession(session);
      dispatch({ type: 'LOGIN_SUCCESS', payload: session });
      return session;
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
  };

  return (
    <AuthClientContext.Provider value={value}>
      {children}
    </AuthClientContext.Provider>
  );
};
