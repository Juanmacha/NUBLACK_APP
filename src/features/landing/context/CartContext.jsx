
import React, { createContext, useState, useEffect } from 'react';
import { useAuthClient } from '../../auth/hooks/useAuthClient';

const CartContext = createContext();

const getCartKey = (userEmail) => `nublack_cart_${userEmail}`;

const loadCartFromStorage = (userEmail) => {
  if (!userEmail) return [];
  try {
    const cartKey = getCartKey(userEmail);
    const stored = localStorage.getItem(cartKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

const saveCartToStorage = (cart, userEmail) => {
  if (!userEmail) return;
  try {
    const cartKey = getCartKey(userEmail);
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuthClient();

  useEffect(() => {
    if (user?.email) {
      const savedCart = loadCartFromStorage(user.email);
      setCart(savedCart);
    } else {
      setCart([]);
    }
  }, [user?.email]);

  const addToCart = (product) => {
    if (!user?.email) {
      console.error('No user logged in');
      return;
    }
    if (!product || !product.id || !product.nombre || !product.precio) {
      console.error('Invalid product data:', product);
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      saveCartToStorage(newCart, user.email);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    if (!user?.email) return;
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== productId);
      saveCartToStorage(newCart, user.email);
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (!user?.email) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      saveCartToStorage(newCart, user.email);
      return newCart;
    });
  };

  const clearCart = () => {
    if (!user?.email) return;
    setCart([]);
    saveCartToStorage([], user.email);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
