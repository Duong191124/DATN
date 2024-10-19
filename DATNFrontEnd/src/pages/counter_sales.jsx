import React, { useState, useEffect } from "react";
import { Button, notification } from "antd";
import CounterSalesProductDetail from "../component/layout/admin/counter.sale/counter.sale.product-detail";
import CounterSaleCart from "../component/layout/admin/counter.sale/counter.sale.cart";
import CounterSalePayment from "../component/layout/admin/counter.sale/counter.sale.payment";
import CounterSaleBillWaiting from "../component/layout/admin/counter.sale/counter.sale.order";
import CounterSaleStaff from "../component/layout/admin/counter.sale/order.sale.staff";
import moment from "moment";
import {
  createOrder,
  createPayment,
  getAllStaff,
  orderProductDetail,
  orderStaff,
} from "../service/api.service";


const CounterSales = () => {
  const [dataProductDetail, setDataProductDetail] = useState([]);
  const [billWaiting, setBillWaiting] = useState(() => {
    const savedBillWaiting = localStorage.getItem("billWaiting");
    return savedBillWaiting ? JSON.parse(savedBillWaiting) : [];
  });
  const [cartItemsByBill, setCartItemsByBill] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItemsByBill");
    return savedCartItems ? JSON.parse(savedCartItems) : {};
  });
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    customerName: "",
    address: "",
    paymentMethod: "",
    amountPaid: 0,
  });
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const [total, setTotal] = useState(0); // Tổng số nhân viên
  const [page, setPage] = useState(1); // Trang hiện tại
  const [size] = useState(10);
  useEffect(() => {
    loadProductDetail();
    calculateTotalAmount();
    loadStaffList(page, size);
  }, [selectedBill, cartItemsByBill, discountAmount, page, size]);

  const loadProductDetail = async () => {
    try {
      const response = await orderProductDetail();
      if (response.data) {
        setDataProductDetail(response.data);
      }
      console.log("check", response)
    } catch (error) {
      console.error("Error loading product details", error);
    }
  };
  const updateProductDetailQuantities = async () => {
    try {
      const response = await orderProductDetail();
      if (response.data) {
        setDataProductDetail(response.data);
      }
    } catch (error) {
      console.error("Error updating product details", error);
    }
  };
  const loadStaffList = async (page = 1, size = 10) => {
    try {
      const response = await getAllStaff(page, size);
      console.log(response);
      if (response.data?.data) {
        setStaffList(response.data.data.content); // Lưu danh sách nhân viên vào state
        setTotal(response.data.data.totalElements); // Lưu tổng số nhân viên (để phân trang)
      }
    } catch (error) {
      console.error("Error loading staff list", error);
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedBill || !cartItemsByBill[selectedBill]) {
      setTotalAmount(0);
      return;
    }

    const total = cartItemsByBill[selectedBill].reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };
  const updateCart = (updatedItems) => {
    const newCart = { ...cartItemsByBill, [selectedBill]: updatedItems };
    setCartItemsByBill(newCart);
    localStorage.setItem("cartItemsByBill", JSON.stringify(newCart));
    calculateTotalAmount();
  };
  const addToCart = (productDetailId, quantity) => {
    if (!selectedBill) {
      notification.error({ message: "Vui lòng chọn hóa đơn để mua hàng!" });
      return;
    }
    const updatedItems = [...(cartItemsByBill[selectedBill] || [])];
    const existingItemIndex = updatedItems.findIndex(
      (item) => item.id === productDetailId.id
    );
    if (existingItemIndex > -1) {
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      updatedItems.push({ ...productDetailId, quantity });
    }
    updateCart(updatedItems);
  };
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
  const handleCreateBillWaiting = () => {
    if (!selectedStaff) {
      notification.error({ message: "Chưa chọn nhân viên!" });
      return;
    }

    if (billWaiting.length >= 5) {
      notification.error({
        message: "Đã đạt giới hạn tối đa 5 hóa đơn!",
        description: "Không thể tạo thêm hóa đơn khi đã có 5 hóa đơn chờ.",
      });
      return;
    }
    const randomCode = generateInvoiceCode();
    const now = new Date();
    const newBill = {
      billId: `HD-${randomCode}`,
      staff: selectedStaff,
      time: now.toLocaleString(),
      orderDate: now.toISOString(),
    };

    const updatedBillWaiting = [...billWaiting, newBill];
    setBillWaiting(updatedBillWaiting);
    localStorage.setItem("billWaiting", JSON.stringify(updatedBillWaiting));

    const newCart = { ...cartItemsByBill, [newBill.billId]: [] };
    setCartItemsByBill(newCart);
    localStorage.setItem("cartItemsByBill", JSON.stringify(newCart));

    notification.success({
      message: "Hóa đơn chờ đã được tạo thành công",
      description: `Hóa đơn chờ đã được tạo bởi nhân viên ${selectedStaff.name}.`,
    });
  };
  const handleBillSelect = (billId) => {
    setSelectedBill((prevSelectedBill) =>
      prevSelectedBill === billId ? null : billId
    );
  };
  const handlePayment = async () => {
    const cartItems = cartItemsByBill[selectedBill] || [];
    const billCode = billWaiting.find((bill) => bill.billId === selectedBill);
    if (cartItems.length === 0) {
      notification.error({
        message: "Giỏ hàng rỗng",
        description: "Vui lòng chọn sản phẩm để mua trước khi thanh toán.",
      });
      return;
    }
    // Kiểm tra thông tin thanh toán
    const { customerName, address, paymentMethod } = paymentInfo;
    if (!customerName || !address || !paymentMethod) {
      notification.error({
        message: "Thông tin thanh toán không đầy đủ",
        description:
          "Vui lòng điền đầy đủ tên, địa chỉ và phương thức thanh toán.",
      });
      return;
    }
    const totalAmountWithDiscount = totalAmount - discountAmount;
    // Kiểm tra số tiền khách đưa
    if (customerPaid < totalAmountWithDiscount) {
      notification.error({
        message: "Thanh toán không đủ",
        description: `Vui lòng nhập đủ tiền. Tổng tiền cần thanh toán là ${totalAmountWithDiscount.toLocaleString()} VNĐ.`,
      });
      return;
    }
    const excessAmount = customerPaid - totalAmountWithDiscount;
    // Chuẩn bị dữ liệu gửi lên backend
    const isoString = billCode.orderDate; // Giả sử đây là chuỗi ISO từ backend
    const orderDate = new Date(isoString);

    // Hàm để chuyển đổi ngày thành chuỗi định dạng yyyy-MM-dd
    const formatDateToYMD = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedOrderDate = formatDateToYMD(orderDate);
    const orderDTO = {
      code: billCode.billId,
      deliveryFee: 0,
      totalAmount: totalAmountWithDiscount,
      moneyReceived: customerPaid,
      orderDate: formattedOrderDate,
      voucherId: null,
      staffId: billCode.staff.id,
      orderDetailRequests: cartItems.map((item) => ({
        product_detail_id: item.id,
        quantity: item.quantity,
      })),
    };
    try {
      setLoading(true);
      const orderResponse = await createOrder(
        orderDTO.code,
        orderDTO.orderDate,
        orderDTO.deliveryFee,
        orderDTO.totalAmount,
        orderDTO.moneyReceived,
        orderDTO.voucherId,
        orderDTO.staffId,
        orderDTO.orderDetailRequests
      );
      console.log("dfadf", orderResponse.status);
      if (orderResponse.status === 201) {
        const paymentDTO = {
          paymentDate: moment().format("DD/MM/YYYY"),
          paymentMethod: paymentInfo.paymentMethod,
          orderId: orderResponse.data.id,
        };
        console.log("payment dto", paymentDTO);
        const paymentResponse = await createPayment(
          paymentDTO.paymentDate,
          paymentDTO.paymentMethod,
          paymentDTO.orderId
        );
        console.log("payment Response:", paymentResponse);
        if (paymentResponse.status === 201) {
          notification.success({
            message: "Thanh toán thành công",
            description: `Bạn đã thanh toán ${customerPaid.toLocaleString()} VNĐ. Tiền thừa là ${excessAmount.toLocaleString()} VNĐ.`,
          });
          // Reset thông tin thanh toán
          setPaymentInfo({
            customerName: "",
            address: "",
            paymentMethod: "",
          });
          // Call back cho component con
          setCustomerPaid(0); // Reset tiền khách đưa
          removeBillWithoutNotification(selectedBill);
          const updatedCartItems = { ...cartItemsByBill };
          delete updatedCartItems[selectedBill]; // Xóa giỏ hàng của hóa đơn đã thanh toán
          setCartItemsByBill(updatedCartItems);
          localStorage.setItem(
            "cartItemsByBill",
            JSON.stringify(updatedCartItems)
          );
          await updateProductDetailQuantities();
        }
      }
    } catch (error) {
      notification.error({
        message: "Thanh toán thất bại",
        description: "Đã có lỗi xảy ra trong quá trình thanh toán.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBill = (billId) => {
    const updatedBillWaiting = billWaiting.filter(
      (bill) => bill.billId !== billId
    );
    setBillWaiting(updatedBillWaiting);
    localStorage.setItem("billWaiting", JSON.stringify(updatedBillWaiting));
    notification.success({ message: "Hóa đơn đã được xóa" });
  };
  const removeBillWithoutNotification = (billId) => {
    const updatedBillWaiting = billWaiting.filter(
      (bill) => bill.billId !== billId
    );
    setBillWaiting(updatedBillWaiting);
    localStorage.setItem("billWaiting", JSON.stringify(updatedBillWaiting));
  };

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
            onRemoveBill={handleRemoveBill}
            onSelectBill={handleBillSelect}
            selectedBill={selectedBill}
          />
        </div>
        <div style={{ width: "48%", display: "flex", flexDirection: "column" }}>
          <CounterSaleStaff
            onStaffSelect={(staff) => setSelectedStaff(staff)}
            staffList={staffList}
            page={page}
            total={total}
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
        />
      </div>
    </div>
  );
};

export default CounterSales;
