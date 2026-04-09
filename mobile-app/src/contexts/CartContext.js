import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await AsyncStorage.getItem('cartItems');
        if (items) {
          setCartItems(JSON.parse(items));
        }
      } catch (e) {
        console.error('Failed to load cart info', e);
      }
    };
    loadCart();
  }, []);

  const addToCart = async (product) => {
    setCartItems((prev) => {
      const existItem = prev.find((x) => x._id === product._id);
      let updatedCart;
      if (existItem) {
        updatedCart = prev.map((x) =>
          x._id === existItem._id ? { ...existItem, qty: existItem.qty + 1 } : x
        );
      } else {
        updatedCart = [...prev, { ...product, qty: 1 }];
      }
      AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = async (id) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((x) => x._id !== id);
      AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
