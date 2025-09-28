import { useState, useEffect, useCallback } from 'react';

const PRODUCTS_STORAGE_KEY = 'nublack_products';

export const loadProducts = () => {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!stored) {
      // Si no hay productos guardados, retornar array vacío
      return [];
    }
    
    const products = JSON.parse(stored);
    
    // Filtrar productos por defecto específicos por ID y nombre
    const filteredProducts = products.filter(product => 
      !(product.id === 1 && product.nombre === 'Jordan') &&
      !(product.id === 2 && product.nombre === 'Nike Air Max') &&
      !(product.nombre === 'Jordan' && product.descripcion === 'Zapatillas deportivas de alta calidad') &&
      !(product.nombre === 'Nike Air Max' && product.descripcion === 'Zapatillas cómodas para running')
    );
    
    // Si se filtraron productos, actualizar el localStorage
    if (filteredProducts.length !== products.length) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredProducts));
      console.log('Productos por defecto eliminados del localStorage');
    }
    
    return filteredProducts;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

const saveProducts = (products) => {
  try {
    const productsJson = JSON.stringify(products);
    
    // Verificar si el tamaño excede el límite del localStorage
    if (productsJson.length > 5 * 1024 * 1024) { // 5MB
      throw new Error('Los datos de productos exceden el límite de almacenamiento. Por favor, reduce el tamaño de las imágenes.');
    }
    
    localStorage.setItem(PRODUCTS_STORAGE_KEY, productsJson);
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Error: Cuota de almacenamiento excedida. Los datos son demasiado grandes para guardar.');
      // Mostrar alerta al usuario
      window.dispatchEvent(new CustomEvent('storageQuotaExceeded', { 
        detail: { message: 'No se puede guardar el producto. El almacenamiento está lleno. Por favor, reduce el tamaño de las imágenes.' }
      }));
    } else {
      console.error('Error saving products:', error);
      window.dispatchEvent(new CustomEvent('storageError', { 
        detail: { message: error.message || 'Error al guardar el producto.' }
      }));
    }
  }
};

const generateId = () => {
  // Usar timestamp + número aleatorio para evitar colisiones
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Función para limpiar productos existentes
export const clearProducts = () => {
  try {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  } catch (error) {
    console.error('Error clearing products:', error);
  }
};

// Función para limpiar localStorage completamente cuando se excede la cuota
export const clearAllStorage = () => {
  try {
    // Limpiar todos los datos relacionados con productos
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem('nublack_products_cleared');
    
    // Limpiar otros datos que puedan estar ocupando espacio
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('nublack')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('localStorage limpiado completamente');
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
};


// Función para limpiar productos por defecto una sola vez
export const clearDefaultProducts = () => {
  try {
    // Verificar si ya se limpiaron los productos por defecto
    const alreadyCleared = localStorage.getItem('nublack_products_cleared');
    if (alreadyCleared) {
      return false; // Ya se limpiaron, no hacer nada
    }

    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const products = JSON.parse(stored);
      const filteredProducts = products.filter(product => 
        !(product.id === 1 && product.nombre === 'Jordan') &&
        !(product.id === 2 && product.nombre === 'Nike Air Max') &&
        !(product.nombre === 'Jordan' && product.descripcion === 'Zapatillas deportivas de alta calidad') &&
        !(product.nombre === 'Nike Air Max' && product.descripcion === 'Zapatillas cómodas para running')
      );
      
      if (filteredProducts.length !== products.length) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filteredProducts));
        localStorage.setItem('nublack_products_cleared', 'true');
        console.log('Productos por defecto eliminados automáticamente');
        return true; // Indica que se eliminaron productos
      }
    }
    return false; // No se eliminaron productos
  } catch (error) {
    console.error('Error clearing default products:', error);
    return false;
  }
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        // Limpiar productos por defecto si existen
        clearDefaultProducts();
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

    // Listener para detectar cambios en localStorage desde otras pestañas/componentes
    const handleStorageChange = (e) => {
      if (e.key === PRODUCTS_STORAGE_KEY) {
        loadData();
      }
    };

    // Listener para cambios en la misma pestaña
    const handleCustomStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleCustomStorageChange);
    };
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      // Generar ID único verificando que no exista
      let newId;
      do {
        newId = generateId();
      } while (products.some(p => p.id === newId));

      const newProduct = {
        id: newId,
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