import React, { useEffect, useState } from "react";
import { useCheckout } from "../context/checkout.context";

const Payment = () => {
  const {
    totalPrice,
    totalShippingFee,
    totalPriceAll,
    setTotalPriceAll,
    formatCurrency,
    selectedOption,
    setSelectedOption,
  } = useCheckout();
  const handleMinusTotalPrice = () => {
    const subTotal = totalPrice + totalShippingFee;
    setTotalPriceAll(subTotal);
  };

  useEffect(() => {
    handleMinusTotalPrice();
  }, []);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h3>Payment</h3>
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
                  Pay securely through VN Pay.
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
                  Pay with cash upon delivery.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right", paddingTop: 20 }}>
            {totalShippingFee > 0 && (
              <div style={{ marginBottom: "8px", color: "#f5222d" }}>
                <span style={{ fontWeight: "bold" }}>Total Shipping:</span>
                <span style={{ marginLeft: "8px" }}>
                  + {formatCurrency(totalShippingFee)}
                </span>
              </div>
            )}
            <strong>Total:</strong>
            <span style={{ fontSize: 24, marginLeft: 10 }}>
              {formatCurrency(totalPriceAll)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
