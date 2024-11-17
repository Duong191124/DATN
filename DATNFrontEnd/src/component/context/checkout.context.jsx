import React, { createContext, useState, useContext } from 'react';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(null);

    const resetCheckoutContext = () => {
        setSelectedCoupon(null);
        setCouponDiscount(0);
        setTotalPrice(null);
    };

    return (
        <CheckoutContext.Provider
            value={{
                selectedCoupon,
                setSelectedCoupon,
                couponDiscount,
                setCouponDiscount,
                totalPrice,
                setTotalPrice,
                resetCheckoutContext
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);
