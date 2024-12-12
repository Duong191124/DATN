import { message } from "antd";
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchProductsByProductDetails } from "../../service/api.service";
import { details } from "framer-motion/client";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userId = localStorage.getItem("userId");
  const [dataProductDetail, setDataProductDetail] = useState([]);
  const getCartKey = () => {
    return userId ? `cart_${userId}` : "guestCart";
  };

  const calculateTotal = (items) => {
    return items.reduce(
      (total, item) =>
        total + (item.discountPrice || item.defaultPrice) * item.quantity,
      0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem(getCartKey())) || [];
    setCartItems(savedCartItems);
    setTotalAmount(calculateTotal(savedCartItems));
  }, [userId]);

  const updateLocalStorage = (items) => {
    localStorage.setItem(getCartKey(), JSON.stringify(items));
  };
  console.log("carrrtttt", cartItems);
  const fetchAllProductDetail = async () => {
    const response = await fetchProductsByProductDetails(0, 1000);
    if (response?.data?.data) {
      setDataProductDetail(response.data.data?.products);
    }
  };
  useEffect(() => {
    fetchAllProductDetail();
  }, []);
  console.log("dataProductDetail", dataProductDetail);
  const addToCart = (cartItem) => {
    const existingProduct = cartItems.find((item) => item.id === cartItem.id);
    const productDetail = dataProductDetail.find((item) =>
      item.details.some((detail) => detail.id === cartItem.id)
    );
    const productDetails = productDetail.details.find(
      (detail) => detail.id === cartItem.id
    );
    const totalInCart = existingProduct ? existingProduct.quantity : 0;
    const totalRequested = totalInCart + cartItem.quantity;
    if (totalRequested > productDetails.quantity) {
      message.info(`Số lượng trong kho không đủ. Vui lòng kiểm tra giỏ hàng!`);
      return;
    }
    let updatedCartItems;
    if (existingProduct) {
      updatedCartItems = cartItems.map((item) =>
        item.id === cartItem.id ? { ...item, quantity: totalRequested } : item
      );
    } else {
      updatedCartItems = [...cartItems, cartItem];
    }
    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
    setTotalAmount(calculateTotal(updatedCartItems));
    message.success("Thêm vào giỏ hàng thành công");
  };
  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
    setTotalAmount(calculateTotal(updatedCartItems));
  };

  const updateQuantity = (productId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
    updateLocalStorage(updatedCartItems);
    setTotalAmount(calculateTotal(updatedCartItems));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        totalAmount,
        setTotalAmount,
        updateQuantity,
        setCartItems,
        formatCurrency, // Providing formatCurrency function here
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
