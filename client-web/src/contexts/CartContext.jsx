import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  const addToCart = (product) => {
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
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((x) => x._id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };
  
  const clearCart = () => {
     setCartItems([]);
     localStorage.removeItem('cartItems');
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
