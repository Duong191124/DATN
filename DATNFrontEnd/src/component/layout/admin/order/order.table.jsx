import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import { useRef, useState, useEffect } from "react";
import {
  updateStatusOrder,
  colorFindById,
  productFindById,
  sizeFindById,
} from "../../../../service/api.service";
import Highlighter from "react-highlight-words";
import html2pdf from "html2pdf.js";
import moment from "moment";
import "./order.css";
import { NavLink } from "react-router-dom";
const OrderTable = (props) => {
  const { Search } = Input;
  const { TabPane } = Tabs;
  const {
    dataOrder,
    handlePageChange,
    pageSize,
    currentPage,
    totalOrders,
    loading,
    setDataOrder,
  } = props;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  console.log("âfaf", orderDetails);
  useEffect(() => {
    const fetchData = async (orderDetailResponses) => {
      if (orderDetailResponses) {
        try {
          const productIds = orderDetailResponses.map(
            (detail) => detail.productDetailId.productId
          );
          const productResponses = await Promise.all(
            productIds.map((id) => productFindById(id))
          );
          setProducts(productResponses.map((res) => res.data.data));

          const colorIds = orderDetailResponses.map(
            (detail) => detail.productDetailId.colorId
          );
          const sizeIds = orderDetailResponses.map(
            (detail) => detail.productDetailId.sizeId
          );

          const colorResponses = await Promise.all(
            colorIds.map((id) => colorFindById(id))
          );
          const sizeResponses = await Promise.all(
            sizeIds.map((id) => sizeFindById(id))
          );
          setColors(colorResponses.map((res) => res.data.data));
          setSizes(sizeResponses.map((res) => res.data.data));
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };
    if (expandedRowKey) {
      const orderDetail = dataOrder.find(
        (order) => order.id === expandedRowKey
      );
      if (orderDetail) fetchData(orderDetail.orderDetailResponses);
      setOrderDetails(orderDetail);
    }
  }, [expandedRowKey, dataOrder]);
  const getProductName = (productId) => {
    const product = products.find((item) => item.id === productId);
    return product ? product.name : "N/A";
  };
  const getColorName = (colorId) => {
    const color = colors.find((item) => item.id === colorId);
    return color ? color.name : "N/A";
  };
  const getSizeName = (sizeId) => {
    const size = sizes.find((item) => item.id === sizeId);
    return size ? size.name : "N/A";
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const statusOptions = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "process", label: "Đang xử lý" },
    { value: "delivery", label: "Đang giao" },
    { value: "shipped", label: "Đã giao" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const showModal = (orderId, currentStatus) => {
    setCurrentOrderId(orderId);
    setSelectedStatus(currentStatus);
    setIsModalVisible(true);
  };
  const handleUpdateStatus = async () => {
    try {
      await updateStatusOrder(currentOrderId, selectedStatus);
      notification.success({
        message: "Update status",
        description: "Update status successfully!",
      });
      setIsModalVisible(false);
      setDataOrder((prevDataOrder) =>
        prevDataOrder.map((order) =>
          order.id === currentOrderId
            ? { ...order, status: selectedStatus }
            : order
        )
      );
    } catch (error) {
      notification.error({
        message: "Error updating status",
        description: JSON.stringify(error.message),
        placement: "top",
      });
    }
  };
  const canceledOrder = async (orderId, status) => {
    try {
      await updateStatusOrder(orderId, status);
      notification.success({
        message: "Update",
        description: "Update status successfully",
        placement: "top",
      });
      setDataOrder((prevDataOrder) =>
        prevDataOrder.map((order) =>
          order.id === currentOrderId
            ? { ...order, status: selectedStatus }
            : order
        )
      );
    } catch (error) {
      notification.error({
        message: "Error updating status",
        description: JSON.stringify(error.message),
        placement: "top",
      });
    }
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "STT",
      render: (_, record, index) => {
        // console.log(">>>> index:", pageSize);
        return <>{index + 1 + (currentPage - 1) * pageSize}</>;
      },
    },
    {
      title: "Mã Đơn Hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (status, record) => {
        const statusOptions = [
          { value: "pending", label: "Chờ xử lý" },
          { value: "process", label: "Đang xử lý" },
          { value: "delivery", label: "Đang giao" },
          { value: "shipped", label: "Đã giao" },
          { value: "cancelled", label: "Đã hủy" },
        ];

        // Tìm trạng thái trong danh sách options
        const currentStatus = statusOptions.find(
          (option) => option.value === status
        );

        // Nếu trạng thái tìm được, hiển thị label, nếu không hiển thị "N/A"
        return currentStatus ? currentStatus.label : "N/A";
      },
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "staffResponse",
      key: "staffResponse",
      render: (text, record) => {
        return record.staffResponse?.name || "Chưa có thông tin";
      },
    },
    {
      title: "Tiền khách đưa",
      key: "moneyReceived",
      render: (record) => `${record.moneyReceived.toLocaleString()} VND`,
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      ...getColumnSearchProps("totalAmount"),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (totalAmount) => `${totalAmount.toLocaleString()} VND`,
    },
    {
      title: "Hành Động",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          style={{ color: "blue" }}
          onClick={() => showModal(record.id, record.status)}
        >
          Cập nhật trạng thái
        </Button>
      ),
    },
  ];
  const columnsOrderDetail = [
    { title: "Mã HDCT", dataIndex: "id", key: "id" },
    {
      title: "Mã sản phẩm chi tiết",
      key: "product_detail_code",
      render: (text, record) => record.productDetailId?.code || "N/A",
    },
    {
      title: "Tên sản phẩm",
      key: "product_detail_productId",
      render: (text, record) =>
        getProductName(record.productDetailId?.productId),
    },
    {
      title: "Số lượng",
      key: "order_detail_quantity",
      render: (text, record) => record.quantity || "N/A",
    },
    {
      title: "Size",
      key: "order_detail_size",
      render: (text, record) => getSizeName(record.productDetailId?.sizeId),
    },
    {
      title: "Color",
      key: "order_detail_color",
      render: (text, record) => getColorName(record.productDetailId?.colorId),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Hình ảnh",
      key: "product_detail_image",
      render: (text, record) =>
        record.productDetailId?.image ? (
          <img
            src={record.productDetailId.image}
            alt="Product"
            style={{ width: 50 }}
          />
        ) : (
          "N/A"
        ),
    },
  ];
  const columnsHistoryPayment = [
    {
      title: "Mã phiếu",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <NavLink to={`/order-detail/${record.id}`}>{record.id}</NavLink>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Người tạo",
      key: "staffName",
      render: (text, record) => {
        return (
          record.orderDataPaymentResponse?.staffResponse?.name ||
          "Chưa có thông tin"
        );
      },
    },
    {
      title: "Giá trị đơn hàng",
      key: "totalAmount",
      render: (text, record) => {
        return `${record.orderDataPaymentResponse?.totalAmount.toLocaleString()} VND`;
      },
    },
    {
      title: "Phương thức",
      key: "paymentMethod",
      render: (text, record) => {
        const paymentMethods = {
          "Credit Card": "Thẻ tín dụng",
          PayPal: "PayPal",
          Cash: "Tiền mặt",
          "Bank Transfer": "Chuyển khoản ngân hàng",
          "Gift Card": "Thẻ quà tặng",
          COD: "Thanh toán khi nhận hàng",
          VNPay: "VNPay",
        };
        return paymentMethods[record.paymentMethod] || "Không xác định";
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (text, record) => {
        const statusOptions = {
          pending: "Chờ xử lý",
          process: "Đang xử lý",
          delivery: "Đang giao",
          shipped: "Đã giao",
          cancelled: "Đã hủy",
        };
        return (
          statusOptions[record.orderDataPaymentResponse.status] ||
          "Không xác định"
        );
      },
    },
  ];
  const createInvoiceContent = () => {
    const totalQuantity = getTotalQuantity(
      orderDetails.orderDetailResponses || []
    );
    const orderDetailRows = orderDetails.orderDetailResponses
      .map(
        (record) => `
          <tr>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.id
          }</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.productDetailId?.code || "N/A"
          }</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${getProductName(
            record.productDetailId?.productId
          )}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.quantity || "N/A"
          }</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${getSizeName(
            record.productDetailId?.sizeId
          )}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${getColorName(
            record.productDetailId?.colorId
          )}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.price.toLocaleString()} VND</td>
          </tr>
        `
      )
      .join("");

    const pdfContent = `
      <div id="invoice" style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 14px; padding: 20px;">
        <div style="text-align:center; margin-bottom: 20px;">
          <img src="/image/logo.jpg" alt="Logo" style="width: 150px; height: auto;" />
        </div>
        <h2 style="text-align: center; font-size: 24px; font-weight: bold;">SPORT SHIRT</h2>
        <p style="text-align: center; font-size: 16px;">Địa chỉ: - -</p>
        <p style="text-align: center; font-size: 16px;">Điện thoại: 0999999999</p>
        <h2 style="text-align: center; font-size: 24px; font-weight: bold;">HÓA ĐƠN BÁN HÀNG</h2>
        <p style="font-size: 16px;">Mã hóa đơn: ${orderDetails.code}</p>
        <p style="font-size: 16px;">Ngày: ${orderDetails.orderDate}</p>
        <p style="font-size: 16px;">Nhân viên: ${orderDetails.staffResponse.name
      }</p>
        <p style="font-size: 16px;">Khách hàng: ${orderDetails.customerResponse.name
      }</p>
        <p style="font-size: 16px;">SĐT: ${orderDetails.customerResponse.phoneNumber
      }</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Mã HDCT</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Mã sản phẩm</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Tên sản phẩm</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Số lượng</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Size</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Color</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetailRows}
          </tbody>
        </table>
        <div style="margin-top: 20px; display: flex; flex-direction: column;">
          <div style="width: 250px; border: 1px solid #ddd; padding: 10px;">
            <div className="result_order_detail">
              <span>Giảm giá hóa đơn:</span>
              <span>${orderDetails.voucherId || "0"} VND</span>
            </div>
            <div className="result_order_detail">
              <span>Tổng số lượng:</span>
              <span>${totalQuantity}</span>
            </div>
            <div className="result_order_detail">
              <span>Tổng tiền hàng:</span>
              <span>${orderDetails.totalAmount.toLocaleString()} VND</span>
            </div>
            <div className="result_order_detail">
              <span>Trạng thái:</span>
              <span>
                ${(() => {
        const statusOptions = [
          { value: "pending", label: "Chờ xử lý" },
          { value: "process", label: "Đang xử lý" },
          { value: "delivery", label: "Đang giao" },
          { value: "shipped", label: "Đã giao" },
          { value: "cancelled", label: "Đã hủy" },
        ];
        const currentStatus = statusOptions.find(
          (option) => option.value === orderDetails.status
        );
        return currentStatus ? currentStatus.label : "";
      })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    return pdfContent;
  };
  const generatePDF = () => {
    const invoiceContent = createInvoiceContent(); // Lấy nội dung hóa đơn
    const invoiceElement = document.createElement("div");
    invoiceElement.innerHTML = invoiceContent; // Đặt nội dung vào phần tử
    document.body.appendChild(invoiceElement); // Thêm vào DOM

    const options = {
      margin: 1,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    // Tạo PDF
    html2pdf()
      .from(invoiceElement)
      .set(options)
      .save()
      .then(() => {
        document.body.removeChild(invoiceElement); // Xóa phần tử sau khi tạo PDF
      });
  };

  const getTotalQuantity = (orderDetailResponses) => {
    return orderDetailResponses.reduce(
      (total, detail) => total + (detail.quantity || 0),
      0
    );
  };

  const expandedRowRender = (record) => {
    const totalQuantity = getTotalQuantity(record.orderDetailResponses || []);
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="Chi Tiết Đơn Hàng" key="1">
          <div style={{ margin: "0 28px" }}>
            {orderDetails && (
              <div style={{ marginTop: 20 }}>
                <div className="order_detail">
                  <div className="col-4">
                    <p>Mã hóa đơn: {orderDetails.code}</p>
                    <p>
                      Ngày mua:
                      <DatePicker
                        disabled
                        style={{
                          marginLeft: "10px",
                          width: "50%",
                        }}
                        value={
                          orderDetails.orderDate
                            ? moment(orderDetails.orderDate, "DD-MM-YYYY")
                            : null
                        }
                        needConfirm
                      />
                    </p>
                    <p>Khách hàng: {orderDetails?.customerResponse?.name}</p>
                  </div>
                  <div className="col-4">
                    <p>
                      Trạng thái:
                      {(() => {
                        const statusOptions = [
                          { value: "pending", label: "Chờ xử lý" },
                          { value: "process", label: "Đang xử lý" },
                          { value: "delivery", label: "Đang giao" },
                          { value: "shipped", label: "Đã giao" },
                          { value: "cancelled", label: "Đã hủy" },
                        ];
                        const currentStatus = statusOptions.find(
                          (option) => option.value === orderDetails.status
                        );
                        return currentStatus ? currentStatus.label : "";
                      })()}
                    </p>
                    <p>
                      Phí giao hàng:
                      {orderDetails.deliveryFee
                        ? `${orderDetails.deliveryFee.toLocaleString()} VND`
                        : "N/A"}
                    </p>
                    <p>
                      Mã nhân viên:
                      {orderDetails.staffResponse?.name || "Chưa có thông tin"}
                    </p>
                  </div>
                </div>

                <Table
                  style={{ margin: "28px 0", border: "1px solid #d9d9d9" }}
                  pagination={false}
                  columns={columnsOrderDetail}
                  dataSource={orderDetails.orderDetailResponses}
                  rowKey="id"
                />

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <div style={{ width: "250px" }}>
                    <div className="result_order_detail">
                      <span>Tổng số lượng:</span>
                      <span>{totalQuantity} </span>
                    </div>
                    <div className="result_order_detail">
                      <span className="">Tổng tiền hàng:</span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(orderDetails.totalAmount)}
                      </span>
                    </div>
                    <div className="result_order_detail">
                      <span>Giảm giá hóa đơn:</span>
                      <span>{orderDetails.voucherId} </span>
                    </div>
                    <div className="result_order_detail">
                      <span>Khách cần trả:</span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(orderDetails.totalAmount)}{" "}
                      </span>
                    </div>
                    <div className="result_order_detail">
                      <span>Khách đã trả:</span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(orderDetails.moneyReceived)}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    margin: "28px 0",
                  }}
                >
                  <Button
                    style={{ marginRight: "15px" }}
                    type="primary"
                    onClick={generatePDF}
                  >
                    Xuất PDF
                  </Button>
                  <Button
                    danger
                    onClick={() => canceledOrder(orderDetails.id, "cancelled")}
                  >
                    Hủy hóa đơn
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabPane>
        <TabPane tab="Lịch Sử" key="2">
          <Table
            columns={columnsHistoryPayment}
            dataSource={record.paymentResponses.map((payment) => ({
              ...payment,
              key: payment.id,
            }))}
            style={{ margin: "28px 0", border: "1px solid #d9d9d9" }}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  };

  return (
    <>
      <Table
        style={{ border: "1px solid #ddd" }}
        columns={columns}
        dataSource={dataOrder}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
          onExpand: (expanded, record) => {
            // Chỉ cần expand hoặc thu gọn khi click vào dấu cộng
            if (expanded) {
              setExpandedRowKey(record.id);
            } else {
              setExpandedRowKey(null);
            }
          },
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalOrders,
          onChange: handlePageChange,
        }}
        loading={loading}
      />
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        visible={isModalVisible}
        onOk={handleUpdateStatus}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: "100%" }}
        >
          {statusOptions.map((status) => (
            <Select.Option key={status.value} value={status.value}>
              {status.label}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default OrderTable;
