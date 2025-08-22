import { useCallback, useMemo } from 'react';
import { useAuthClient } from '../../auth/hooks/useAuthClient.jsx';

const ORDERS_STORAGE_KEY = 'nb_orders';

const loadOrdersMap = () => {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading orders:', error);
    return {};
  }
};

const saveOrdersMap = (ordersMap) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersMap));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

const generateOrderId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function useOrders() {
  const { user } = useAuthClient();

  const getAllForUser = useCallback(() => {
    if (!user?.email) return [];
    
    const ordersMap = loadOrdersMap();
    return ordersMap[user.email] || [];
  }, [user?.email]);

  const getSolicitudes = useCallback(() => {
    return getAllForUser().filter(order => order.type === 'solicitud');
  }, [getAllForUser]);

  const getCompras = useCallback(() => {
    return getAllForUser().filter(order => order.type === 'compra');
  }, [getAllForUser]);

  const createSolicitud = useCallback((items, subtotal) => {
    if (!user?.email) throw new Error('Usuario no autenticado');
    
    const ordersMap = loadOrdersMap();
    const userOrders = ordersMap[user.email] || [];
    
    const newOrder = {
      id: generateOrderId(),
      type: 'solicitud',
      items: items.map(item => ({
        ...item,
        id: item.id || generateOrderId()
      })),
      subtotal,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name
    };
    
    const updatedUserOrders = [...userOrders, newOrder];
    ordersMap[user.email] = updatedUserOrders;
    saveOrdersMap(ordersMap);
    
    return newOrder;
  }, [user?.email, user?.name]);

  const createCompra = useCallback((items, subtotal) => {
    if (!user?.email) throw new Error('Usuario no autenticado');
    
    const ordersMap = loadOrdersMap();
    const userOrders = ordersMap[user.email] || [];
    
    const newOrder = {
      id: generateOrderId(),
      type: 'compra',
      items: items.map(item => ({
        ...item,
        id: item.id || generateOrderId()
      })),
      subtotal,
      status: 'completada',
      createdAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name
    };
    
    const updatedUserOrders = [...userOrders, newOrder];
    ordersMap[user.email] = updatedUserOrders;
    saveOrdersMap(ordersMap);
    
    return newOrder;
  }, [user?.email, user?.name]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    if (!user?.email) throw new Error('Usuario no autenticado');
    
    const ordersMap = loadOrdersMap();
    const userOrders = ordersMap[user.email] || [];
    
    const updatedUserOrders = userOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );
    
    ordersMap[user.email] = updatedUserOrders;
    saveOrdersMap(ordersMap);
  }, [user?.email]);

  const value = useMemo(() => ({
    getAllForUser,
    getSolicitudes,
    getCompras,
    createSolicitud,
    createCompra,
    updateOrderStatus,
  }), [getAllForUser, getSolicitudes, getCompras, createSolicitud, createCompra, updateOrderStatus]);

  return value;
}
