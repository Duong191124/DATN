import CartItem from "../cart/cart.item";
import { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

const Summary = () => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const handleCouponChange = (value) => {
        setSelectedCoupon(value);
        // Thêm logic tính toán dựa trên coupon tại đây nếu cần
    };

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
                    {/* fake data cart */}
                    {[...Array(20)].map((_, index) => (
                        <CartItem key={index} />
                    ))}
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
                    <h3 style={{ margin: 0 }}>$594.00</h3>
                </div>
            </div>
        </>
    );
};

export default Summary;
