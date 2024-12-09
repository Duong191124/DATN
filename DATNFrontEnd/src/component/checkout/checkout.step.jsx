import React, { useEffect, useState } from "react";
import { Button, message, notification, Steps, theme } from "antd";
import "./checkout.style.css";
import Summary from "./checkout.summary";
import Payment from "./checkout.payment";
import Shipping from "./checkout.shipping";
import {
  createOrderForOnline,
  createPayment,
  getCreateOrderGhn,
  getShippingFee,
  getVouchersByCustomerId,
  hasCustomerUsedVoucher,
} from "../../service/api.service";
import { useCart } from "../context/cart.context";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../context/checkout.context";
import moment from "moment";
import { data } from "framer-motion/client";
import { useTranslation } from "react-i18next";

const CheckoutStep = () => {
  const { token } = theme.useToken();
  const { cartItems, setCartItems } = useCart();
  const {
    selectedCoupon,
    totalPriceAll,
    resetCheckoutContext,
    district,
    fromDistrict,
    ward,
    weight,
    serviceId,
    setTotalShippingFee,
    totalShippingFee,
    addresses,
    selectAddress,
    selectedOption,
    shippingData,
  } = useCheckout();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVoucher] = useState(null);
  const userId = localStorage.getItem("userId");
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("language") || "vi";

  const steps = [
    {
      title: t('MES-997'),
      content: <Summary />,
    },
    {
      title: t('MES-992'),
      content: <Shipping />,
    },
    {
      title: t('MES-991'),
      content: <Payment />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const convertCartToOrderDetails = (cartItemsLocal) => {
    return cartItemsLocal.map((item) => ({
      productDetailId: item.id,
      quantity: item.quantity,
      price: item.discountPrice || item.defaultPrice,
    }));
  };

  const convertSelectAddressToOrder = (selectAddress) => {
    if (selectAddress && typeof selectAddress === "object") {
      // Return only the selected fields
      return {
        name: selectAddress.name,
        phoneNumber: selectAddress.phoneNumber,
        city: selectAddress.city,
        district: selectAddress.district,
        ward: selectAddress.ward,
        addressDetail: selectAddress.addressDetail,
      };
    } else {
      console.error("selectAddress is either null or not an object");
      return null;
    }
  };

  const convertAddressToOrder = (shippingData) => {
    if (shippingData && typeof shippingData === "object") {
      // Return only the selected fields
      return {
        name: shippingData.name,
        phoneNumber: shippingData.phoneNumber,
        city: shippingData.toProvide,
        district: shippingData.toDistrict,
        ward: shippingData.toWard,
        addressDetail: shippingData.addressDetail,
        mail: shippingData?.email,
      };
    } else {
      console.error("selectAddress is either null or not an object");
      return null;
    }
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    setCartItems(items);
  }, [userId, setCartItems]);

  const generateInvoiceCode = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    return `HD-${randomCode}`;
  };
  const fetchVouchers = async () => {
    try {
      const response = await getVouchersByCustomerId(userId);
      setVoucher(response.data.data);
    } catch (error) {
      message.error(t('MES-990'));
    }
  };
  useEffect(() => {
    fetchVouchers();
  }, []);
  const checkVoucherUsage = async (customerId, voucherId) => {
    try {
      // Gọi API kiểm tra xem khách hàng đã sử dụng voucher chưa
      const response = await hasCustomerUsedVoucher(customerId, voucherId);

      // Kiểm tra dữ liệu trả về từ API, giả sử response.data chứa true/false
      if (response.data) {
        // Nếu khách hàng đã sử dụng voucher, trả về false
        return false;
      }
      // Nếu chưa sử dụng voucher, trả về true
      return true;
    } catch (error) {
      console.error("Error checking voucher usage:", error);
      // Nếu có lỗi, trả về false để ngừng quá trình
      return false;
    }
  };
  const confirmOrder = async () => {
    setLoading(true);
    // Kiểm tra voucher trước khi tạo đơn hàng
    const voucher = vouchers.find((v) => v.id === selectedCoupon);
    if (!voucher) {
      message.info(t('MES-989'));
      setLoading(false);
      return;
    }
    // Kiểm tra số lượng voucher còn lại
    if (voucher.quantity <= 0) {
      message.info(t('MES-988'));
      setLoading(false);
      return;
    }
    const isVoucherValid = await checkVoucherUsage(userId, selectedCoupon);
    if (!isVoucherValid) {
      message.info(t('MES-987'));
      setLoading(false);
      return; // Dừng quá trình tạo đơn hàng nếu voucher không hợp lệ
    }
    const cartItemsLocal = cartItems;
    const orderDetailRequests = convertCartToOrderDetails(cartItemsLocal);
    const addressToOrder = convertSelectAddressToOrder(selectAddress);
    const addressFormToOrder = convertAddressToOrder(shippingData);
    const changeAddress = userId === "1" ? addressFormToOrder : addressToOrder;
    const paymentMethod = selectedOption;

    const orderDTO = {
      code: generateInvoiceCode(), // Mã đơn hàng
      orderDate: new Date().toISOString().split("T")[0], // Ngày đặt hàng
      deliveryFee: totalShippingFee, // Phí vận chuyển
      totalAmount: totalPriceAll,
      moneyReceived: totalPriceAll,
      voucherId: selectedCoupon || null, // Mã giảm giá nếu có
      customerId: userId, // Lấy customerId từ localStorage hoặc session
      orderDetailRequests, // Dữ liệu sản phẩm trong đơn hàng
      changeAddress,
    };

    try {
      // Step 1: Create the order in your system
      const createOrderResponse = await createOrderForOnline(
        orderDTO.code,
        orderDTO.orderDate,
        orderDTO.deliveryFee,
        orderDTO.totalAmount,
        orderDTO.voucherId,
        orderDTO.customerId,
        orderDTO.moneyReceived,
        orderDTO.orderDetailRequests,
        orderDTO.changeAddress,
        orderDTO.mail
      );

      if (!createOrderResponse || createOrderResponse?.error) {
        throw new Error(createOrderResponse?.message);
      }

      const paymentDTO = {
        paymentDate: moment().format("DD/MM/YYYY"),
        paymentMethod: paymentMethod,
        orderId: createOrderResponse.data.data.id,
      };
      if (paymentMethod === "VNP") {
        await handleVNPPayment(paymentDTO);
      } else if (paymentMethod === "cod") {
        await handleNormalPayment(paymentDTO);
      } else {
        throw new Error("Invalid payment method selected");
      }
    } catch (error) {
      let errorMessage =
        error?.message || t('MES-985');

      if (error?.message?.includes("Insufficient stock")) {
        errorMessage = t('MES-986');
      }

      message.error(errorMessage);
      setLoading(false);
      return;
    }
  };

  const handleVNPPayment = async (paymentDTO) => {
    const vnPayResponse = await createPayment(
      paymentDTO.paymentDate,
      paymentDTO.paymentMethod,
      paymentDTO.orderId
    );
    if (vnPayResponse.status === 201) {
      window.location.href = vnPayResponse.data.paymentUrl;
      resetCheckoutContext();
      localStorage.removeItem(`cart_${userId}`);
      setCartItems([]);
      return {
        success: true,
        message: t('MES-984'),
      };
    }
  };
  const handleNormalPayment = async (paymentDTO) => {
    const paymentResponse = await createPayment(
      paymentDTO.paymentDate,
      paymentDTO.paymentMethod,
      paymentDTO.orderId
    );
    if (paymentResponse.status === 201) {
      resetCheckoutContext();
      localStorage.removeItem(`cart_${userId}`);
      setCartItems([]);
      localStorage.setItem("paymentStatus", "success");
      localStorage.setItem("paymentMessage", t('MES-983'));
      localStorage.setItem(
        "code",
        paymentResponse?.data?.orderDataPaymentResponse.code
      );
      navigate("/payments/payment-callback");
      setLoading(false);
      return {
        success: true,
        message: t('MES-983'),
      };
    } else {
      localStorage.setItem("paymentStatus", "failed");
      localStorage.setItem("paymentMessage", t('MES-982'));
      navigate("/payments/payment-callback"); // Redirect to callback page
      setLoading(false);
      return { success: false, message: t('MES-982') };
    }
  };

  const handleApiGhn = async () => {
    if (userId === "1") {
      const values = {
        fromDistrictId: 2004,
        toDistrictId: shippingData.toDistrict,
        toWardCode: shippingData.toWard,
        weight: weight,
        serviceId: 53321,
      };
      try {
        const fee = await getShippingFee(
          values.fromDistrictId,
          values.toDistrictId,
          values.toWardCode,
          values.weight,
          values.serviceId
        );
        setTotalShippingFee(fee.data.data.total);
      } catch (error) {
        let errorMessage =
          error?.response?.data?.message ||
          "Giao hàng nhanh không hỗ trợ xã này";

        // Cắt chuỗi để chỉ lấy phần từ "GHN" trở đi
        const ghnIndex = errorMessage.indexOf("Giao");
        if (ghnIndex !== -1) {
          errorMessage = errorMessage.substring(ghnIndex);
        }

        message.error(errorMessage);
      }
    } else {
      const values = {
        fromDistrictId: selectAddress.fromDistrict,
        toDistrictId: selectAddress.district,
        toWardCode: selectAddress.ward,
        weight: weight,
        serviceId: selectAddress.serviceId,
      };
      try {
        const res = await getShippingFee(
          values.fromDistrictId,
          values.toDistrictId,
          values.toWardCode,
          values.weight,
          values.serviceId
        );
        setTotalShippingFee(res.data.data.total);
      } catch (error) {
        let errorMessage =
          error?.response?.data?.message ||
          "Giao hàng nhanh không hỗ trợ xã này";

        // Cắt chuỗi để chỉ lấy phần từ "GHN" trở đi
        const ghnIndex = errorMessage.indexOf("Giao");
        if (ghnIndex !== -1) {
          errorMessage = errorMessage.substring(ghnIndex);
        }

        message.error(errorMessage);
      }
    }
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      <Steps
        current={current}
        items={items}
        style={{ color: "black" }} // Đặt màu chữ cho tiêu đề bước
        icon={<span style={{ color: "black" }} />} // Đặt màu icon thành đen
        className="step"
      />
      <div>
        {/* Pass the necessary props to Summary */}
        {steps[current].content}
      </div>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {current > 0 && (
          <Button
            style={{
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              fontSize: "14px",
              lineHeight: 1.5714285714285714,
              height: "50px",
              width: "100px",
              padding: "4px 15px",
              borderRadius: "6px",
            }}
            onClick={prev}
          >
            {t('MES-979')}
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={async () => {
              if (cartItems.length === 0) {
                notification.warning({
                  message: t('MES-981'),
                  duration: 2,
                });
                setCurrent(0);
                return;
              }
              if (current === 1) {
                if (
                  (userId !== "1" && selectAddress === null) ||
                  (userId === "1" && shippingData === null)
                ) {
                  message.error(t('MES-980'));
                  return;
                }
                await handleApiGhn();
              }
              next();
            }}
            style={{
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              fontSize: "14px",
              lineHeight: 1.5714285714285714,
              height: "50px",
              width: "100px",
              padding: "4px 15px",
              borderRadius: "6px",
            }}
          >
            {t('MES-978')}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            style={{
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              fontSize: "14px",
              lineHeight: 1.5714285714285714,
              height: "50px",
              width: "100px",
              padding: "4px 15px",
              borderRadius: "6px",
            }}
            type="primary"
            onClick={confirmOrder}
          >
            {t('MES-977')}
          </Button>
        )}
      </div>
    </>
  );
};

export default CheckoutStep;
