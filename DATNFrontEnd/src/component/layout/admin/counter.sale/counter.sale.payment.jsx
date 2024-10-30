import { useState, useEffect } from "react";
import { Button, Input, Form, Select, Modal, message } from "antd";
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";
import { PlusOutlined } from "@ant-design/icons";

const bankOptions = [
  {
    value: "BIDV",
    label: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)",
    logo: "/image/logoBIDV.png",
  },
  {
    value: "Techcombank",
    label: "Ngân hàng Kỹ thương Việt Nam (Techcombank)",
    logo: "/image/logoTechComBank.svg",
  },
  {
    value: "Vietcombank",
    label: "Ngân hàng Ngoại thương Việt Nam (Vietcombank)",
    logo: "/image/logoVietComBank.svg",
  },
  {
    value: "ACB",
    label: "Ngân hàng Á Châu (ACB)",
    logo: "/image/logoACB.svg",
  },
  {
    value: "Sacombank",
    label: "Ngân hàng Sài Gòn Thương Tín (Sacombank)",
    logo: "/image/logo-sacombank.svg",
  },
  {
    value: "MBBank",
    label: "Ngân hàng TMCP Quân Đội (MB Bank)",
    logo: "/image/logoMB.png",
  },
];

const CounterSalePayment = ({
  onPayment,
  paymentInfo,
  setPaymentInfo,
  discountAmount = 0,
  selectedBill,
  billWaiting,
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
    const savedAccounts =
      JSON.parse(localStorage.getItem("bankAccounts")) || [];
    setBankAccounts(savedAccounts);
  }, []);
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

    // Kiểm tra xem tài khoản đã tồn tại chưa
    const accountExists = bankAccounts.some(
      (account) => account.bankName === newAccount.bankName
    );

    if (accountExists) {
      message.error("Mỗi ngân hàng chỉ được liên kết một lần.");
      return;
    }
    const bankOption = bankOptions.find(
      (option) => option.value === newAccount.bankName
    );
    if (bankOption) {
      const updatedAccounts = [
        ...bankAccounts,
        { ...newAccount, logo: bankOption.logo },
      ];
      setBankAccounts(updatedAccounts);
      localStorage.setItem("bankAccounts", JSON.stringify(updatedAccounts));
      message.success("Tài khoản ngân hàng đã được thêm thành công.");
    }
    setNewAccount({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      note: "",
    });
    setIsAccountModalVisible(false);
  };

  const generateQrCodeWithLogo = async (qrCodeData, logoUrl) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

      const qrCodeImg = new Image();
      qrCodeImg.src = qrCodeDataUrl;

      return new Promise((resolve) => {
        qrCodeImg.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const qrSize = 200; // Kích thước mã QR
          const logoSize = 50; // Kích thước logo

          canvas.width = qrSize;
          canvas.height = qrSize;

          ctx.drawImage(qrCodeImg, 0, 0, qrSize, qrSize);

          const logoImg = new Image();
          logoImg.src = logoUrl;
          logoImg.crossOrigin = "Anonymous"; // Thêm dòng này

          logoImg.onload = () => {
            const logoX = (qrSize - logoSize) / 2;
            const logoY = (qrSize - logoSize) / 2;
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

            resolve(canvas.toDataURL("image/png"));
          };
        };
      });
    } catch (error) {
      console.error("Error generating QR code with logo:", error);
      throw error;
    }
  };

  const handleShowInvoice = async () => {
    const totalPayment = totalAmount - discountAmount;
    const billCode = billWaiting.find((bill) => bill.billId === selectedBill);
    let selectedAccountInfo;
    if (paymentInfo.paymentMethod === "Cash") {
      setQrCodeImg("");
    } else if (paymentInfo.paymentMethod === "Bank Transfer") {
      selectedAccountInfo = bankAccounts.find(
        (account) => account.accountNumber === selectedAccount
      );
      if (!selectedAccountInfo) {
        message.error("Tài khoản ngân hàng không hợp lệ.");
        return;
      }
      const qrCodeData = JSON.stringify({
        accountNumber: selectedAccountInfo.accountNumber,
        bankName: selectedAccountInfo.bankName,
        amount: totalPayment,
      });
      try {
        const qrCodeWithLogoUrl = await generateQrCodeWithLogo(
          qrCodeData,
          selectedAccountInfo.logo
        );
        setQrCodeImg(qrCodeWithLogoUrl);
      } catch (err) {
        console.error(err);
        message.error("Không thể tạo mã QR.");
        return;
      }
    }
    const invoice = `
      <div id="invoice" style="font-family: Arial, sans-serif;">
       <div style="text-align:center;">
        <img src="/image/logo.jpg" alt="Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
       </div>
        <h2 style="text-align: center;">SPORT SHIRT</h2>
        <p style="text-align: center;">Địa chỉ: - -</p>
        <p style="text-align: center;">Điện thoại: 0999999999</p>
        <h2 style="text-align: center;">HÓA ĐƠN BÁN HÀNG</h2>
        <p>Số HĐ: ${billCode?.billId}</p>
        <p>Ngày: ${new Date().toLocaleDateString()}</p>
        <p>Thời gian thanh toán: ${new Date().toLocaleTimeString()}</p>
        <p>Nhân viên: ${billCode?.staff?.name}</p>
        <p>Khách hàng: ${billCode?.customer?.name}</p>
        <p>SĐT: ${billCode?.customer?.phoneNumber}</p>
        <p>Địa chỉ: ${
          billCode?.customer?.address || "Khách hàng chưa cập nhật địa chỉ"
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
                <td style="border: 1px solid #000; padding: 8px; align-item:center;text-align:center;">${item.price.toLocaleString()} VNĐ</td>
                <td style="border: 1px solid #000; padding: 8px; align-item:center;text-align:center;">${(
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
        ${
          paymentInfo.paymentMethod === "Cash"
            ? `
          <p style="text-align: center;">Thanh toán bằng tiền mặt</p>
          <p style="text-align: center;">Cảm ơn và hẹn gặp lại quý khách!</p>
        `
            : `
             <p><strong>Thông tin ngân hàng:</strong> ${selectedAccountInfo.bankName}</p>
          <h4>Quét mã thanh toán:</h4>
        <div style="display: flex; flex-direction: column; align-items: center;">
  <img src="${qrCodeImg}" alt="QR Code" style="margin-bottom: 5px;" />
  <img src="${selectedAccountInfo.logo}" alt="${selectedAccountInfo.bankName} Logo" style="width: 100px; margin: 5px 0;" />
    </div>
          <p style="text-align: center;">Cảm ơn và hẹn gặp lại quý khách!</p>
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
  const handleDeleteAccount = (accountNumber) => {
    const updatedAccounts = bankAccounts.filter(
      (account) => account.accountNumber !== accountNumber
    );
    if (selectedAccount === accountNumber) {
      setSelectedAccount(null);
    }
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
        <div style={{ marginBottom: "20px" }}>
          {paymentInfo.paymentMethod === "Bank Transfer" && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Select
                  value={selectedAccount}
                  onChange={handleAccountChange}
                  placeholder="Chọn tài khoản ngân hàng"
                  style={{ flex: 1, marginRight: "10px" }}
                >
                  {bankAccounts.map((account, index) => (
                    <Select.Option key={index} value={account.accountNumber}>
                      <img
                        src={account.logo}
                        alt={account.bankName}
                        style={{ width: "20px", marginRight: "10px" }}
                      />
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
                <Button
                  onClick={() => setIsAccountModalVisible(true)}
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                />
              </div>
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
        </div>
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
        width={800}
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
