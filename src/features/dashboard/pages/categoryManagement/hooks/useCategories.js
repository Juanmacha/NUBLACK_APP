import { useState, useEffect, useCallback } from 'react';

const CATEGORIES_STORAGE_KEY = 'nublack_categories';

const loadCategories = () => {
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (storedCategories) {
      return JSON.parse(storedCategories);
    }

    const defaultCategories = [
      {
        id: 1,
        nombre: 'Zapatos',
        descripcion: 'Calzado deportivo y casual',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        nombre: 'Mochilas',
        descripcion: 'Mochilas para toda ocasión',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        nombre: 'Camisetas',
        descripcion: 'Camisetas para hombre y mujer',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        nombre: 'Jeans',
        descripcion: 'Jeans para hombre',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 6,
        nombre: 'Chaquetas',
        descripcion: 'Chaquetas para hombre',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 7,
        nombre: 'Sudaderas',
        descripcion: 'Sudaderas para hombre',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 8,
        nombre: 'Shorts',
        descripcion: 'Shorts para hombre',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 9,
        nombre: 'Faldas',
        descripcion: 'Faldas para mujer',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 10,
        nombre: 'Leggis',
        descripcion: 'Leggis para mujer',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 11,
        nombre: 'Ropa deportiva',
        descripcion: 'Ropa para hacer deporte',
        imagen: null,
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
};

const saveCategories = (categories) => {
  try {
    const dataToSave = JSON.stringify(categories);
    
    // Verificar si los datos exceden 5MB
    if (dataToSave.length > 5 * 1024 * 1024) {
      throw new Error('Los datos de categorías exceden el límite de almacenamiento (5MB)');
    }
    
    localStorage.setItem(CATEGORIES_STORAGE_KEY, dataToSave);
  } catch (error) {
    console.error('Error saving categories:', error);
    
    if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
      // Disparar evento personalizado para manejar el error de quota
      window.dispatchEvent(new CustomEvent('storageQuotaExceeded', {
        detail: { 
          type: 'categories',
          message: 'El almacenamiento local está lleno. No se pueden guardar más categorías.',
          action: 'clearStorage'
        }
      }));
    } else {
      // Disparar evento para otros errores
      window.dispatchEvent(new CustomEvent('storageError', {
        detail: { 
          type: 'categories',
          message: error.message || 'Error al guardar categorías',
          action: 'retry'
        }
      }));
    }
    
    throw error;
  }
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const data = loadCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      console.log('updateCategory llamado con:', { id, categoryData });
      console.log('Categorías actuales:', categories);
      
      const updatedCategories = categories.map(category =>
        category.id === id
          ? { ...category, ...categoryData, updatedAt: new Date().toISOString() }
          : category
      );
      
      console.log('Categorías después de actualizar:', updatedCategories);
      
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      
      const updatedCategory = updatedCategories.find(c => c.id === id);
      console.log('Categoría actualizada encontrada:', updatedCategory);
      
      return updatedCategory;
    } catch (err) {
      console.error('Error en updateCategory:', err);
      
      // Si es un error de quota, lanzar un error específico
      if (err.name === 'QuotaExceededError' || err.message.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED');
      }
      
      throw new Error(`Error al actualizar categoría: ${err.message}`);
    }
  }, [categories]);

  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter(category => category.estado !== 'Inactivo');
  }, [categories]);

  const clearAllStorage = useCallback(() => {
    try {
      // Limpiar todas las claves relacionadas con nublack
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nublack_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Reiniciar el estado
      setCategories([]);
      
      console.log('Almacenamiento limpiado exitosamente');
      return true;
    } catch (error) {
      console.error('Error al limpiar almacenamiento:', error);
      return false;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    updateCategory,
    getCategoryById,
    getActiveCategories,
    clearAllStorage,
  };
};