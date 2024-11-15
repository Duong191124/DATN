import React, { useState, useEffect, useCallback } from "react";
import { Button, message, notification } from "antd";
import CounterSalesProductDetail from "../component/layout/admin/counter.sale/counter.sale.product-detail";
import CounterSaleCart from "../component/layout/admin/counter.sale/counter.sale.cart";
import CounterSalePayment from "../component/layout/admin/counter.sale/counter.sale.payment";
import CounterSaleBillWaiting from "../component/layout/admin/counter.sale/counter.sale.order";
import moment from "moment";
import {
  createOrder,
  createPayment,
  fetchDataColorAPI,
  fetchDataSize,
  fetchPageDataProductDetail,
  fetchPendingOrders,
  findByProductDetailId,
  getAllCustomer,
  getUserInfo,
  updateProductDetailWithOrder,
  updateStatusOrder,
} from "../service/api.service";
import CounterSaleCustomer from "../component/layout/admin/counter.sale/counter.sale.customer";
import { useNavigate } from "react-router-dom";
const CounterSales = () => {
  const navigate = useNavigate();
  const [dataProductDetail, setDataProductDetail] = useState([]);
  const [billWaiting, setBillWaiting] = useState([]);
  const [tempBillItems, setTempBillItems] = useState([]);
  const [cartItemsByBill, setCartItemsByBill] = useState({});
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: "",
    amountPaid: 0,
    voucherId: null,
  });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountAfterDiscount, setTotalAmountAfterDiscount] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [size] = useState(10);
  const [totalProductDetail, setTotalProductDetail] = useState(0);
  const [pageProductDetail, setPageProductDetail] = useState(1);
  const [pageSizeProductDetail] = useState(10);
  const [dataColor, setDataColor] = useState([]);
  const [dataSize, setDataSize] = useState([]);
  const [filter, setFilter] = useState({
    productName: "",
    productCode: "",
    color: "",
    size: "",
    status: "",
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [staff, setStaff] = useState(null);
  useEffect(() => {
    loadStaff();
  }, []);
  const loadStaff = useCallback(async () => {
    const staffFromStorage = await getUserInfo();
    if (!staffFromStorage) {
      notification.error({ message: "Nhân viên chưa đăng nhập!" });
      return;
    }
    setStaff(staffFromStorage.data.data);
  }, []);
  const loadProductDetail = useCallback(
    async (pageProductDetail, pageSizeProductDetail) => {
      setLoading(true);
      try {
        const response = await fetchPageDataProductDetail(
          filter.productName,
          filter.productCode,
          filter.color,
          filter.size,
          filter.minPrice,
          filter.maxPrice,
          filter.status,
          pageProductDetail - 1,
          pageSizeProductDetail
        );
        if (response?.data?.data) {
          setDataProductDetail(response.data.data.content);
          setTotalProductDetail(
            response.data.data.totalPages * pageSizeProductDetail
          );
        }
      } catch (error) {
        console.error("Error loading product details", error);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );
  useEffect(() => {
    const loadData = async () => {
      // Kiểm tra xem liệu dữ liệu đã được tải chưa, nếu chưa thì mới gọi API
      if (!dataColor.length) {
        await loadColor();
      }
      if (!dataSize.length) {
        await loadSize();
      }
    };

    loadData();
  }, [dataColor, dataSize]); // Gọi lại chỉ khi dataColor hoặc dataSize thay đổi

  const loadColor = async () => {
    try {
      const response = await fetchDataColorAPI();
      if (response?.data?.data) {
        setDataColor(response.data.data);
      }
    } catch (error) {
      console.log("lỗi không thể hiển thị color", error);
      message.error("lỗi không thể tải color");
    }
  };
  const loadSize = async () => {
    try {
      const response = await fetchDataSize();
      if (response?.data?.data) {
        setDataSize(response.data.data);
      }
    } catch (error) {
      console.log("lỗi không thể hiển thị size", error);
      message.error("lỗi không thể tải size");
    }
  };
  const updateUrl = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      const hasFilters = Object.values(newFilters).some(
        (value) => value !== "" && value !== undefined
      );
      if (!hasFilters) {
        navigate("/counter-sales");
        return;
      }
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key] !== "" && newFilters[key] !== undefined) {
          params.append(key.trim(), newFilters[key]);
        }
      });
      params.append("page", pageProductDetail);
      params.append("limit", pageSizeProductDetail);
      navigate(`/counter-sales?${params.toString()}`);
    },
    [navigate, pageProductDetail, pageSizeProductDetail]
  );
  const updateFilter = useCallback(
    (key, value) => {
      const newFilters = { ...filter, [key]: value };
      setFilter(newFilters);
      updateUrl(newFilters);
    },
    [filter, updateUrl]
  );

  useEffect(() => {
    if (staff) {
      const staffId = staff.id;
      fetchPendingBills(staffId);
      // Lấy hóa đơn tạm từ localStorage
      const savedTempBills = localStorage.getItem(`tempBillItems_${staffId}`);
      setTempBillItems(savedTempBills ? JSON.parse(savedTempBills) : []);
      // Lấy giỏ hàng từ localStorage
      const savedCartItems = localStorage.getItem(`cartItemsByBill_${staffId}`);
      setCartItemsByBill(savedCartItems ? JSON.parse(savedCartItems) : {});
    }
  }, [staff]);
  const fetchPendingBills = async (staffId) => {
    try {
      const getBillWaiting = await fetchPendingOrders(staffId);
      if (getBillWaiting?.data?.data) {
        setBillWaiting(getBillWaiting.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn chờ:", error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      if (!customerList.length) {
        await loadCustomerList();
      }
    };
    loadData();
  }, [customerList]);

  const loadCustomerList = useCallback(async () => {
    try {
      const response = await getAllCustomer(1, 1000);
      if (response.data?.data) {
        const filteredCustomers = response.data.data.content.filter(
          (customer) => customer.name && customer.email && customer.phoneNumber
        );
        setCustomerList(filteredCustomers);
        setTotalCustomer(response.data.data.totalElements);
      }
    } catch (error) {
      console.error("Error loading customer list", error);
    }
  }, []);

  const calculateTotalAmount = useCallback(() => {
    if (!selectedBill || !cartItemsByBill[selectedBill]) {
      setTotalAmount(0);
      return;
    }

    const total = cartItemsByBill[selectedBill].reduce((acc, item) => {
      // Kiểm tra nếu sản phẩm có giá giảm
      const priceToUse =
        item.discountPrice > 0 ? item.discountPrice : item.defaultPrice;
      return acc + priceToUse * item.quantity;
    }, 0);

    setTotalAmount(total);
  }, [selectedBill, cartItemsByBill]);
  const updateCart = useCallback(
    (updatedItems) => {
      const newCart = { ...cartItemsByBill, [selectedBill]: updatedItems };
      setCartItemsByBill(newCart);
      localStorage.setItem("cartItemsByBill", JSON.stringify(newCart));
      calculateTotalAmount();
    },
    [cartItemsByBill, selectedBill, calculateTotalAmount]
  );
  const addToCart = useCallback(
    async (productDetailId, quantity) => {
      if (!selectedBill) {
        notification.error({ message: "Vui lòng chọn hóa đơn để mua hàng!" });
        return false;
      }
      const updatedItems = [...(cartItemsByBill[selectedBill] || [])];
      const existingItemIndex = updatedItems.findIndex(
        (item) => item.id === productDetailId.id
      );
      const countProductDetailId = await findByProductDetailId(
        productDetailId.id
      );
      if (existingItemIndex > -1) {
        const countQuantity = (updatedItems[existingItemIndex].quantity +=
          quantity);
        if (countQuantity > countProductDetailId.data.data.quantity) {
          notification.error({
            message: "Số lượng không đủ",
            description: `Sản phẩm trong kho không đủ.`,
          });
          return false;
        }
      } else {
        updatedItems.push({ ...productDetailId, quantity });
      }
      updateCart(updatedItems);
      return true;
    },
    [cartItemsByBill, selectedBill]
  );
  const onUpdateQuantity = (productDetailId, newQuantity) => {
    const updatedItems = cartItemsByBill[selectedBill].map((item) =>
      item.id === productDetailId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedItems);
  };
  const handleRemoveFromCart = (productDetailId) => {
    const updatedItems = cartItemsByBill[selectedBill].filter(
      (item) => item.id !== productDetailId
    );
    updateCart(updatedItems);
  };
  const generateInvoiceCode = () => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    return randomCode;
  };
  useEffect(() => {
    if (staff) {
      const staffId = staff.id;
      localStorage.setItem(
        `billWaiting_${staffId}`,
        JSON.stringify(billWaiting)
      );
      localStorage.setItem(
        `tempBillItems_${staffId}`,
        JSON.stringify(tempBillItems)
      );
      localStorage.setItem(
        `cartItemsByBill_${staffId}`,
        JSON.stringify(cartItemsByBill)
      );
    }
  }, [billWaiting, tempBillItems, cartItemsByBill, staff]);
  const handleCreateBillWaiting = useCallback(async () => {
    const defaultCustomerId = 1;
    const randomCode = generateInvoiceCode();
    const now = new Date();
    const customerId = selectedCustomer
      ? selectedCustomer.id
      : defaultCustomerId;
    const newBill = {
      code: `HD-${randomCode}`,
      customer: {
        id: customerId,
        name: selectedCustomer ? selectedCustomer.name : "Khách hàng lẻ",
      },
      staff: staff,
      time: now.toLocaleString(),
      orderDate: now.toISOString(),
    };
    const orderData = {
      code: newBill.code,
      deliveryFee: 0,
      totalAmount: totalAmount,
      moneyReceived: customerPaid,
      orderDate: moment().format("YYYY-MM-DD"),
      voucherId: "",
      staffId: staff.id,
      customerId: customerId,
      orderDetailRequests: [],
    };
    try {
      setLoading(true);
      if (billWaiting.length >= 5) {
        notification.error({
          message: "Đã đạt giới hạn tối đa 5 hóa đơn!",
          description: "Không thể tạo thêm hóa đơn khi đã có 5 hóa đơn chờ.",
        });
        return;
      }
      const response = await createOrder(
        orderData.code,
        orderData.orderDate,
        orderData.deliveryFee,
        orderData.totalAmount,
        orderData.moneyReceived,
        orderData.voucherId,
        orderData.staffId,
        orderData.customerId,
        orderData.orderDetailRequests
      );
      if (response.status === 201) {
        notification.success({
          message: "Hóa đơn đã được tạo thành công",
          description: `Hóa đơn đã được tạo bởi nhân viên ${staff.name}.`,
        });
        setBillWaiting((prevBills) => [...prevBills, response.data]);
      }
    } catch (error) {
      notification.error({
        message: "Tạo hóa đơn thất bại",
        description:
          error.response?.data.message ||
          "Đã có lỗi xảy ra trong quá trình tạo hóa đơn.",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, staff, customerPaid, totalAmount, billWaiting]);
  const canceledOrder = useCallback(
    async (orderId) => {
      const status = "cancelled"; // Set the status to cancelled
      if (!selectedBill) {
        notification.error({ message: "Vui lòng chọn hóa đơn để hủy!" });
        return;
      }
      try {
        setLoading(true);
        const response = await updateStatusOrder(orderId, status);
        if (response.status === 200) {
          // Handle success - update the bill waiting state and show success notification
          const updatedBillWaiting = billWaiting.filter(
            (bill) => bill.id !== orderId
          );
          setBillWaiting(updatedBillWaiting);
          notification.success({
            message: "Bỏ hóa đơn thành công",
            description: `Hóa đơn ${orderId} đã được bỏ.`,
          });
          setSelectedBill(null);
        }
      } catch (error) {
        // Handle error if the API call fails
        notification.error({
          message: "Hủy hóa đơn thất bại",
          description:
            error.response?.data.message ||
            "Đã có lỗi xảy ra trong quá trình hủy hóa đơn.",
        });
      } finally {
        setLoading(false);
      }
    },
    [selectedBill, billWaiting]
  );
  const handlePayment = useCallback(async () => {
    const cartItems = cartItemsByBill[selectedBill] || [];
    const billCode = billWaiting.find((bill) => bill.code === selectedBill);

    if (cartItems.length === 0) {
      notification.error({
        message: "Giỏ hàng rỗng",
        description: "Vui lòng chọn sản phẩm để mua trước khi thanh toán.",
      });
      return;
    }

    const { paymentMethod } = paymentInfo;
    if (!paymentMethod) {
      notification.error({
        message: "Thông tin thanh toán không đầy đủ",
        description: "Vui lòng chọn phương thức thanh toán.",
      });
      return;
    }
    // Prepare product details update
    const productDetailUpdateDTO = {
      orderDetailRequests: cartItems.map((item) => ({
        product_detail_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      voucherId: paymentInfo.voucherId,
      total: totalAmountAfterDiscount,
    };
    try {
      // Update order with product details and voucher (if provided)
      const orderResponse = await updateProductDetailWithOrder(
        billCode.id,
        productDetailUpdateDTO.orderDetailRequests,
        paymentInfo.voucherId,
        productDetailUpdateDTO.total
      );

      if (orderResponse.data.status === 201) {
        const paymentDTO = {
          paymentDate: moment().format("DD/MM/YYYY"),
          paymentMethod: paymentInfo.paymentMethod,
          orderId: orderResponse.data.data.id,
        };

        const paymentResponse = await createPayment(
          paymentDTO.paymentDate,
          paymentDTO.paymentMethod,
          paymentDTO.orderId
        );
        if (paymentResponse.status === 201) {
          setLoading(true);
          notification.success({
            message: "Thanh toán thành công",
            description: `Bạn đã thanh toán thành công`,
          });

          // Reset state and local storage
          setPaymentInfo({ paymentMethod: "", voucherId: null }); // Reset voucherId after payment
          setCustomerPaid(0);
          const updatedCartItems = { ...cartItemsByBill };
          setCartItemsByBill((prev) => {
            const updated = { ...prev };
            delete updated[selectedBill];
            return updated;
          });
          setBillWaiting(orderResponse.data.data);
          localStorage.setItem(
            "cartItemsByBill",
            JSON.stringify(updatedCartItems)
          );
          return { success: true, message: "Thanh toán thành công" };
        } else {
          throw new Error("Payment failed");
        }
      } else {
        throw new Error("Order update failed");
      }
    } catch (error) {
      console.log("Error:", error);
      notification.error({
        message: error.message || "Đã có lỗi xảy ra",
        description: "Có sự cố xảy ra trong quá trình thanh toán.",
      });
    } finally {
      setLoading(false);
    }
  }, [cartItemsByBill, selectedBill, totalAmount, customerPaid, paymentInfo]);

  useEffect(() => {
    const defaultFilters = {
      productName: "",
      productCode: "",
      color: "",
      size: "",
      status: "",
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilter(defaultFilters);
    updateUrl(defaultFilters);
  }, []);
  useEffect(() => {
    loadProductDetail(pageProductDetail, pageSizeProductDetail);
    calculateTotalAmount();
    if (staff) {
      fetchPendingBills(staff.id);
    }
  }, [
    selectedBill,
    cartItemsByBill,
    filter,
    pageProductDetail,
    pageSizeProductDetail,
    staff,
  ]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          backgroundColor: "#1890ff",
          alignItems: "center",
        }}
      >
        <div style={{ width: "15%", textAlign: "center" }}>
          <CounterSalesProductDetail
            dataProductDetail={dataProductDetail}
            onAddToCart={addToCart}
            selectedBill={selectedBill}
            filter={filter}
            setFilter={setFilter}
            page={pageProductDetail}
            total={totalProductDetail}
            size={pageSizeProductDetail}
            setPageProductDetail={setPageProductDetail}
            updateFilter={updateFilter}
            updateUrl={updateUrl}
            dataSize={dataSize}
            dataColor={dataColor}
          />
        </div>
        <div style={{ flex: "1" }}>
          <CounterSaleBillWaiting
            billItems={billWaiting || []}
            tempBillItems={tempBillItems}
            onSelectBill={setSelectedBill}
            selectedBill={selectedBill}
            setSelectedBill={setSelectedBill}
            canceledOrder={canceledOrder}
            handleCreateBillWaiting={handleCreateBillWaiting}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: "0 30px",
        }}
      >
        <div style={{ width: "70%" }}>
          <CounterSaleCart
            cartItems={cartItemsByBill[selectedBill] || []}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            dataProductDetail={dataProductDetail}
          />
        </div>
        <div
          style={{
            width: "30%",
            backgroundColor: "#ddd",
            padding: "15px",
            minHeight: "520px",
            overflowY: "auto",
          }}
        >
          <CounterSaleCustomer
            onCustomerSelect={(customer) => setSelectedCustomer(customer)}
            customerList={customerList}
            setCustomerList={setCustomerList}
            loadCustomerList={loadCustomerList}
            page={page}
            total={totalCustomer}
            size={size}
            setPage={setPage}
          />
          <CounterSalePayment
            totalAmount={totalAmount}
            setTotalAmount={setTotalAmount}
            totalAmountAfterDiscount={totalAmountAfterDiscount}
            setTotalAmountAfterDiscount={setTotalAmountAfterDiscount}
            onPayment={handlePayment}
            paymentInfo={paymentInfo}
            selectedBill={selectedBill}
            setSelectedBill={setSelectedBill}
            billWaiting={billWaiting}
            cartItems={cartItemsByBill[selectedBill] || []}
            setPaymentInfo={setPaymentInfo}
            customerPaid={customerPaid}
            setCustomerPaid={setCustomerPaid}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CounterSales;
