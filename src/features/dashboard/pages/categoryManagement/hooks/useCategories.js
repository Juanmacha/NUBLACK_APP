import { useState, useEffect, useCallback } from 'react';
import { loadProducts } from '../../productManagement/hooks/useProducts';

const CATEGORIES_STORAGE_KEY = 'nublack_categories';

const loadCategories = () => {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const categories = stored ? JSON.parse(stored) : [];
    
    // Si no hay categorías, crear algunas de prueba
    if (categories.length === 0) {
      const sampleCategories = [
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
          nombre: 'Ropa',
          descripcion: 'Vestimenta deportiva y casual',
          estado: 'Activo',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(sampleCategories));
      return sampleCategories;
    }
    
    return categories;
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

const generateId = (currentCategories) => {
  if (currentCategories.length === 0) {
    return 1;
  }
  const maxId = Math.max(...currentCategories.map(cat => cat.id));
  return maxId + 1;
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
        id: generateId(categories),
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
      const products = loadProducts(); // Load products to check for associations
      const categoryToDelete = categories.find(cat => cat.id === id);

      if (!categoryToDelete) {
        throw new Error('Categoría no encontrada.');
      }

      const associatedProducts = products.filter(product => product.categoria === categoryToDelete.nombre);

      if (associatedProducts.length > 0) {
        throw new Error('No se puede eliminar la categoría porque tiene productos asociados.');
      }

      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      console.log(`Categoría ${categoryToDelete.nombre} eliminada.`);
    } catch (err) {
      throw new Error(err.message || 'Error al eliminar categoría');
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
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getActiveCategories,
  };
};
