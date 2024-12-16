import React, { useEffect, useState } from "react";
import { useCheckout } from "../context/checkout.context";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/cart.context";

const Payment = () => {
  const {
    totalPrice,
    totalShippingFee,
    totalPriceAll,
    setTotalPriceAll,
    formatCurrency,
    selectedOption,
    setSelectedOption,
    couponDiscount
  } = useCheckout();
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("i18nextLng") || "vi";
  const handleMinusTotalPrice = () => {
    const subTotal = totalPrice + totalShippingFee;
    setTotalPriceAll(subTotal);
  };

  const { cartItems } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, product) => {
      return (
        total +
        (product.discountPrice || product.defaultPrice) *
        (product.quantity || 1)
      );
    }, 0);
  };

  const totalProduct = calculateTotal();

  useEffect(() => {
    handleMinusTotalPrice();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h3>{t('MES-991')}</h3>
      </div>
      <div
        className="payment"
        style={{
          height: 450,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {/* VN Pay */}
            <div
              onClick={() => setSelectedOption("VNP")}
              style={{
                padding: "15px 20px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: selectedOption === "VNP" ? "#f9f9f9" : "#fff",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  marginRight: 10,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedOption === "VNP" ? "#000" : "#fff",
                }}
              >
                {selectedOption === "VNP" && (
                  <span style={{ color: "#fff" }}>✓</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <strong>VN Pay</strong>
                <p style={{ margin: 0, color: "#888" }}>
                  {t('MES-948')}
                </p>
              </div>
            </div>

            {/* Cash */}
            <div
              onClick={() => setSelectedOption("cod")}
              style={{
                padding: "15px 20px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: selectedOption === "cod" ? "#f9f9f9" : "#fff",
              }}
            >
              <div
                style={{
                  marginRight: 10,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedOption === "cod" ? "#000" : "#fff",
                }}
              >
                {selectedOption === "cod" && (
                  <span style={{ color: "#fff" }}>✓</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <strong>COD</strong>
                <p style={{ margin: 0, color: "#888" }}>
                  {t('MES-947')}
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right", paddingTop: 20, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <strong>{t('MES-941')}:</strong>
              <span style={{ fontSize: 24, marginLeft: 10 }}>
                {formatCurrency(totalProduct)}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div >
                <span style={{ fontWeight: "bold" }}>{t('MES-975')}:</span>
                <span style={{ marginLeft: "8px", color: "#f5222d" }}>
                  - {formatCurrency(couponDiscount)}
                </span>
              </div>
            )}
            {totalShippingFee > 0 && (
              <div>
                <span style={{ fontWeight: "bold" }}>{t('MES-946')}:</span>
                <span style={{ marginLeft: "8px", color:"green" }}>
                  + {formatCurrency(totalShippingFee)}
                </span>
              </div>
            )}
            <div>
              <strong>{t('MES-993')}:</strong>
              <span style={{ fontSize: 24, marginLeft: 10 }}>
                {formatCurrency(totalPriceAll)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
