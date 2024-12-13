import React, { useEffect, useState } from "react";
import { Button, Drawer } from "antd";
import CartItem from "./cart.item";
import CartBottom from "./cart.bottom";
import "./cart.style.css";
import { ClearOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
const CartDrawer = ({ openCart, setOpenCart }) => {
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("i18nextLng") || "vi";

  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // State to hold the cart items

  useEffect(() => {
    setCartItems([]);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const showDrawer = () => {
    setOpenCart(true);
  };
  const onClose = () => {
    setOpenCart(false);
  };

  const clearAll = () => {
    localStorage.removeItem("cartItems"); // Remove cart items from localStorage
    setCartItems([]); // Reset cartItems state to empty array
    setTotalAmount(0); // Reset the total amount
  };

  return (
    <>
      <Drawer
        title={t("MES-942")}
        width={600}
        onClose={onClose}
        open={openCart}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: "100%",
            border: "1px solid #ddd",
          }}
        >
          {/* Phần chứa các CartItem */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              position: "absolute",
              left: "0",
              right: "0",
              bottom: "0",
              top: "0",
              borderBottom: "1px solid #ddd",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <CartItem
              setTotalAmount={setTotalAmount}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          </div>
        </div>
        {/* Phần CartBottom luôn dính dưới */}
        <div
          style={{
            position: "sticky",
            bottom: 0, // Dính vào đáy
            borderTop: "1px solid #ddd",
            height: 80,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <CartBottom totalAmount={totalAmount} />
        </div>
      </Drawer>
    </>
  );
};

export default CartDrawer;
