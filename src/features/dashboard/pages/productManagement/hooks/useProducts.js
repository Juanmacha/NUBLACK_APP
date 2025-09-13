import { useState, useEffect, useCallback } from 'react';

const PRODUCTS_STORAGE_KEY = 'nublack_products';

export const loadProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    const products = stored ? JSON.parse(stored) : [];
    
    // Si no hay productos, crear algunos de prueba
    if (products.length === 0) {
      const sampleProducts = [
        {
          id: 1,
          nombre: 'Jordan',
          descripcion: 'Zapatillas deportivas de alta calidad',
          precio: 10000,
          categoria: 'Zapatos',
          genero: 'Hombre',
          imagen: '/images/placeholder.png',
          estado: 'activo',
          rating: 4.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          variants: [
            { size: '7', stock: 5 },
            { size: '7.5', stock: 10 },
            { size: '8', stock: 7 }
          ]
        },
        {
          id: 2,
          nombre: 'Nike Air Max',
          descripcion: 'Zapatillas cómodas para running',
          precio: 8500,
          categoria: 'Zapatos',
          genero: 'Mujer',
          imagen: '/images/placeholder.png',
          estado: 'activo',
          rating: 4.8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          variants: [
            { size: '5.5', stock: 8 },
            { size: '6.5', stock: 15 },
            { size: '7', stock: 12 }
          ]
        }
      ];
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sampleProducts));
      return sampleProducts;
    }
    
    return products;
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
  return Date.now();
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
        // Ensure variants exist, default to empty array if not provided
        variants: productData.variants || [],
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

  const deleteProduct = useCallback(async (id, reason) => {
    try {
      console.log(`Deleting product ${id} with reason: ${reason}`);
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

  const getProductsByCategory = useCallback((categoryName) => {
    return products.filter(product => product.categoria === categoryName);
  }, [products]);

  const getActiveProducts = useCallback(() => {
    return products.filter(product => product.estado !== 'inactivo');
  }, [products]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getActiveProducts,
  };
};