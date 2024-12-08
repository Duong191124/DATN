import CartItem from "../cart/cart.item";
import { useEffect, useMemo, useState } from "react";
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
    setTotalPrice,
    formatCurrency,
  } = useCheckout();
  const [vouchers, setVouchers] = useState([]);

  // Tính subtotal từ giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce((total, product) => {
      return (
        total +
        (product.discountPrice || product.defaultPrice) *
          (product.quantity || 1)
      );
    }, 0);
  };

  const subtotal = calculateTotal();

  // Lấy dữ liệu voucher cho người dùng hiện tại
  const fetchDataVoucher = async () => {
    try {
      const res = await getVouchersByCustomerId();
      setVouchers(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Cập nhật tổng tiền khi chọn coupon
  const handleCouponChange = async (voucherId) => {
    // Find the selected voucher by ID
    const selectedVoucher = vouchers.find(
      (voucher) => voucher.id === voucherId
    );

    if (selectedVoucher) {
      const {
        minPurchaseAmount,
        discountPercent,
        discountAmount,
        maxDiscountAmount,
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
      const effectiveDiscountAmount =
        discountAmt > 0 ? discountAmt : discountByPercent; // Use amount or percentage

      const appliedDiscount =
        maxDiscount > 0
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

  const renderedCartItems = useMemo(() => {
    return <CartItem cartItems={cartItems} />;
  }, [cartItems]);

  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h3>Order Summary</h3>
        <p>Review items in your cart.</p>
      </div>
      <div
        className="summary"
        style={{
          height: 400,
          overflow: "hidden",
          flexGrow: 1,
          overflowY: "auto",
          padding: "16px",
          borderBottom: "1px solid #ddd",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div>
          <div>
            {cartItems?.length > 0 ? (
              renderedCartItems
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
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
        <div
          style={{ display: "flex", alignItems: "center", margin: "16px 0" }}
        >
          <label
            htmlFor="coupon"
            style={{ marginRight: "8px", fontWeight: "bold", fontSize: "14px" }}
          >
            Mã giảm giá:
          </label>
          <Select
            id="coupon"
            placeholder="Chọn mã giảm giá"
            style={{
              width: 350,
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onChange={handleCouponChange}
            value={selectedCoupon}
          >
            {vouchers.map((voucher) => {
              const {
                id,
                code,
                discountPercent,
                discountAmount,
                minPurchaseAmount,
                quantity,
              } = voucher;

              const discountInfo = [];

              if (discountPercent > 0) {
                discountInfo.push(`${discountPercent}%`);
              }
              if (discountAmount > 0) {
                discountInfo.push(`${discountAmount.toLocaleString()}đ`);
              }

              const isDisabled =
                subtotal < parseFloat(minPurchaseAmount) || quantity <= 0;

              return (
                <Option
                  key={id}
                  value={id}
                  disabled={isDisabled}
                  style={{
                    color: isDisabled ? "rgba(0, 0, 0, 0.4)" : "#333",
                    fontWeight: isDisabled ? "normal" : "bold",
                  }}
                >
                  {`${code} - ${discountInfo.join(", ")} ${
                    isDisabled
                      ? `(Tối thiểu: ${parseFloat(
                          minPurchaseAmount
                        ).toLocaleString()}đ${
                          quantity <= 0 ? ", Đã hết số lượng" : ""
                        })`
                      : ""
                  }`}
                </Option>
              );
            })}
          </Select>
          {selectedCoupon && (
            <Button
              onClick={clearCoupon}
              style={{
                marginLeft: "8px",
                color: "#ff4d4f", // Màu đỏ
                backgroundColor: "transparent",
                border: "1px solid #ff4d4f",
                borderRadius: "50%",
                padding: "0",
                width: "24px",
                height: "24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              className="close-coupon-btn"
            >
              <span style={{ fontWeight: "bold" }}>X</span>
            </Button>
          )}
        </div>

        <div
          style={{
            textAlign: "right",
            fontSize: "16px",
            lineHeight: "1.5",
            marginTop: "10px",
          }}
        >
          <div style={{ marginBottom: "8px", color: "#333" }}>
            <span style={{ fontWeight: "bold" }}>Subtotal:</span>
            <span style={{ marginLeft: "8px" }}>
              {formatCurrency(subtotal)}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div style={{ marginBottom: "8px", color: "#f5222d" }}>
              <span style={{ fontWeight: "bold" }}>Coupon Discount:</span>
              <span style={{ marginLeft: "8px" }}>
                - {formatCurrency(couponDiscount)}
              </span>
            </div>
          )}

          {totalPrice !== null && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "18px",
                color: "#1890ff",
                fontWeight: "bold",
              }}
            >
              <span>Total:</span>
              <span style={{ marginLeft: "8px" }}>
                {formatCurrency(totalPrice)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Summary;
