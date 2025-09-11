import { useState, useEffect, useCallback } from 'react';

const USERS_STORAGE_KEY = 'nublack_clients';

// Credenciales del administrador demo
const ADMIN_DEMO = {
  id: 'admin-demo',
  email: "admin@nublack.com",
  password: "admin123",
  role: "Administrador",
  firstName: "Admin",
  lastName: "NUBLACK",
  name: "Administrador NUBLACK",
  phone: "3001234567",
  documentType: "CC",
  documentNumber: "12345678",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const loadUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    const clients = stored ? JSON.parse(stored) : [];
    // Incluir el admin demo en la lista
    return [ADMIN_DEMO, ...clients];
  } catch (error) {
    console.error('Error loading users:', error);
    return [ADMIN_DEMO];
  }
};

const saveUsers = (users) => {
  try {
    // Filtrar el admin demo antes de guardar
    const clientsOnly = users.filter(user => user.id !== 'admin-demo');
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clientsOnly));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const data = loadUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      const newUser = {
        id: generateId(),
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      return newUser;
    } catch (err) {
      throw new Error('Error al crear usuario');
    }
  }, [users]);

  const updateUser = useCallback(async (id, userData) => {
    try {
      // No permitir editar el admin demo
      if (id === 'admin-demo') {
        // Permite la edición de ciertos campos para el admin demo
        const updatedUsers = users.map(user =>
          user.id === id
            ? { ...user, ...userData, name: `${userData.firstName} ${userData.lastName}`, updatedAt: new Date().toISOString() }
            : user
        );
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
        return updatedUsers.find(u => u.id === id);
      }

      const updatedUsers = users.map(user =>
        user.id === id
          ? { ...user, ...userData, name: `${userData.firstName} ${userData.lastName}`, updatedAt: new Date().toISOString() }
          : user
      );
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      return updatedUsers.find(u => u.id === id);
    } catch (err) {
      throw new Error('Error al actualizar usuario');
    }
  }, [users]);

  const deleteUser = useCallback(async (id) => {
    try {
      // No permitir eliminar el admin demo
      if (id === 'admin-demo') {
        throw new Error('No se puede eliminar el administrador demo');
      }

      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    } catch (err) {
      throw new Error('Error al eliminar usuario');
    }
  }, [users]);

  const getUserById = useCallback((id) => {
    return users.find(user => user.id === id);
  }, [users]);

  const filterUsers = useCallback((searchTerm, roleFilter) => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.documentNumber?.includes(searchTerm);
      
      const matchesRole = !roleFilter || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users]);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    filterUsers,
  };
};
