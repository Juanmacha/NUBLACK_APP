import { useState, useEffect, useCallback } from 'react';

const CATEGORIES_STORAGE_KEY = 'nublack_categories';

const loadCategories = () => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

  const createCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = {
        id: generateId(),
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      return newCategory;
    } catch (err) {
      throw new Error('Error al crear categoría');
    }
  }, [categories]);

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

  const deleteCategory = useCallback(async (id) => {
    try {
      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
    } catch (err) {
      throw new Error('Error al eliminar categoría');
    }
  }, [categories]);

  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
};
