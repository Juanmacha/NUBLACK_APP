import { useState, useEffect, useCallback } from 'react';

const PRODUCTS_STORAGE_KEY = 'nublack_products';

const loadProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

const saveProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const data = loadProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      const newProduct = {
        id: generateId(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      return newProduct;
    } catch (err) {
      throw new Error('Error al crear producto');
    }
  }, [products]);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      const updatedProducts = products.map(product =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product
      );
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      return updatedProducts.find(p => p.id === id);
    } catch (err) {
      throw new Error('Error al actualizar producto');
    }
  }, [products]);

  const deleteProduct = useCallback(async (id) => {
    try {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    } catch (err) {
      throw new Error('Error al eliminar producto');
    }
  }, [products]);

  const getProductById = useCallback((id) => {
    return products.find(product => product.id === id);
  }, [products]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
};
