import React, { createContext, useState, useContext } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(null);
  const [provinces, setProvinces] = useState(0);
  const [district, setDistrict] = useState(null);
  const [fromDistrict, setFromDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [weight, setWeight] = useState(0);
  const [serviceId, setServiceId] = useState(0);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [totalPriceAll, setTotalPriceAll] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectAddress, setSelectAddress] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [shippingData, setShippingData] = useState(null);
  const resetCheckoutContext = () => {
    setSelectedCoupon(null);
    setCouponDiscount(0);
    setTotalPrice(null);
    setTotalShippingFee(0);
    setTotalPriceAll(0);
    setSelectAddress(null);
    setSelectedOption("");
    setShippingData(null);
  };

  const resetGhnTotalPrice = () => {
    setTotalShippingFee(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <CheckoutContext.Provider
      value={{
        formatCurrency,
        provinces,
        setProvinces,
        addresses,
        setAddresses,
        district,
        setDistrict,
        fromDistrict,
        setFromDistrict,
        ward,
        setWard,
        weight,
        setWeight,
        serviceId,
        setServiceId,
        totalShippingFee,
        setTotalShippingFee,
        totalPriceAll,
        setTotalPriceAll,
        selectedCoupon,
        setSelectedCoupon,
        couponDiscount,
        setCouponDiscount,
        totalPrice,
        setTotalPrice,
        resetCheckoutContext,
        resetGhnTotalPrice,
        selectAddress,
        setSelectAddress,
        selectedOption,
        setSelectedOption,
        shippingData,
        setShippingData
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
