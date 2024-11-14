import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(savedCartItems);
        const initialTotal = savedCartItems.reduce(
            (total, item) => total + item.defaultPrice * item.quantity,
            0
        );
        setTotalAmount(initialTotal);
    }, []);

    const addToCart = (cartItem) => {
        const existingProduct = cartItems.find(item => item.id === cartItem.id);

        let updatedCartItems;
        if (existingProduct) {
            updatedCartItems = cartItems.map(item =>
                item.id === cartItem.id
                    ? { ...item, quantity: item.quantity + cartItem.quantity }
                    : item
            );
        } else {
            updatedCartItems = [...cartItems, cartItem];
        }

        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        const updatedTotal = updatedCartItems.reduce(
            (total, item) => total + item.defaultPrice * item.quantity,
            0
        );
        setTotalAmount(updatedTotal);
    };

    const removeFromCart = (productId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        const updatedTotal = updatedCartItems.reduce(
            (total, item) => total + item.defaultPrice * item.quantity,
            0
        );
        setTotalAmount(updatedTotal);
    };

    const updateQuantity = (productId, newQuantity) => {
        const updatedCartItems = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        const updatedTotal = updatedCartItems.reduce(
            (total, item) => total + item.defaultPrice * item.quantity,
            0
        );
        setTotalAmount(updatedTotal);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalAmount, setTotalAmount, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
