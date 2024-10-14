import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  notification,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import {
  deleteOrder,
  updateStatusOrder,
  colorFindById,
  productFindById,
  sizeFindById,
} from "../../../../service/api.service";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./order.css";
import moment from "moment";
import { NavLink } from "react-router-dom";

const OrderTable = (props) => {
  const { Search } = Input;
  const { RangePicker } = DatePicker;
  const { TabPane } = Tabs;
  const { dataOrder, loadOrder } = props;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

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

  const updateStatus = async (orderId, status) => {
    try {
      await updateStatusOrder(orderId, status);
      loadOrder();
      notification.success({
        message: "Update",
        description: "Update status successfully",
        placement: "top",
      });
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
      loadOrder();
      notification.success({
        message: "Update",
        description: "Update status successfully",
        placement: "top",
      });
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

  const confirm = async (id) => {
    const res = await deleteOrder(id);
    if (res.data) {
      notification.success({
        message: "Deleted",
        description: "Deleted successfully",
      });
      loadOrder();
    } else {
      notification.error({
        message: "Error deleting order",
        description: JSON.stringify(res.message),
      });
    }
  };

  const handleRowExpand = (record) => {
    setExpandedRowKey(expandedRowKey === record.id ? null : record.id);
  };
  const columns = [
    {
      title: "STT",
      render: (_, record, index) => <>{index + 1}</>,
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
        const currentStatus = statusOptions.find(
          (option) => option.value === status
        );

        return (
          <Select
            labelInValue
            defaultValue={currentStatus || { value: status, label: "N/A" }}
            style={{ width: 120 }}
            onChange={(value) => updateStatus(record.id, value.value)}
            options={statusOptions}
          />
        );
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
      dataIndex: "moneyReceived",
      key: "moneyReceived",
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
        <div style={{ display: "flex", gap: "16px" }}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(record.id)}
            onCancel={(e) => message.error("Click on No")}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{ color: "red", fontSize: "24px", cursor: "pointer" }}
            />
          </Popconfirm>
        </div>
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
        <NavLink to={`/order-detail/${record.id}`}>MP-{record.id}</NavLink>
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
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("HÓA ĐƠN", 14, 22);

    if (orderDetails) {
      doc.setFontSize(12);
      const orderDetailsInfo = [
        `Mã hóa đơn: HD-${orderDetails.id}`,
        `Trạng thái: ${orderDetails.status || "Hóa đơn chờ"}`,
        `Ngày mua: ${orderDetails.orderDate}`,
        `Phí giao hàng: ${orderDetails.deliveryFee}`,
        `Mã nhân viên: ${orderDetails.staffId}`,
        `Mã voucher: ${orderDetails.voucherId}`,
        `Tổng tiền: ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(orderDetails.totalAmount)}`,
      ];

      orderDetailsInfo.forEach((text, index) => {
        doc.text(text, 14, 40 + index * 10);
      });

      const tableColumns = [
        { header: "Mã HDCT", dataKey: "id" },
        { header: "Mã sản phẩm chi tiết", dataKey: "code" },
        { header: "Tên sản phẩm", dataKey: "name" },
        { header: "Số lượng", dataKey: "quantity" },
        { header: "Size", dataKey: "size" },
        { header: "Color", dataKey: "color" },
        { header: "Giá", dataKey: "price" },
      ];

      const tableRows = orderDetails.orderDetailResponses.map((detail) => ({
        id: detail.id,
        code: detail.productDetailId?.code || "N/A",
        name: getProductName(detail.productDetailId?.productId),
        quantity: detail.quantity || "N/A",
        size: getSizeName(detail.productDetailId?.sizeId),
        color: getColorName(detail.productDetailId?.colorId),
        price: detail.price ? `${detail.price.toLocaleString()} VND` : "N/A",
      }));

      doc.autoTable({
        columns: tableColumns,
        body: tableRows,
        startY: 110,
        theme: "grid",
      });

      doc.save(`hoa_don_HD-${orderDetails.id}.pdf`);
    }
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
                    <p>Khách hàng: chưa cập nhật</p>
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
    <div className="bill">
      <div className="filter-bill">
        <div className="bill-date">
          <p>Thời gian</p>
          <RangePicker />
        </div>
        <div className="bill-status">
          <p>Trạng thái</p>
          <Radio.Group
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Radio value={1} style={{ marginBottom: "15px" }}>
              Chờ xử lý
            </Radio>
            <Radio value={2} style={{ marginBottom: "15px" }}>
              Đang xử lý
            </Radio>
            <Radio value={3} style={{ marginBottom: "15px" }}>
              Đang giao
            </Radio>
            <Radio value={4} style={{ marginBottom: "15px" }}>
              Đã giao
            </Radio>
            <Radio value={5} style={{ marginBottom: "15px" }}>
              Đã hủy
            </Radio>
          </Radio.Group>
        </div>
        <div className="bill-staff">
          <p>Nhân viên</p>
          <Search
            placeholder="Nhập tên nhân viên ..."
            onSearch={"null"}
            enterButton
          />
        </div>
      </div>
      <div className="table-bill">
        <Table
          style={{ border: "1px solid #ddd" }}
          columns={columns}
          dataSource={dataOrder}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleRowExpand(record),
          })}
          expandedRowRender={(record) => expandedRowRender(record)}
          expandedRowKeys={expandedRowKey ? [expandedRowKey] : []}
        />
      </div>
    </div>
  );
};

export default OrderTable;
