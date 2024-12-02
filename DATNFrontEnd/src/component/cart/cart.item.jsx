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

  // Memoize the total calculation to optimize performance
  const totalAmount = useMemo(() => {
    return cartItems.reduce((total, product) => {
      const price = product.discountPrice || product.defaultPrice;
      return total + price * (product.quantity || 1);
    }, 0);
  }, [cartItems]);

  // Update the total amount whenever the cartItems change
  useEffect(() => {
    setTotalAmount(totalAmount);
  }, [totalAmount, setTotalAmount]);

  return (
    <div>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "16px", color: "gray" }}>
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

const CartItemDetail = ({ product, removeFromCart, updateQuantity, formatCurrency }) => {
  const increaseQuantity = () => updateQuantity(product.id, product.quantity + 1);
  const decreaseQuantity = () => {
    if (product.quantity > 1) {
      updateQuantity(product.id, product.quantity - 1);
    }
  };
  const handleRemove = () => removeFromCart(product.id);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid #ddd",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      {/* Product Image */}
      <div style={{ width: "150px", display: "flex", alignItems: "center" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "80px", height: "auto" }}
        />
      </div>

      {/* Product Details */}
      <div style={{ flexGrow: 1, paddingLeft: "16px", paddingRight: "10px" }}>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{product.name}</div>
        <div style={{ display: "flex", gap: "24px", color: "gray", marginTop: "8px" }}>
          <div>
            <div>Quantity</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={decreaseQuantity}
                icon={<MinusOutlined />}
                size="small"
                style={{ marginRight: "8px" }}
              />
              <span>{product.quantity}</span>
              <Button
                onClick={increaseQuantity}
                icon={<PlusOutlined />}
                size="small"
                style={{ marginLeft: "8px" }}
              />
            </div>
          </div>
          <div>
            <div>Size</div>
            <div>{product.size}</div>
          </div>
          <div>
            <div>Color</div>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: product.color,
                borderRadius: "50%",
                boxShadow: "0 0 3px rgba(0, 0, 0, 0.88)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Product Price */}
      <div style={{ fontWeight: "bold", fontSize: "17px", marginRight: "auto" }}>
        {product.discountPrice ? (
          <>
            <span
              style={{
                textDecoration: "line-through",
                color: "gray",
                marginRight: "8px",
              }}
            >
              {formatCurrency(product.defaultPrice)}
            </span>
            <span style={{ color: "red" }}>{formatCurrency(product.discountPrice)}</span>
          </>
        ) : (
          <span>{formatCurrency(product.defaultPrice)}</span>
        )}
      </div>

      {/* Remove Button */}
      <div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          style={{
            border: "1px solid black",
            borderRadius: "4px",
            padding: "4px 12px",
            marginLeft: "10px",
          }}
          onClick={handleRemove}
        />
      </div>
    </div>
  );
};

export default CartItem;
