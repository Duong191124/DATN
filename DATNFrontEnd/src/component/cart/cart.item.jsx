import React, { useEffect, useMemo } from "react";
import { Button } from "antd";
import { MinusOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useCart } from "../context/cart.context";

const CartItem = () => {
  const {
    cartItems,
    removeFromCart,
    setTotalAmount,
    updateQuantity,
    formatCurrency,
  } = useCart();

  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, product) => {
      const price = product.discountPrice || product.defaultPrice;
      return total + price * (product.quantity || 1);
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    setTotalAmount(totalAmount);
  }, [totalAmount, setTotalAmount]);

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      {cartItems.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            color: "gray",
            fontStyle: "italic",
          }}
        >
          Your cart is empty.
        </div>
      ) : (
        cartItems.map((product) => (
          <CartItemDetail
            key={product.id}
            product={product}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            formatCurrency={formatCurrency}
          />
        ))
      )}
    </div>
  );
};

const CartItemDetail = ({
  product,
  removeFromCart,
  updateQuantity,
  formatCurrency,
}) => {
  const increaseQuantity = () =>
    updateQuantity(product.id, product.quantity + 1);
  const decreaseQuantity = () => {
    if (product.quantity > 1) {
      updateQuantity(product.id, product.quantity - 1);
    }
  };
  const handleRemove = () => removeFromCart(product.id);
  console.log("product", product);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: "120px",
          marginRight: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            maxWidth: "100%",
            maxHeight: "120px",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Product Details */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            color: "#333",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            color: "#666",
            alignItems: "center",
          }}
        >
          {/* Quantity Control */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#888" }}>Quantity</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Button
                type="text"
                onClick={decreaseQuantity}
                icon={<MinusOutlined />}
                style={{
                  padding: "4px 8px",
                  borderRight: "1px solid #e0e0e0",
                }}
              />
              <span
                style={{
                  padding: "0 12px",
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {product.quantity}
              </span>
              <Button
                type="text"
                onClick={increaseQuantity}
                icon={<PlusOutlined />}
                style={{
                  padding: "4px 8px",
                  borderLeft: "1px solid #e0e0e0",
                }}
              />
            </div>
          </div>

          {/* Size */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#888" }}>Size</div>
            <div
              style={{
                fontWeight: "500",
                color: "#333",
              }}
            >
              {product.size}
            </div>
          </div>

          {/* Color */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#888" }}>Color</div>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: product.color,
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginLeft: "16px",
          minWidth: "120px",
        }}
      >
        {product.discountPrice ? (
          <>
            <div
              style={{
                textDecoration: "line-through",
                color: "#888",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              {formatCurrency(product.defaultPrice)}
            </div>
            <div
              style={{
                color: "#d32f2f",
                fontWeight: "bold",
                fontSize: "16px",
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              {formatCurrency(product.discountPrice)}
            </div>
          </>
        ) : (
          <div
            style={{
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {formatCurrency(product.defaultPrice)}
          </div>
        )}
      </div>

      {/* Remove Button */}
      <Button
        type="text"
        icon={<CloseOutlined />}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          color: "#666",
          padding: "4px",
          borderRadius: "50%",
          backgroundColor: "transparent",
          border: "1px solid transparent",
          transition: "all 0.3s ease",
        }}
        onClick={handleRemove}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "rgba(0,0,0,0.05)";
          e.target.style.border = "1px solid #e0e0e0";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.border = "1px solid transparent";
        }}
      />
    </div>
  );
};

export default CartItem;
