import CartItem from "../cart/cart.item";
import { useEffect, useState } from "react";
import { Button, message, Select } from "antd";
import { useCart } from "../context/cart.context";
import { getVouchersByCustomerId } from "../../service/api.service";
import { useCheckout } from "../context/checkout.context";

const { Option } = Select;

const Summary = () => {
    const { cartItems } = useCart();
    const {
        selectedCoupon,
        setSelectedCoupon,
        couponDiscount,
        setCouponDiscount,
        totalPrice,
        setTotalPrice
    } = useCheckout();
    const [vouchers, setVouchers] = useState([]);

    // Tính subtotal từ giỏ hàng
    const calculateTotal = () => {
        return cartItems.reduce((total, product) => {
            return total + ((product.discountPrice || product.defaultPrice) * (product.quantity || 1));
        }, 0);
    };

    const subtotal = calculateTotal();

    // Lấy dữ liệu voucher cho người dùng hiện tại
    const fetchDataVoucher = async () => {
        let customerId = localStorage.getItem("userId");
        if (!customerId) {
            customerId = 1;
        }

        try {
            const res = await getVouchersByCustomerId(customerId);
            setVouchers(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Cập nhật tổng tiền khi chọn coupon
    const handleCouponChange = async (voucherId) => {
        // Find the selected voucher by ID
        const selectedVoucher = vouchers.find((voucher) => voucher.id === voucherId);

        if (selectedVoucher) {
            const {
                minPurchaseAmount,
                discountPercent,
                discountAmount,
                maxDiscountAmount
            } = selectedVoucher;

            const minPurchase = parseFloat(minPurchaseAmount) || 0;
            const maxDiscount = parseFloat(maxDiscountAmount) || 0;
            const discountAmt = parseFloat(discountAmount) || 0;
            const discountPct = parseFloat(discountPercent) || 0;

            if (subtotal < minPurchase) {
                message.warning(`Minimum purchase amount is ${minPurchase}.`);
                setSelectedCoupon(null);
                setCouponDiscount(0);
                setTotalPrice(subtotal);
                return;
            }

            const discountByPercent = (discountPct / 100) * subtotal; // Discount by percentage
            const effectiveDiscountAmount = discountAmt > 0 ? discountAmt : discountByPercent; // Use amount or percentage

            const appliedDiscount = maxDiscount > 0
                ? Math.min(effectiveDiscountAmount, maxDiscount)
                : effectiveDiscountAmount;

            setCouponDiscount(appliedDiscount);
            setTotalPrice(subtotal - appliedDiscount);
            setSelectedCoupon(voucherId);
            try {
                await fetchDataVoucher();

                message.success("Voucher applied successfully!");
            } catch (error) {
                console.error("Failed to apply voucher:", error);
                message.error("Failed to apply the voucher. Please try again.");
            }
        } else {
            message.info("No coupon selected or coupon not valid.");
            setCouponDiscount(0);
            setTotalPrice(subtotal);
            setSelectedCoupon(null);
        }
    };


    const clearCoupon = () => {
        setSelectedCoupon(null);
        setCouponDiscount(null);
        setTotalPrice(subtotal);
    };

    // Cập nhật tổng tiền khi `subtotal` hoặc `couponDiscount` thay đổi
    useEffect(() => {
        if (couponDiscount > 0) {
            setTotalPrice(subtotal - couponDiscount);
        } else {
            setTotalPrice(subtotal); // Ensure totalPrice is updated even if no coupon is applied
        }
    }, [subtotal, couponDiscount, setTotalPrice]);

    useEffect(() => {
        fetchDataVoucher();
    }, []);

    return (
        <>
            <div style={{ textAlign: 'center', padding: '20px' }}>
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
                    <label htmlFor="coupon" style={{ marginRight: "8px" }}>
                        Coupon:
                    </label>
                    <Select
                        id="coupon"
                        placeholder="Select a coupon"
                        style={{ width: 200 }}
                        onChange={handleCouponChange}
                        value={selectedCoupon}
                    >
                        {vouchers.map((voucher) => {
                            const { id, code, discountPercent, discountAmount, minPurchaseAmount } = voucher;
                            const discountInfo = [];

                            if (discountPercent > 0) {
                                discountInfo.push(`${discountPercent}%`);
                            }
                            if (discountAmount > 0) {
                                discountInfo.push(`$${discountAmount}`);
                            }

                            // Kiểm tra điều kiện sử dụng voucher
                            const isDisabled = subtotal < parseFloat(minPurchaseAmount);

                            return (
                                <Option
                                    key={voucher.id}
                                    value={id}
                                    disabled={isDisabled} // Disable nếu không đủ điều kiện
                                >
                                    {`${code} - ${discountInfo.length > 0 ? `${discountInfo.join(", ")}` : ""
                                        } ${isDisabled ? `(Min: $${minPurchaseAmount})` : ""}`}
                                </Option>
                            );
                        })}
                    </Select>
                    {selectedCoupon && (
                        <Button
                            onClick={clearCoupon}
                            style={{
                                marginLeft: '8px',
                                color: '#ff4d4f',  // Red color for the close button
                                backgroundColor: 'transparent',
                                border: '1px solid #ff4d4f',  // Red border
                                borderRadius: '50%',  // Circular button
                                padding: '0',  // Remove padding to keep the button compact
                                width: '24px',  // Set fixed width and height for circular shape
                                height: '24px',  // Set fixed width and height for circular shape
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',  // Smooth transition on hover
                            }}
                            className="close-coupon-btn"
                        >
                            <span style={{ fontWeight: 'bold' }}>X</span>
                        </Button>
                    )}
                </div>
                <div style={{ textAlign: "right", fontSize: "16px", lineHeight: "1.5", marginTop: "10px" }}>
                    <div style={{ marginBottom: "8px", color: "#333" }}>
                        <span style={{ fontWeight: "bold" }}>Subtotal:</span>
                        <span style={{ marginLeft: "8px" }}>${subtotal.toFixed(2)}</span>
                    </div>

                    {couponDiscount > 0 && (
                        <div style={{ marginBottom: "8px", color: "#f5222d" }}>
                            <span style={{ fontWeight: "bold" }}>Coupon Discount:</span>
                            <span style={{ marginLeft: "8px" }}>- ${couponDiscount.toFixed(2)}</span>
                        </div>
                    )}

                    {totalPrice !== null && (
                        <div style={{ marginTop: "12px", fontSize: "18px", color: "#1890ff", fontWeight: "bold" }}>
                            <span>Total:</span>
                            <span style={{ marginLeft: "8px" }}>${totalPrice.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Summary;
