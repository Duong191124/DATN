import CartItem from "../cart/cart.item";
import { useEffect, useState } from "react";
import { Select } from "antd";
import { useCart } from "../context/cart.context";

const { Option } = Select;

const Summary = () => {
    const { cartItems } = useCart();
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const handleCouponChange = (value) => {
        setSelectedCoupon(value);
        // Thêm logic tính toán dựa trên coupon tại đây nếu cần
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.defaultPrice * (item.quantity || 1);
        }, 0);
    };

    const subtotal = calculateTotal();


    return (
        <>
            <div
                style={{
                    textAlign: 'center',
                    padding: '20px'
                }}
            >
                <h3>Order Summary</h3>
                <p>Review items in your cart.</p>
            </div>
            <div
                className="summary"
                style={{
                    height: 400,
                    overflow: 'hidden',
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    borderBottom: '1px solid #ddd',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <div>
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cartItems.map((product) => (
                            <CartItem key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 16px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <label htmlFor="coupon" style={{ marginRight: "8px" }}>Coupon:</label>
                    <Select
                        id="coupon"
                        placeholder="Select a coupon"
                        style={{ width: 200 }}
                        onChange={handleCouponChange}
                        value={selectedCoupon}
                    >
                        <Option value="DISCOUNT10">DISCOUNT10 - 10% Off</Option>
                        <Option value="DISCOUNT20">DISCOUNT20 - 20% Off</Option>
                        <Option value="FREESHIP">FREESHIP - Free Shipping</Option>
                    </Select>
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ marginBottom: 0 }}>Subtotal:</p>
                    <h3 style={{ margin: 0 }}>${subtotal.toFixed(2)}</h3>
                </div>
            </div>
        </>
    );
};

export default Summary;
