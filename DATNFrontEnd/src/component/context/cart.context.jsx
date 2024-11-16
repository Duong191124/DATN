import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const userId = localStorage.getItem("userId");

    const getCartKey = () => {
        return userId ? `cart_${userId}` : 'guestCart';
    };

    const calculateTotal = (items) => {
        return items.reduce(
            (total, item) => total + (item.discountPrice || item.defaultPrice) * item.quantity,
            0
        );
    };

    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem(getCartKey())) || [];
        setCartItems(savedCartItems);
        setTotalAmount(calculateTotal(savedCartItems));
    }, [userId]);

    const updateLocalStorage = (items) => {
        localStorage.setItem(getCartKey(), JSON.stringify(items));
    };

    const addToCart = (cartItem) => {
        const existingProduct = cartItems.find(item => item.id === cartItem.id);
        let updatedCartItems;

        if (existingProduct) {
            updatedCartItems = cartItems.map(item =>
                item.id === cartItem.id ? { ...item, quantity: item.quantity + cartItem.quantity } : item
            );
        } else {
            updatedCartItems = [...cartItems, cartItem];
        }

        setCartItems(updatedCartItems);
        updateLocalStorage(updatedCartItems);
        setTotalAmount(calculateTotal(updatedCartItems));
    };

    const removeFromCart = (productId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCartItems);
        updateLocalStorage(updatedCartItems);
        setTotalAmount(calculateTotal(updatedCartItems));
    };

    const updateQuantity = (productId, newQuantity) => {
        const updatedCartItems = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
        updateLocalStorage(updatedCartItems);
        setTotalAmount(calculateTotal(updatedCartItems));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalAmount, setTotalAmount, updateQuantity, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
