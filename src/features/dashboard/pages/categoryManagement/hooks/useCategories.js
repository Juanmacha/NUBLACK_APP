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
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        nombre: 'Mochilas',
        descripcion: 'Mochilas para toda ocasión',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        nombre: 'Camisetas',
        descripcion: 'Camisetas para hombre y mujer',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 5,
        nombre: 'Jeans',
        descripcion: 'Jeans para hombre',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 6,
        nombre: 'Chaquetas',
        descripcion: 'Chaquetas para hombre',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 7,
        nombre: 'Sudaderas',
        descripcion: 'Sudaderas para hombre',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 8,
        nombre: 'Shorts',
        descripcion: 'Shorts para hombre',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 9,
        nombre: 'Faldas',
        descripcion: 'Faldas para mujer',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 10,
        nombre: 'Leggis',
        descripcion: 'Leggis para mujer',
        estado: 'Activo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 11,
        nombre: 'Ropa deportiva',
        descripcion: 'Ropa para hacer deporte',
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
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
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
      const updatedCategories = categories.map(category =>
        category.id === id
          ? { ...category, ...categoryData, updatedAt: new Date().toISOString() }
          : category
      );
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      return updatedCategories.find(c => c.id === id);
    } catch (err) {
      throw new Error('Error al actualizar categoría');
    }
  }, [categories]);

  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter(category => category.estado !== 'Inactivo');
  }, [categories]);

  return {
    categories,
    loading,
    error,
    updateCategory,
    getCategoryById,
    getActiveCategories,
  };
};