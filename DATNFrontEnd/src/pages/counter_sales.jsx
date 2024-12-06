import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Dropdown,
  Menu,
  message,
  notification,
  Spin,
  Tour,
} from "antd";
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
import { NavLink, useNavigate } from "react-router-dom";
import { LoadingOutlined, MenuOutlined } from "@ant-design/icons";
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
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalProductDetail, setTotalProductDetail] = useState(0);
  const [pageProductDetail, setPageProductDetail] = useState(1);
  const [pageSizeProductDetail] = useState(5);
  const [dataColor, setDataColor] = useState([]);
  const [dataSize, setDataSize] = useState([]);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [filter, setFilter] = useState({
    productName: "",
    productCode: "",
    color: "",
    size: "",
    weightName: "",
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
      notification.warning({
        message: "Nhân viên",
        description: "Nhân viên chưa đăng nhập",
        duration: 2,
        placement: "bottomLeft",
      });
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
          filter.weightName,
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
        message.error("Không thể load sản phẩm");
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
      console.error("lỗi không thể hiển thị size", error);
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
      message.error("Không load được khách hàng");
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
        message.warning("Vui lòng chọn hóa đơn để mua hàng!");
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
        const currentQuantity = updatedItems[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantity;
        if (newQuantity > countProductDetailId.data.data.quantity) {
          notification.warning({
            message: "Số lượng không đủ",
            description: `Sản phẩm trong kho không đủ.`,
            duration: 2,
            placement: "bottomLeft",
          });
          return false;
        }
        updatedItems[existingItemIndex].quantity = newQuantity;
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
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const creatingRef = useRef(false); // Dùng để theo dõi trạng thái tạo hóa đơn

  const handleCreateBillWaiting = useCallback(async () => {
    if (creatingRef.current) return; // Nếu đang tạo hóa đơn, không thực hiện tiếp

    creatingRef.current = true; // Đánh dấu là đang tạo hóa đơn
    setIsCreatingBill(true); // Đặt trạng thái đang tạo hóa đơn

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

    setLoading(true);
    try {
      // Kiểm tra số lượng hóa đơn tối đa
      if (billWaiting.length >= 5) {
        notification.warning({
          message: "Giới hạn số lượng",
          description: "Đã đạt giới hạn tối đa 5 hóa đơn!",
          duration: 2,
          placement: "bottomLeft",
        });
        return;
      }

      // Kiểm tra sự tồn tại của hóa đơn trong billWaiting
      const isBillExist = billWaiting.some(
        (bill) => bill.code === newBill.code
      );
      if (isBillExist) {
        notification.warning({
          message: "Hóa đơn đã tồn tại",
          description: "Mã hóa đơn đã được tạo trước đó.",
          duration: 2,
          placement: "bottomLeft",
        });
        setLoading(false);
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
        const newBill = response.data;
        setBillWaiting((prevBills) => {
          return [...prevBills, newBill]; // Thêm hóa đơn mới vào danh sách
        });

        // Cập nhật trạng thái `selectedBill` và `activeTab` ngay sau khi tạo hóa đơn
        setSelectedBill(newBill.code);
        setActiveTab(newBill.code);
      }
    } catch (error) {
      notification.error({
        message: "Tạo hóa đơn thất bại",
        description:
          error.response?.data.message ||
          "Đã có lỗi xảy ra trong quá trình tạo hóa đơn.",
        duration: 2,
        placement: "bottomLeft",
      });
    } finally {
      setLoading(false);
      creatingRef.current = false; // Đặt lại trạng thái khi đã hoàn tất
      setIsCreatingBill(false); // Đặt lại trạng thái
    }
  }, [selectedCustomer, staff, customerPaid, totalAmount, billWaiting]);

  const canceledOrder = useCallback(
    async (orderId, note) => {
      const status = "cancelled";
      if (!selectedBill) {
        notification.info({
          message: "Chọn hóa đơn",
          description: "Vui lòng chọn hóa đơn để hủy!",
          duration: 2,
          placement: "bottomLeft",
        });
        return;
      }
      try {
        setLoading(true);
        const response = await updateStatusOrder(orderId, status, note);
        if (response.status === 200) {
          // Handle success - update the bill waiting state and show success notification
          const updatedBillWaiting = billWaiting.filter(
            (bill) => bill.id !== orderId
          );
          setBillWaiting(updatedBillWaiting);
          notification.info({
            message: "Bỏ hóa đơn thành công",
            description: `Hóa đơn ${selectedBill} đã được bỏ.`,
            placement: "bottomLeft",
          });
          setSelectedBill(null);
        }
      } catch (error) {
        // Handle error if the API call fails
        notification.warning({
          message: "Hủy hóa đơn thất bại",
          description:
            error.response?.data.message ||
            "Đã có lỗi xảy ra trong quá trình hủy hóa đơn.",
          placement: "bottomLeft",
        });
      } finally {
        setLoading(false);
      }
    },
    [selectedBill, billWaiting]
  );
  const validateCartItems = () => {
    if (!selectedBill) {
      return { success: false, message: "Thanh toán thất bại" };
    }
    const cartItems = cartItemsByBill[selectedBill] || [];
    if (cartItems.length === 0) {
      return {
        success: false,
        message: "Vui lòng chọn sản phẩm để mua trước khi thanh toán.",
      };
    }
    const { paymentMethod } = paymentInfo;
    if (!paymentMethod || paymentMethod === undefined) {
      return {
        success: false,
        message: "Vui lòng chọn phương thức thanh toán.",
      };
    }
    return true;
  };
  const handleVNPPayment = async (orderResponse, paymentDTO) => {
    const vnPayResponse = await createPayment(
      paymentDTO.paymentDate,
      paymentDTO.paymentMethod,
      paymentDTO.orderId
    );
    if (vnPayResponse.status === 201) {
      window.location.href = vnPayResponse.data.paymentUrl;
      setBillWaiting(orderResponse.data.data);
      updateCartItemsAndBillAfterPaymentSuccess();
      return {
        success: true,
        message: "Thanh toán thành công qua VNPAY",
      };
    }
  };
  const handleNormalPayment = async (orderResponse, paymentDTO) => {
    const paymentResponse = await createPayment(
      paymentDTO.paymentDate,
      paymentDTO.paymentMethod,
      paymentDTO.orderId
    );
    if (paymentResponse.status === 201) {
      message.success({
        message: "Thanh toán thành công",
        description: `Bạn đã thanh toán thành công`,
        placement: "bottomLeft",
      });
      setBillWaiting(orderResponse.data.data);
      updateCartItemsAndBillAfterPaymentSuccess();
      return { success: true, message: "Thanh toán thành công" };
    }
  };

  const handlePayment = useCallback(async () => {
    if (!validateCartItems()) return;
    const cartItems = cartItemsByBill[selectedBill] || [];
    const billCode = billWaiting.find((bill) => bill.code === selectedBill);
    if (billCode === undefined) {
      return { success: false, message: "Vui lòng tạo hoặc chọn hóa đơn" };
    }
    if (cartItems.length === 0) {
      return {
        success: false,
        message: "Vui lòng chọn sản phẩm để mua trước khi thanh toán.",
      };
    }
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
        if (
          paymentDTO.paymentMethod === undefined ||
          !paymentDTO.paymentMethod
        ) {
          return {
            success: false,
            message: "Vui lòng chọn phương thức thanh toán.",
          };
        }
        if (paymentInfo.paymentMethod === "VNP") {
          await handleVNPPayment(orderResponse, paymentDTO);
          return { success: true, message: "Thanh toán thành công" };
        } else {
          await handleNormalPayment(orderResponse, paymentDTO);
          return { success: true, message: "Thanh toán thành công" };
        }
      }
    } catch (error) {
      notification.error({
        message: error.message || "Đã có lỗi xảy ra",
        description: "Có sự cố xảy ra trong quá trình thanh toán.",
        duration: 2,
        placement: "bottomLeft",
      });
    }
  }, [
    cartItemsByBill,
    selectedBill,
    totalAmountAfterDiscount,
    paymentInfo,
    billWaiting,
  ]);

  const updateCartItemsAndBillAfterPaymentSuccess = () => {
    setPaymentInfo({ paymentMethod: "", voucherId: null });
    setCustomerPaid(0);
    setTotalAmount(0);
    setTotalAmountAfterDiscount(0);
    const updatedCartItems = { ...cartItemsByBill };
    setCartItemsByBill((prev) => {
      const updated = { ...prev };
      delete updated[selectedBill];
      return updated;
    });
    setSelectedBill(null);
    localStorage.setItem("cartItemsByBill", JSON.stringify(updatedCartItems));
  };
  const billWaitingArray = Array.from(billWaiting || []);
  const billCode = billWaitingArray.find((bill) => bill.code === selectedBill);
  useEffect(() => {
    const defaultFilters = {
      productName: "",
      productCode: "",
      color: "",
      size: "",
      status: "",
      weightName: "",
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
    cartItemsByBill,
    filter,
    pageProductDetail,
    pageSizeProductDetail,
    staff,
  ]);
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <NavLink to="/admin" style={{ display: "block", padding: "10px 0" }}>
          Quay về trang quản lý
        </NavLink>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    if (staff) {
      const tourKey = `hasSeenTour_${staff.id}`;
      const hasSeenTour = localStorage.getItem(tourKey);
      if (!hasSeenTour) {
        setIsTourOpen(true);
      }
    }
  }, [staff]);
  const handleCloseTour = () => {
    if (staff) {
      const tourKey = `hasSeenTour_${staff.id}`;
      localStorage.setItem(tourKey, "true");
    }
    setIsTourOpen(false);
    notification.success({ message: "Hướng dẫn hoàn tất!" });
  };
  const steps = [
    {
      title: "Tìm kiếm",
      description: "Tìm kiếm khách hàng",
      target: () => document.getElementById("customer"),
    },
    {
      title: "Tạo hóa đơn",
      description: "Nhấn tạo hóa đơn",
      target: () => document.getElementById("created-bill"),
    },
    {
      title: "Chọn hóa đơn",
      description: "Chọn hóa đơn để mua hàng",
      target: () => document.getElementById("selected-bill"),
    },
    {
      title: "Chọn sản phẩm",
      description: "Chọn sản phẩm thêm sản phẩm muốn mua",
      target: () => document.getElementById("product"),
    },
    {
      title: "Nhấn thanh toán",
      description: "Nhấn thanh toán để mua hàng",
      target: () => document.getElementById("buy"),
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#EDEEF1",
      }}
    >
      <Tour open={isTourOpen} onClose={handleCloseTour} steps={steps} />
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
            setBillItems={setBillWaiting}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            loading={loading}
            isCreatingBill={isCreatingBill}
          />
        </div>
        <div style={{ textAlign: "end", marginRight: "35px" }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="primary" icon={<MenuOutlined />} />
          </Dropdown>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          padding: "10px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "69%" }}>
          <CounterSaleCart
            cartItems={cartItemsByBill[selectedBill] || []}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            dataProductDetail={dataProductDetail}
          />
          <div style={{ textAlign: "center" }}>
            {loading && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            )}
          </div>
        </div>
        <div
          style={{
            width: "30%",
            backgroundColor: "#fff",
            padding: "15px",
            minHeight: "600px",
            overflowY: "auto",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {selectedBill && (
            <div
              style={{
                display: "flex",
                fontSize: "16px",
                fontWeight: "500", // Đậm chữ
                color: "#333", // Màu chữ tối cho dễ đọc
                lineHeight: "1.5", // Khoảng cách dòng dễ đọc
                backgroundColor: "#f9f9f9", // Màu nền nhẹ để làm nổi bật
                padding: "10px", // Khoảng cách giữa nội dung và viền
                borderRadius: "5px", // Viền bo tròn nhẹ nhàng
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng nhẹ
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Khách hàng:
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "0 5px",
                }}
              >
                {billCode?.customerResponse?.name}
              </span>
              - Nhân viên:
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "0 5px",
                }}
              >
                {staff?.name}
              </span>
            </div>
          )}
          <CounterSaleCustomer
            onCustomerSelect={(customer) => setSelectedCustomer(customer)}
            customerList={customerList}
            setCustomerList={setCustomerList}
            loadCustomerList={loadCustomerList}
            page={page}
            total={totalCustomer}
            size={size}
            setPage={setPage}
            selectedBill={selectedBill}
            billWaiting={billWaiting}
            setBillWaiting={setBillWaiting}
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
          />
        </div>
      </div>
    </div>
  );
};

export default CounterSales;
