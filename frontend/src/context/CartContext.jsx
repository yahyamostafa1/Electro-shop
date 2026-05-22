import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Math Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 500 || itemsPrice === 0 ? 0 : 25; // Free shipping above $500
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% VAT
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  // Initialize from LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    const storedAddress = localStorage.getItem('shippingAddress');
    if (storedAddress) {
      setShippingAddress(JSON.parse(storedAddress));
    }

    const storedPayment = localStorage.getItem('paymentMethod');
    if (storedPayment) {
      setPaymentMethod(storedPayment);
    }
  }, []);

  // Save changes to local storage helper
  const saveCartToStorage = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    let newItems;
    if (existItem) {
      newItems = cartItems.map((x) =>
        x.product === product._id ? { ...x, qty: Math.min(qty, product.countInStock) } : x
      );
    } else {
      newItems = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          qty,
        },
      ];
    }
    saveCartToStorage(newItems);
  };

  const removeFromCart = (id) => {
    const newItems = cartItems.filter((x) => x.product !== id);
    saveCartToStorage(newItems);
  };

  const updateQty = (id, qty) => {
    const newItems = cartItems.map((x) =>
      x.product === id ? { ...x, qty: Number(qty) } : x
    );
    saveCartToStorage(newItems);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', method);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        saveShippingAddress,
        savePaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
