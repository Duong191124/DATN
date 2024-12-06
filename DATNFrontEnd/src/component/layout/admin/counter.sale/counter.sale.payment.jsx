import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Select,
  Modal,
  message,
  Drawer,
  Radio,
  notification,
} from "antd";
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";
import { PlusOutlined } from "@ant-design/icons";
import {
  getVouchersByCustomerId,
  hasCustomerUsedVoucher,
} from "../../../../service/api.service";
import { Option } from "antd/es/mentions";
import "./counter.sale.payment.voucher.css";
import { calc } from "antd/es/theme/internal";
const CounterSalePayment = ({
  onPayment,
  paymentInfo,
  setPaymentInfo,
  selectedBill,
  setSelectedBill,
  billWaiting,
  cartItems,
  customerPaid,
  setCustomerPaid,
  totalAmount,
  setTotalAmount,
  totalAmountAfterDiscount,
  setTotalAmountAfterDiscount,
}) => {
  const [change, setChange] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [invoiceContent, setInvoiceContent] = useState("");
  const [vouchers, setVoucher] = useState(null); // Lưu voucher đã chọn
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [voucherUsageStatus, setVoucherUsageStatus] = useState({});
  const [info, setInfo] = useState({});
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  useEffect(() => {
    if (selectedBill) {
      // Tính tổng tiền trước khi áp dụng voucher
      const newTotalAmount = cartItems.reduce((acc, item) => {
        const priceToUse =
          item.discountPrice > 0 ? item.discountPrice : item.defaultPrice;
        return acc + priceToUse * item.quantity;
      }, 0);
      setTotalAmount(newTotalAmount); // Cập nhật lại tổng tiền ban đầu
      if (selectedVoucher) {
        const maxDiscount = parseFloat(selectedVoucher.maxDiscountAmount); // Mức tối đa giảm giá
        // Kiểm tra voucher là giảm theo phần trăm hay số tiền
        if (
          selectedVoucher.discountPercent &&
          selectedVoucher.discountAmount === null
        ) {
          let discount = 0;
          // Tính giảm giá theo phần trăm
          discount = (newTotalAmount * selectedVoucher.discountPercent) / 100;
          // Áp dụng giới hạn giảm giá: tối thiểu và tối đa
          if (discount > maxDiscount) {
            discount = maxDiscount; // Áp dụng tối đa
          }
          const totalAmountWithDiscount = newTotalAmount - discount;
          setTotalAmountAfterDiscount(totalAmountWithDiscount);
          return;
        }
        if (
          selectedVoucher.discountAmount &&
          selectedVoucher.discountPercent === null
        ) {
          let discount = 0;
          discount = parseFloat(selectedVoucher.discountAmount);
          const totalAmountWithDiscount = newTotalAmount - discount;
          setTotalAmountAfterDiscount(totalAmountWithDiscount);
          return;
        }
      } else {
        // Nếu không có voucher, tổng tiền không thay đổi
        setTotalAmountAfterDiscount(newTotalAmount);
      }
    }
  }, [selectedBill, cartItems, selectedVoucher]);

  // Tính lại khi thay đổi hóa đơn, giỏ hàng hoặc voucher
  const openDrawer = () => {
    const billCode = billWaiting.find((bill) => bill.code === selectedBill);
    setInfo(billCode);
    setIsDrawerVisible(true);
  };
  const handleShowInvoice = async () => {
    const billCode = billWaiting.find((bill) => bill.code === selectedBill);
    const invoice = `
      <div id="invoice" style="font-family: Arial, sans-serif;">
       <div style="text-align:center;">
        <img src="/image/logo.jpg" alt="Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
       </div>
        <h2 style="text-align: center;">SPORT SHIRT</h2>
        <p style="text-align: center;">Địa chỉ: - -</p>
        <p style="text-align: center;">Điện thoại: 0999999999</p>
        <h2 style="text-align: center;">HÓA ĐƠN BÁN HÀNG</h2>
        <p>Số HĐ: ${billCode?.code}</p>
        <p>Ngày: ${new Date().toLocaleDateString()}</p>
        <p>Thời gian thanh toán: ${new Date().toLocaleTimeString()}</p>
        <p>Nhân viên: ${billCode?.staffResponse?.name}</p>
        <p>Khách hàng: ${billCode?.customerResponse?.name}</p>
        <p>SĐT: ${
          billCode?.customerResponse?.phoneNumber || "Chưa có số điên thoại"
        }</p>
        <p>Địa chỉ: ${
          billCode?.customerResponse?.address ||
          "Khách hàng chưa cập nhật địa chỉ"
        }</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px;">Tên sản phẩm</th>
              <th style="border: 1px solid #000; padding: 8px;">Số lượng</th>
              <th style="border: 1px solid #000; padding: 8px;">Màu sắc</th>
              <th style="border: 1px solid #000; padding: 8px;">Size</th>
              <th style="border: 1px solid #000; padding: 8px;">Đơn giá</th>
              <th style="border: 1px solid #000; padding: 8px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems
              .map(
                (item) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;align-item:center;text-align:center;">${
                  item.productResponse.name
                }</td>
                <td style="border: 1px solid #000; padding: 8px;align-item:center;text-align:center;">${
                  item.quantity
                }</td>
                <td style="border: 1px solid #000; padding: 8px;align-item:center;text-align:center;">${
                  item.color.name
                }</td>
                <td style="border: 1px solid #000; padding: 8px;align-item:center;text-align:center;">${
                  item.size.name
                }</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                  ${(item.discountPrice > 0
                    ? item.discountPrice
                    : item.defaultPrice
                  ).toLocaleString()} VNĐ
                </td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                  ${(
                    (item.discountPrice > 0
                      ? item.discountPrice
                      : item.defaultPrice) * item.quantity
                  ).toLocaleString()} VNĐ
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h4>Tổng tiền hàng: ${totalAmount.toLocaleString()} VNĐ</h4>
        <h4>Chiết khấu: 
            ${
              selectedVoucher
                ? (totalAmount - totalAmountAfterDiscount).toLocaleString()
                : "Không có chiết khấu"
            } VNĐ
          </h4>
        <h4>Tổng thanh toán: ${totalAmountAfterDiscount.toLocaleString()} VNĐ</h4>
        <p>(${totalAmountAfterDiscount.toLocaleString()} đồng chẵn)</p>

          <p style="text-align: center;">Thanh toán bằng tiền mặt</p>
          <p style="text-align: center;">Cảm ơn và hẹn gặp lại quý khách!</p>
      </div>
    `;
    setInvoiceContent(invoice);
    setIsInvoiceModalVisible(true);
  };
  const handlePrintInvoice = () => {
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>In hóa đơn</title>
          <style>
            body { font-family: Arial, sans-serif; }
            #invoice { text-align: center; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${invoiceContent}
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };
  const handleDownloadPDF = async () => {
    const invoiceElement = document.createElement("div");
    invoiceElement.innerHTML = invoiceContent;

    // Thiết lập các tùy chọn cho PDF
    const options = {
      margin: 1,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 }, // Tăng chất lượng ảnh
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }, // Định dạng giấy
    };

    // Tạo PDF
    html2pdf().from(invoiceElement).set(options).save();

    document.body.removeChild(invoiceElement);
  };
  const fetchVouchers = async (billCode) => {
    try {
      const response = await getVouchersByCustomerId(
        billCode.customerResponse.id
      );
      setVoucher(response.data.data);
    } catch (error) {
      message.error("Không thể tải voucher.");
    }
  };
  useEffect(() => {
    if (selectedBill) {
      const billCode = billWaiting.find((bill) => bill.code === selectedBill);
      if (billCode) {
        fetchVouchers(billCode); // Lấy voucher khi có hóa đơn đã chọn
        setInfo(billCode);
      } else {
        setVoucher([]);
      }
    } else {
      setVoucher([]); // Nếu không có hóa đơn chọn, reset voucher
    }
  }, [selectedBill, info]); // Chỉ phụ thuộc vào selectedBill và billWaiting

  // Hàm checkVoucherUsage có thể được gọi trong useEffect hoặc ngoài đó
  const checkVoucherUsage = async (customerId, voucherId) => {
    try {
      const response = await hasCustomerUsedVoucher(customerId, voucherId);
      setVoucherUsageStatus((prevStatus) => ({
        ...prevStatus,
        [voucherId]: response.data, // lưu trạng thái sử dụng voucher
      }));
    } catch (error) {
      console.error("Error checking voucher usage:", error);
    }
  };
  useEffect(() => {
    if (selectedBill && vouchers.length > 0) {
      const customerId = billWaiting.find((bill) => bill.code === selectedBill)
        ?.customerResponse.id;
      if (customerId) {
        // Kiểm tra trạng thái sử dụng voucher cho mỗi voucher
        vouchers.forEach((voucher) => {
          checkVoucherUsage(customerId, voucher.id);
        });
      }
    }
  }, [selectedBill, vouchers]); // Chỉ phụ thuộc vào vouchers và selectedBill
  const handleVoucherChange = async (value) => {
    const billCode = billWaiting.find((bill) => bill.code === selectedBill);
    if (value === null || value === "") {
      setSelectedVoucher(null);
      setTotalAmountAfterDiscount(totalAmount); // Đặt lại tổng tiền sau giảm giá
      setPaymentInfo({
        ...paymentInfo,
        voucherId: null, // Không có voucher
        amountPaid: 0, // Đặt lại số tiền đã trả
      });
    } else {
      const voucher = vouchers.find((v) => v.id === value);
      if (voucher) {
        const currentTime = new Date();
        const expirationTime = new Date(voucher.expirationDate);

        // Kiểm tra nếu voucher đã hết hạn
        if (currentTime > expirationTime) {
          notification.warning({
            message: "Voucher",
            description: `Voucher này đã hết hạn.`,
            placement: "bottomRight",
          });
          setSelectedVoucher(null);
          setTotalAmountAfterDiscount(totalAmount); // Đặt lại tổng tiền sau giảm giá
          setPaymentInfo({
            ...paymentInfo,
            voucherId: null, // Không có voucher
            amountPaid: 0, // Đặt lại số tiền đã trả
          });
          return;
        }
        // Kiểm tra nếu tổng tiền đủ điều kiện áp dụng voucher
        if (totalAmount < voucher.minPurchaseAmount) {
          notification.warning({
            message: "Voucher",
            description: `Voucher chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat(
              "vi-VN"
            ).format(voucher.minPurchaseAmount)} VND trở lên.`,
            duration: 2,
            placement: "bottomLeft",
          });

          setSelectedVoucher(null);
          setTotalAmountAfterDiscount(totalAmount); // Đặt lại tổng tiền sau giảm giá
          setPaymentInfo({
            ...paymentInfo,
            voucherId: null, // Không có voucher
            amountPaid: 0, // Đặt lại số tiền đã trả
          });
          return;
        }

        // Kiểm tra nếu khách hàng đã sử dụng voucher này rồi
        try {
          const response = await hasCustomerUsedVoucher(
            billCode.customerResponse.id,
            voucher.id
          );
          if (response.data) {
            notification.warning({
              message: "Voucher", // Tiêu đề thông báo
              description: `Bạn đã sử dụng voucher này rồi`, // Nội dung thông báo
              placement: "bottomRight", // Vị trí thông báo (có thể chọn 'topLeft', 'topRight', 'bottomLeft', 'bottomRight')
            });
            setSelectedVoucher(null);
            setTotalAmountAfterDiscount(totalAmount); // Đặt lại tổng tiền sau giảm giá
            setPaymentInfo({
              ...paymentInfo,
              voucherId: null, // Không có voucher
              amountPaid: 0, // Đặt lại số tiền đã trả
            });
            return;
          }
        } catch (error) {
          message.error("Không thể kiểm tra voucher.");
          return;
        }

        // Cập nhật voucher đã chọn
        setSelectedVoucher(voucher);
        let discount = 0;

        // Tính giảm giá theo phần trăm
        if (voucher.discountPercent && !voucher.discountAmount) {
          discount = (totalAmount * voucher.discountPercent) / 100;

          // Kiểm tra giới hạn giảm giá tối đa
          if (discount > voucher.maxDiscountAmount) {
            discount = voucher.maxDiscountAmount; // Áp dụng tối đa
          }
        }
        // Tính giảm giá cố định
        if (voucher.discountAmount && !voucher.discountPercent) {
          discount = voucher.discountAmount;
        }
        // Đảm bảo số tiền giảm giá không vượt quá tổng tiền cần thanh toán
        if (discount > totalAmount) {
          discount = totalAmount;
        }
        // Cập nhật lại tổng tiền sau giảm giá
        const totalAfterDiscount = totalAmount - discount;
        setTotalAmountAfterDiscount(totalAfterDiscount);
        // Cập nhật paymentInfo với voucher và số tiền giảm giá
        setPaymentInfo({
          ...paymentInfo,
          voucherId: voucher.id,
          amountPaid: totalAfterDiscount,
        });

        notification.success({
          message: "Voucher đã được áp dụng", // Tiêu đề thông báo
          description: `Số tiền giảm: ${new Intl.NumberFormat("vi-VN").format(
            discount
          )} VND.`,
          duration: 2,
          placement: "bottomLeft",
        });
        closeModal();
      }
    }
  };
  useEffect(() => {
    if (selectedBill) {
      setSelectedVoucher(null);
      setTotalAmountAfterDiscount(totalAmount); // Đặt lại tổng tiền sau giảm giá
      setPaymentInfo({
        ...paymentInfo,
        voucherId: null, // Không có voucher
      });
      setCustomerPaid(0);
      // Tính lại số tiền thừa khi chuyển hóa đơn
      setChange(customerPaid - totalAmount);
    }
  }, [selectedBill, totalAmount]);

  const [moneyOptions, setMoneyOptions] = useState([]);

  useEffect(() => {
    const newMoneyOptions = vouchers
      ? [
          totalAmountAfterDiscount,
          totalAmountAfterDiscount + 100000,
          totalAmountAfterDiscount + 200000,
          totalAmountAfterDiscount + 500000,
        ]
      : [
          totalAmount,
          totalAmount + 100000,
          totalAmount + 200000,
          totalAmount + 500000,
        ];
    setMoneyOptions(newMoneyOptions);
  }, [vouchers, totalAmountAfterDiscount, totalAmount]);

  useEffect(() => {
    setChange(
      customerPaid - (vouchers ? totalAmountAfterDiscount : totalAmount)
    );
  }, [vouchers, totalAmountAfterDiscount, totalAmount, customerPaid]);

  const handlePayment = async () => {
    if (
      customerPaid < totalAmountAfterDiscount &&
      paymentInfo.paymentMethod === "Cash"
    ) {
      notification.warning({
        message: "Thanh toán",
        description: `Thanh toán không đủ. Vui lòng nhập đủ tiền. Tổng tiền cần thanh toán là ${totalAmountAfterDiscount.toLocaleString()} VNĐ.`,
        duration: 2,
        placement: "bottomLeft",
      });
      return;
    }
    setTotalAmount(totalAmountAfterDiscount);
    // Tiến hành thanh toán nếu đủ tiền
    const paymentSuccess = await onPayment();
    if (paymentSuccess.success === true) {
      handleShowInvoice();
      setVoucher([]);
      setSelectedVoucher(null);
      setSelectedBill(null);
    } else {
      notification.warning({
        message: "Thanh toán không thành công",
        description: paymentSuccess.message,
        duration: 2,
        placement: "bottomLeft",
      });
    }
  };
  return (
    <div style={{ marginTop: "auto" }}>
      <Button
        id="buy"
        type="primary"
        style={{ width: "100%", padding: "28px 0", fontSize: "18px" }}
        onClick={openDrawer}
      >
        Thanh Toán
      </Button>
      <Drawer
        title={`Thông tin thanh toán${
          info?.staffResponse?.name ? ` - NV(${info.staffResponse.name})` : ""
        }`}
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        width={500}
        style={{ borderRadius: "20px 0 0 20px" }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {info?.customerResponse?.name && (
            <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
              Khách hàng: {info.customerResponse.name}
            </h3>
          )}
          <Form layout="vertical">
            <h4
              style={{
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              <p> Tổng Tiền:</p>
              <p>{totalAmount ? totalAmount.toLocaleString() : "0"} đ</p>
            </h4>
            <div
              style={{
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                marginBottom: "20px",
              }}
            >
              <p>Giảm giá</p>
              {selectedBill && selectedVoucher && vouchers.length > 0 && (
                <p
                  style={{
                    color: "green",
                    fontStyle: "italic",
                    textAlign: "end",
                  }}
                >
                  (Đã giảm giá:{" "}
                  {(totalAmount - totalAmountAfterDiscount).toLocaleString()} đ)
                </p>
              )}
              <Button type="primary" onClick={openModal}>
                Chọn Voucher
              </Button>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                <p>Khác cần trả:</p>
                {totalAmountAfterDiscount
                  ? totalAmountAfterDiscount.toLocaleString()
                  : totalAmount.toLocaleString()}{" "}
                đ
              </h4>
            </div>
            <Form.Item required>
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                }}
              >
                <p>Khách thanh toán</p>
                <Input
                  type="text"
                  value={customerPaid.toLocaleString()} // Định dạng số khi hiển thị
                  onChange={(e) => {
                    let value = e.target.value.replace(/,/g, "");
                    if (value === "") value = "0";
                    setCustomerPaid(Number(value) || 0);
                  }}
                  placeholder="Nhập số tiền..."
                  bordered={false}
                  style={{
                    borderBottom: "1px solid #000",
                    width: "100px",
                    textAlign: "right",
                    fontSize: "18px",
                  }}
                />
              </div>
            </Form.Item>
            <Radio.Group
              value={paymentInfo.paymentMethod}
              onChange={(e) =>
                setPaymentInfo({
                  ...paymentInfo,
                  paymentMethod: e.target.value,
                })
              }
              style={{ marginBottom: "15px" }}
            >
              <Radio value="Cash">Tiền mặt</Radio>
            </Radio.Group>
            <div>
              <Modal
                title="Chọn Voucher"
                visible={isModalVisible}
                onCancel={closeModal}
                footer={null}
              >
                {vouchers &&
                  vouchers.length > 0 &&
                  vouchers.map((v, index) => {
                    const currentTime = new Date();
                    const expirationTime = new Date(v.expirationDate);
                    const isExpired = currentTime > expirationTime; // Kiểm tra hết hạn
                    const isUsed = voucherUsageStatus[v.id];
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 10,
                          padding: 10,
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          backgroundColor:
                            isExpired || isUsed ? "#f0f0f0" : "white", // Làm mờ khi đã hết hạn hoặc đã sử dụng
                          opacity: isExpired || isUsed ? 0.5 : 1, // Giảm độ sáng khi đã hết hạn hoặc đã sử dụng
                          pointerEvents: isExpired || isUsed ? "none" : "auto", // Không cho chọn khi hết hạn hoặc đã sử dụng
                        }}
                      >
                        <div>
                          <div>{v.code}</div>
                          <div>
                            Giảm:{" "}
                            {v.discountPercent > 0
                              ? `${v.discountPercent}%`
                              : `${v.discountAmount.toLocaleString()} đ`}
                          </div>
                        </div>
                        {isExpired || isUsed ? (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Đã sử dụng
                          </span>
                        ) : selectedVoucher?.id === v.id ? (
                          <Button
                            type="default"
                            onClick={() => handleVoucherChange("")} // Bỏ chọn voucher
                          >
                            Bỏ chọn
                          </Button>
                        ) : (
                          <Button
                            type="link"
                            onClick={() => handleVoucherChange(v.id)} // Chọn voucher
                          >
                            Dùng
                          </Button>
                        )}
                      </div>
                    );
                  })}
              </Modal>
              {/* Hiển thị chi tiết voucher đã chọn */}
            </div>
            {/* Phần thanh toán bằng tiền mặt */}
            {paymentInfo.paymentMethod === "Cash" && (
              <>
                {/* Các tùy chọn tiền mặt */}
                <div>
                  {moneyOptions.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        setCustomerPaid(option);
                      }}
                      style={{
                        marginRight: "8px",
                        marginTop: "5px",
                        backgroundColor:
                          customerPaid === option ? "#4CAF50" : "#f0f0f0",
                        color: customerPaid === option ? "white" : "black",
                        cursor: "pointer",
                        borderRadius: "20px",
                      }}
                    >
                      {option.toLocaleString()} đ
                    </Button>
                  ))}
                </div>
                {change !== 0 && (
                  <Form.Item>
                    <h4
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        marginTop: "20px",
                      }}
                    >
                      <p style={{ color: "#4096ff" }}>Tiền thừa</p>{" "}
                      {change.toLocaleString()} đ
                    </h4>
                  </Form.Item>
                )}
              </>
            )}
          </Form>

          <div style={{ marginTop: "auto" }}>
            <Button
              type="primary"
              style={{
                width: "100%",
                fontSize: "22px",
                padding: "28px 0",
              }}
              onClick={handlePayment}
            >
              Thanh Toán
            </Button>
          </div>
        </div>
        {/* Modal hóa đơn */}
        <Modal
          title="Hóa Đơn"
          visible={isInvoiceModalVisible}
          onCancel={() => setIsInvoiceModalVisible(false)}
          footer={[
            <Button key="download" onClick={handleDownloadPDF}>
              Tải về PDF
            </Button>,
            <Button key="print" onClick={handlePrintInvoice}>
              In hóa đơn
            </Button>,
            <Button key="close" onClick={() => setIsInvoiceModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          <div dangerouslySetInnerHTML={{ __html: invoiceContent }} />
        </Modal>
      </Drawer>
    </div>
  );
};
export default CounterSalePayment;
