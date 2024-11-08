import React, { useState, useEffect, useCallback } from "react";
import { Button, notification } from "antd";
import CounterSalesProductDetail from "../component/layout/admin/counter.sale/counter.sale.product-detail";
import CounterSaleCart from "../component/layout/admin/counter.sale/counter.sale.cart";
import CounterSalePayment from "../component/layout/admin/counter.sale/counter.sale.payment";
import CounterSaleBillWaiting from "../component/layout/admin/counter.sale/counter.sale.order";
import moment from "moment";
import {
  createOrder,
  createPayment,
  fetchPageDataProductDetail,
  fetchPendingOrders,
  findByProductDetailId,
  getAllCustomer,
  getUserInfo,
  orderProductDetail,
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
  });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [customerList, setCustomerList] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [page, setPage] = useState(1); // Trang hiện tại
  const [size] = useState(10);
  const [totalProductDetail, setTotalProductDetail] = useState(0);
  const [pageProductDetail, setPageProductDetail] = useState(1);
  const [pageSizeProductDetail] = useState(10);
  const [filter, setFilter] = useState({
    productName: "",
    productCode: "",
    color: "",
    size: "",
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
  const updateUrl = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      const hasFilters = Object.values(newFilters).some(
        (value) => value !== "" && value !== undefined
      );
      if (!hasFilters) {
        navigate("/admin/counter-sales");
        return;
      }
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key] !== "" && newFilters[key] !== undefined) {
          params.append(key.trim(), newFilters[key]);
        }
      });
      params.append("page", page);
      params.append("limit", size);
      navigate(`/admin/counter-sales?${params.toString()}`);
    },
    [navigate, page, size]
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
      fetchPendingBills();
      // Lấy hóa đơn tạm từ localStorage
      const savedTempBills = localStorage.getItem(`tempBillItems_${staffId}`);
      setTempBillItems(savedTempBills ? JSON.parse(savedTempBills) : []);
      // Lấy giỏ hàng từ localStorage
      const savedCartItems = localStorage.getItem(`cartItemsByBill_${staffId}`);
      setCartItemsByBill(savedCartItems ? JSON.parse(savedCartItems) : {});
    }
  }, [staff]);
  const fetchPendingBills = async () => {
    try {
      const getBillWaiting = await fetchPendingOrders(staff.id);
      setBillWaiting(getBillWaiting.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn chờ:", error);
    }
  };
  const loadCustomerList = async () => {
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
  };
  const calculateTotalAmount = useCallback(() => {
    if (!selectedBill || !cartItemsByBill[selectedBill]) {
      setTotalAmount(0);
      return;
    }

    const total = cartItemsByBill[selectedBill].reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
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
            message: "Hủy hóa đơn thành công",
            description: `Hóa đơn ID: ${orderId} đã được hủy.`,
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
  const handleMoveBillToTemp = (code) => {
    const billToMove = billWaiting.find((bill) => bill.code === code);
    if (!billToMove) {
      notification.error({
        message: "Lỗi",
        description: `Không tìm thấy hóa đơn với mã ${code}.`,
      });
      return;
    }
    // Loại bỏ hóa đơn khỏi billWaiting và thêm vào tempBillItems
    setBillWaiting(billWaiting.filter((bill) => bill.code !== code));
    setTempBillItems([...tempBillItems, billToMove]);
    notification.success({
      message: "Chuyển hóa đơn thành công",
      description: `Hóa đơn ${code} đã được chuyển sang tạm chờ.`,
    });
  };
  // Hàm chuyển hóa đơn từ chờ sang tạm chờ
  const handleSwapBills = (tempBillId, waitingBillId) => {
    const tempBill = tempBillItems.find((bill) => bill.code === tempBillId);
    const waitingBill = billWaiting.find((bill) => bill.code === waitingBillId);
    if (tempBill && waitingBill) {
      // Logic hoán đổi
      const updatedTempBills = tempBillItems.map((bill) =>
        bill.code === tempBillId ? waitingBill : bill
      );
      const updatedBillItems = billWaiting.map((bill) =>
        bill.code === waitingBillId ? tempBill : bill
      );
      setTempBillItems(updatedTempBills);
      setBillWaiting(updatedBillItems);
      // Cập nhật localStorage
      localStorage.setItem("tempBillItems", JSON.stringify(updatedTempBills));
      localStorage.setItem("billItems", JSON.stringify(updatedBillItems));
    }
  };
  const handleMoveBillToWaiting = (code) => {
    if (billWaiting.length >= 5) {
      // Nếu danh sách chờ đã có 5 hóa đơn, không cho phép thêm
      notification.error({
        message: "Danh sách chờ đã đầy",
        description:
          "Không thể thêm hóa đơn vào danh sách chờ vì đã có 5 hóa đơn.",
      });
      return;
    }
    const billToMove = tempBillItems.find((bill) => bill.code === code);
    if (!billToMove) return;
    // Remove from tempBillItems and add to billWaiting
    setTempBillItems(tempBillItems.filter((bill) => bill.code !== code));
    setBillWaiting([...billWaiting, billToMove]);
    notification.success({
      message: "Chuyển hóa đơn thành công",
      description: `Hóa đơn ${code} đã được chuyển từ tạm chờ sang chờ.`,
    });
  };
  const handleRemoveBill = (code) => {
    const updatedBillWaiting = billWaiting.filter((bill) => bill.code !== code);
    setBillWaiting(updatedBillWaiting);
    localStorage.setItem("billWaiting", JSON.stringify(updatedBillWaiting));
    notification.success({ message: "Hóa đơn đã được xóa" });
  };
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
    const totalAmountWithDiscount = totalAmount - discountAmount;
    if (paymentMethod === "Cash" && customerPaid < totalAmountWithDiscount) {
      notification.error({
        message: "Thanh toán không đủ",
        description: `Vui lòng nhập đủ tiền. Tổng tiền cần thanh toán là ${totalAmountWithDiscount.toLocaleString()} VNĐ.`,
      });
      return;
    }
    // Chuẩn bị dữ liệu cho việc cập nhật chi tiết sản phẩm
    const productDetailUpdateDTO = {
      orderDetailRequests: Array.isArray(cartItems)
        ? cartItems.map((item) => ({
            product_detail_id: item.id,
            quantity: item.quantity,
          }))
        : [],
    };
    try {
      setLoading(true);
      // Gọi API để cập nhật chi tiết sản phẩm trong hóa đơn
      console.log(
        "dđ",
        billCode.id,
        productDetailUpdateDTO.orderDetailRequests
      );
      const orderResponse = await updateProductDetailWithOrder(
        billCode.id,
        productDetailUpdateDTO.orderDetailRequests
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
          await new Promise((resolve) => setTimeout(resolve, 2000));
          notification.success({
            message: "Thanh toán thành công",
            description: `Bạn đã thanh toán thành công`,
          });
          // Reset thông tin thanh toán
          setPaymentInfo({ paymentMethod: "" });
          setCustomerPaid(0); // Reset tiền khách đưa
          const updatedCartItems = { ...cartItemsByBill };
          delete updatedCartItems[selectedBill];
          setCartItemsByBill(updatedCartItems);
          localStorage.setItem(
            "cartItemsByBill",
            JSON.stringify(updatedCartItems)
          );
          return { success: true, message: "Thanh toán thành công" };
        }
      }
    } catch (error) {
      console.log("errr", error);
      notification.error({
        message: "Cập nhật chi tiết sản phẩm thất bại",
        description: "Đã có lỗi xảy ra trong quá trình cập nhật.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    cartItemsByBill,
    selectedBill,
    totalAmount,
    discountAmount,
    customerPaid,
    paymentInfo,
  ]);
  const handleMoveBillFromTempToWaiting = (code) => {
    const billToMove = tempBillItems.find((bill) => bill.code === code);
    if (!billToMove) return;
    // Remove from tempBillItems and add to billWaiting
    setTempBillItems(tempBillItems.filter((bill) => bill.code !== code));
    setBillWaiting([...billWaiting, billToMove]);
    notification.success({
      message: "Hóa đơn đã được lấy ra",
      description: `Hóa đơn ${code} đã được chuyển về hóa đơn chờ.`,
    });

    // Cập nhật localStorage
    localStorage.setItem(
      "tempBillItems",
      JSON.stringify(tempBillItems.filter((bill) => bill.code !== code))
    );
    localStorage.setItem(
      "billWaiting",
      JSON.stringify([...billWaiting, billToMove])
    );
  };
  useEffect(() => {
    const defaultFilters = {
      productName: "",
      productCode: "",
      color: "",
      size: "",
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilter(defaultFilters);
    updateUrl(defaultFilters);
  }, []);
  useEffect(() => {
    loadProductDetail(pageProductDetail, pageSizeProductDetail);
    calculateTotalAmount();
    loadCustomerList(page, size);
    fetchPendingBills();
  }, [
    selectedBill,
    cartItemsByBill,
    discountAmount,
    page,
    size,
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
        margin: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
        }}
      >
        <div style={{ width: "48%" }}>
          <CounterSaleBillWaiting
            billItems={billWaiting}
            tempBillItems={tempBillItems}
            onRemoveBill={handleRemoveBill}
            onSelectBill={setSelectedBill}
            selectedBill={selectedBill}
            onMoveBillToTemp={handleMoveBillToTemp}
            onSwapBills={handleSwapBills}
            setSelectedBill={setSelectedBill}
            onMoveBillFromTempToWaiting={handleMoveBillFromTempToWaiting}
            onMoveBillToWaiting={handleMoveBillToWaiting}
            canceledOrder={canceledOrder}
          />
        </div>
        <div style={{ width: "48%", display: "flex", flexDirection: "column" }}>
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
          <Button
            type="primary"
            onClick={handleCreateBillWaiting}
            style={{ marginTop: "20px" }}
          >
            Tạo Hóa Đơn
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
          margin: "20px 0",
        }}
      >
        <div style={{ width: "48%" }}>
          <CounterSaleCart
            cartItems={cartItemsByBill[selectedBill] || []}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </div>
        <div style={{ width: "48%" }}>
          <CounterSalePayment
            totalAmount={totalAmount}
            onPayment={handlePayment}
            paymentInfo={paymentInfo}
            discountAmount={discountAmount}
            selectedBill={selectedBill}
            billWaiting={billWaiting}
            cartItems={cartItemsByBill[selectedBill] || []}
            setPaymentInfo={setPaymentInfo}
            customerPaid={customerPaid}
            setCustomerPaid={setCustomerPaid}
            loading={loading}
          />
        </div>
      </div>
      <div style={{ width: "100%", padding: "10px" }}>
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
        />
      </div>
    </div>
  );
};

export default CounterSales;
