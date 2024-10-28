import { useState, useEffect } from "react";
import { Button, Input, Form, Select, Modal, message } from "antd";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const bankOptions = [
  { value: "BIDV", label: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)" },
  { value: "Techcombank", label: "Ngân hàng Kỹ thương Việt Nam (Techcombank)" },
  {
    value: "Vietcombank",
    label: "Ngân hàng Ngoại thương Việt Nam (Vietcombank)",
  },
  { value: "ACB", label: "Ngân hàng Á Châu (ACB)" },
  { value: "Sacombank", label: "Ngân hàng Sài Gòn Thương Tín (Sacombank)" },
];

const CounterSalePayment = ({
  onPayment,
  paymentInfo,
  setPaymentInfo,
  discountAmount = 0,
  selectedBill,
  cartItems,
  customerPaid,
  setCustomerPaid,
  loading,
}) => {
  const [change, setChange] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [invoiceContent, setInvoiceContent] = useState("");
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    note: "",
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [qrCodeImg, setQrCodeImg] = useState("");
  useEffect(() => {
    const savedAccounts =
      JSON.parse(localStorage.getItem("bankAccounts")) || [];
    setBankAccounts(savedAccounts);
  }, []);
  useEffect(() => {
    if (selectedBill) {
      const newTotalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalAmount(newTotalAmount);
    } else {
      setTotalAmount(0);
    }
  }, [selectedBill, cartItems]);

  useEffect(() => {
    const totalAmountWithDiscount = totalAmount - discountAmount;
    setChange(customerPaid - totalAmountWithDiscount);
  }, [customerPaid, totalAmount, discountAmount]);

  const moneyOptions = [
    totalAmount,
    totalAmount + 100000,
    totalAmount + 200000,
    totalAmount + 500000,
  ];

  const handleAddAccount = () => {
    if (!newAccount.bankName || !newAccount.accountNumber) {
      message.error("Vui lòng điền đầy đủ thông tin tài khoản ngân hàng.");
      return;
    }
    setBankAccounts([...bankAccounts, newAccount]);
    setNewAccount({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      note: "",
    });
    setIsAccountModalVisible(false);
  };

  const handleShowInvoice = async () => {
    const totalPayment = totalAmount - discountAmount;
    if (paymentInfo.paymentMethod === "Cash") {
      setQrCodeImg("");
    } else if (paymentInfo.paymentMethod === "Bank Transfer") {
      const selectedAccountInfo = bankAccounts.find(
        (account) => account.accountNumber === selectedAccount
      );
      const qrCodeData = JSON.stringify({
        accountNumber: selectedAccountInfo.accountNumber,
        bankName: selectedAccountInfo.bankName,
        amount: totalPayment,
      });
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
        setQrCodeImg(qrCodeDataUrl);
      } catch (err) {
        console.error(err);
        message.error("Không thể tạo mã QR.");
        return;
      }
    }
    const invoice = `
      <div id="invoice" style="font-family: Arial, sans-serif;">
        <img src="/image/logo.jpg" alt="Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
        <h2 style="text-align: center;">SPORT SHIRT</h2>
        <p style="text-align: center;">Địa chỉ: - -</p>
        <p style="text-align: center;">Điện thoại: 0987878787</p>
        <h2 style="text-align: center;">HÓA ĐƠN BÁN HÀNG</h2>
        <p>Số HĐ: HD000003</p>
        <p>Ngày ${new Date().toLocaleDateString()}</p>
        <p>Khách hàng: Alex</p>
        <p>SĐT: 098888888</p>
        <p>Địa chỉ: ab - Phường Điện Biên - Quận Ba Đình, Hà Nội</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 8px;">Đơn giá</th>
              <th style="border: 1px solid #000; padding: 8px;">SL</th>
              <th style="border: 1px solid #000; padding: 8px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems
              .map(
                (item) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px;">${item.price.toLocaleString()} VNĐ</td>
                <td style="border: 1px solid #000; padding: 8px;">${
                  item.quantity
                }</td>
                <td style="border: 1px solid #000; padding: 8px;">${(
                  item.price * item.quantity
                ).toLocaleString()} VNĐ</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h4>Tổng tiền hàng: ${totalAmount.toLocaleString()} VNĐ</h4>
        <h4>Chiết khấu: ${discountAmount.toLocaleString()} VNĐ</h4>
        <h4>Tổng thanh toán: ${totalPayment.toLocaleString()} VNĐ</h4>
        <p>(${totalPayment.toLocaleString()} đồng chẵn)</p>
        <h4>Thông tin thanh toán:</h4>
        ${
          paymentInfo.paymentMethod === "Cash"
            ? `
          <p>Thanh toán bằng tiền mặt</p>
          <p>Cảm ơn và hẹn gặp lại!</p>
        `
            : `
          <h4>Quét mã thanh toán:</h4>
          <img src="${qrCodeImg}" alt="QR Code" />
          <p><strong>Thông tin ngân hàng:</strong> ${
            selectedAccountInfo.bankName
          }</p>
          <p><strong>Số tiền:</strong> ${totalPayment.toLocaleString()} VNĐ</p>
          <p>Cảm ơn và hẹn gặp lại!</p>
        `
        }
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
    const doc = new jsPDF();
    const invoiceElement = document.createElement("div");
    invoiceElement.innerHTML = invoiceContent;
    document.body.appendChild(invoiceElement);

    const canvas = await html2canvas(invoiceElement);
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190;
    const pageHeight = doc.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save("invoice.pdf");
    document.body.removeChild(invoiceElement);
  };
  const handleDeleteAccount = (accountNumber) => {
    const updatedAccounts = bankAccounts.filter(
      (account) => account.accountNumber !== accountNumber
    );
    setBankAccounts(updatedAccounts);
    localStorage.setItem("bankAccounts", JSON.stringify(updatedAccounts)); // Cập nhật localStorage
    message.success("Tài khoản ngân hàng đã được xóa.");
  };
  const handlePayment = async () => {
    if (paymentInfo.paymentMethod === "Bank Transfer" && !selectedAccount) {
      message.error("Vui lòng chọn tài khoản ngân hàng trước khi thanh toán.");
      return;
    }
    const paymentSuccess = await onPayment();
    if (paymentSuccess) {
      handleShowInvoice();
    }
  };
  const handleAccountChange = async (value) => {
    setSelectedAccount(value);
    if (value) {
      const selectedAccountInfo = bankAccounts.find(
        (account) => account.accountNumber === value
      );
      const totalPayment = totalAmount - discountAmount;

      const qrCodeData = JSON.stringify({
        accountNumber: selectedAccountInfo.accountNumber,
        bankName: selectedAccountInfo.bankName,
        amount: totalPayment,
      });

      try {
        const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
        setQrCodeImg(qrCodeDataUrl);
      } catch (err) {
        message.error("Không thể tạo mã QR.");
      }
    }
  };

  return (
    <div className="payment">
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Thông Tin Thanh Toán
      </h3>
      <Form layout="vertical">
        <Form.Item label="Phương thức thanh toán" required>
          <Select
            value={paymentInfo.paymentMethod}
            onChange={(value) =>
              setPaymentInfo({ ...paymentInfo, paymentMethod: value })
            }
            options={[
              { value: "Cash", label: "Tiền mặt" },
              { value: "Bank Transfer", label: "Chuyển khoản" },
              { value: "Credit Card", label: "Thẻ tín dụng" },
              { value: "PayPal", label: "PayPal" },
            ]}
            placeholder="Chọn phương thức thanh toán"
          />
        </Form.Item>

        <Form.Item>
          <h4>
            Tổng Tiền: {totalAmount ? totalAmount.toLocaleString() : "0 VNĐ"}
          </h4>
          {discountAmount > 0 && (
            <p style={{ color: "green" }}>
              (Đã giảm giá: {discountAmount.toLocaleString()} VNĐ)
            </p>
          )}
        </Form.Item>

        {paymentInfo.paymentMethod === "Cash" && (
          <>
            <Form.Item label="Tiền khách đưa" required>
              <Input
                type="text"
                value={customerPaid.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/\./g, "");
                  setCustomerPaid(Number(value) || 0);
                }}
                placeholder="Nhập số tiền..."
              />
            </Form.Item>
            {change !== 0 && (
              <Form.Item>
                <h4>Tiền thừa: {change.toLocaleString()} VNĐ</h4>
              </Form.Item>
            )}
            <div style={{ marginTop: "10px" }}>
              {moneyOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => setCustomerPaid(option)}
                  style={{ marginRight: "8px", marginTop: "5px" }}
                >
                  {option.toLocaleString()} VNĐ
                </Button>
              ))}
            </div>
          </>
        )}

        {paymentInfo.paymentMethod === "Bank Transfer" && (
          <>
            <Select
              value={selectedAccount}
              onChange={handleAccountChange}
              placeholder="Chọn tài khoản ngân hàng"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              {bankAccounts.map((account, index) => (
                <Select.Option key={index} value={account.accountNumber}>
                  {account.bankName} - {account.accountNumber}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn việc mở dropdown khi nhấn nút xóa
                      handleDeleteAccount(account.accountNumber);
                    }}
                    style={{ marginLeft: "8px" }}
                    type="link"
                    danger
                  >
                    Xóa
                  </Button>
                </Select.Option>
              ))}
            </Select>
            <Button onClick={() => setIsAccountModalVisible(true)}>
              Thêm tài khoản
            </Button>
            {selectedAccount && (
              <div style={{ marginTop: "20px" }}>
                <h4>QR Code thanh toán:</h4>
                {qrCodeImg ? (
                  <img src={qrCodeImg} alt="QR Code" />
                ) : (
                  <p>Đang tạo mã QR...</p>
                )}
              </div>
            )}
          </>
        )}

        <Button type="primary" onClick={handlePayment} loading={loading}>
          Thanh Toán
        </Button>
      </Form>

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
      >
        <div dangerouslySetInnerHTML={{ __html: invoiceContent }} />
      </Modal>

      <Modal
        title="Thêm tài khoản ngân hàng"
        visible={isAccountModalVisible}
        onOk={handleAddAccount}
        onCancel={() => setIsAccountModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Tên ngân hàng" required>
            <Select
              value={newAccount.bankName}
              onChange={(value) =>
                setNewAccount({ ...newAccount, bankName: value })
              }
              options={bankOptions}
              placeholder="Chọn ngân hàng"
            />
          </Form.Item>
          <Form.Item label="Số tài khoản" required>
            <Input
              value={newAccount.accountNumber}
              onChange={(e) =>
                setNewAccount({ ...newAccount, accountNumber: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Chủ tài khoản">
            <Input
              value={newAccount.accountHolder}
              onChange={(e) =>
                setNewAccount({ ...newAccount, accountHolder: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Ghi chú">
            <Input
              value={newAccount.note}
              onChange={(e) =>
                setNewAccount({ ...newAccount, note: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CounterSalePayment;
