import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';

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
    Swal.fire({
      icon: 'error',
      title: 'Error de Almacenamiento',
      text: 'Hubo un problema al cargar los datos de clientes. Por favor, recarga la página.',
    });
    return [];
  }
};

const saveClients = (clients) => {
  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de Almacenamiento',
      text: 'Hubo un problema al guardar los datos de clientes. Por favor, inténtalo de nuevo.',
    });
  }
};

const loadSession = () => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading session:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de Sesión',
      text: 'Hubo un problema al cargar la sesión. Por favor, inicia sesión nuevamente.',
    });
    return null;
  }
};

const saveSession = (session) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de Sesión',
      text: 'Hubo un problema al guardar la sesión. Por favor, inténtalo de nuevo.',
    });
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de Sesión',
      text: 'Hubo un problema al cerrar la sesión. Por favor, inténtalo de nuevo.',
    });
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
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
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
            id: 'admin',
            ...ADMIN_DEMO
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
          id: found.email, // Usar email como id único para clientes
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
      Swal.fire({
        icon: 'error',
        title: 'Error de Inicio de Sesión',
        text: err.message || 'Hubo un problema al iniciar sesión. Por favor, verifica tus credenciales.',
      });
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
        id: email, // Usar email como id único
        ...userData,
        role: "Cliente",
        name: userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
      };

      const updatedClients = [...clients, newClient];
      saveClients(updatedClients);

      const token = `client-${Date.now()}`;
      const displayName = newClient.name || `${newClient.firstName || ""} ${newClient.lastName || ""}`.trim();
      
      const session = {
        user: {
          id: newClient.id,
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
      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada y has iniciado sesión.',
        showConfirmButton: false,
        timer: 1500
      });
      return session;
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message });
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
        text: err.message || 'Hubo un problema al registrar tu cuenta. Por favor, inténtalo de nuevo.',
      });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'LOGOUT' });
    Swal.fire({
      icon: 'info',
      title: 'Sesión Cerrada',
      text: 'Has cerrado sesión exitosamente.',
      showConfirmButton: false,
      timer: 1500
    });
  }, []);

  const setUser = useCallback((userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    // También actualiza la sesión para persistir los cambios
    const session = loadSession();
    if (session) {
      const updatedSession = {
        ...session,
        user: { ...session.user, ...userData },
      };
      saveSession(updatedSession);
    }
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    setUser, // Exponer la función para actualizar el usuario
  };

  return (
    <AuthClientContext.Provider value={value}>
      {children}
    </AuthClientContext.Provider>
  );
};
