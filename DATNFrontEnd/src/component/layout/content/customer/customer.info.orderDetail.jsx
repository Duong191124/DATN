import React, { useEffect, useState } from "react";
import {
  Steps,
  Row,
  Col,
  Typography,
  Button,
  Card,
  Divider,
  Table,
} from "antd";
import {
  colorFindById,
  fetchDataOrderForCustomerIdByOrderId,
  fetchDataOrderStatusByCustomerId,
  orderFindByCode,
  productFindById,
  sizeFindById,
} from "../../../../service/api.service";
import { NavLink, useLocation } from "react-router-dom";
import moment from "moment";
import { LeftOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Title, Text } = Typography;

const CustomerInfoOrderDetail = () => {
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const userId = localStorage.getItem("userId");
  const [limit, setLimit] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState("1");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const cardStyle = {
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: 16,
    marginBottom: 16,
  };

  const stepStyle = {
    marginBottom: 32,
  };

  const buttonStyle = {
    padding: "10px 40px",
    backgroundColor: "#EE4D2D",
    color: "#fff",
    fontWeight: 500,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  };

  const hoverButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#D03E1D",
  };

  const addressSectionStyle = {
    marginBottom: 16,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  };

  const getStatusByTab = (tabKey) => {
    const statusMap = {
      1: null, // Tất cả
      2: "pending", // Chờ thanh toán
      3: "delivery", // Vận chuyển
      4: "process", // Chờ giao hàng
      5: "shipped", // Hoàn thành
      6: "cancelled", // Đã hủy
    };
    return statusMap[tabKey] || null;
  };
  const [dataInfoOrder, setDataInfoOrder] = useState({});
  const findByOrderCodeWithCustomer = async () => {
    const response = await orderFindByCode(code);
    if (response?.data?.data) {
      setDataInfoOrder(response.data.data);
    }
  };
  useEffect(() => {
    findByOrderCodeWithCustomer();
  }, [code]);
  const fetchDataByStatus = async () => {
    try {
      const status = getStatusByTab(activeTab);
      const res = await fetchDataOrderStatusByCustomerId(
        userId,
        limit,
        pageSize,
        status
      );
      if (res.data) {
        setData(res.data.data.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataOrder = () => {
    return data.map((order) => {
      const orderId = order.id;
      try {
        const res = fetchDataOrderForCustomerIdByOrderId(userId, orderId);
        if (res.data) {
          setDataDetail(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    fetchDataByStatus();
    fetchDataOrder();
  }, [activeTab]);

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <Row
          align="middle"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Col span={4}>
            <img
              src={record.image}
              alt={record.productName}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Col>
          <Col span={19}>
            <Text strong>{record.productName}</Text>
            <br />
            <Text type="secondary">{record.options}</Text>
          </Col>
        </Row>
      ),
    },
    {
      title: "Đơn giá",
      render: (text, record) => {
        const discountPrice = record?.price?.discountPrice;
        const defaultPrice = record?.price?.defaultPrice;
        if (discountPrice > 0) {
          return (
            <>
              <span style={{ textDecoration: "line-through", color: "gray" }}>
                ₫{defaultPrice?.toLocaleString()}
              </span>
              <br />
              <span style={{ color: "red" }}>
                ₫{discountPrice?.toLocaleString()}
              </span>
            </>
          );
        }
        return `₫${defaultPrice?.toLocaleString()}`;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          ₫{total.toLocaleString()}
        </Text>
      ),
    },
  ];
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const fetchProductData = async () => {
      // Map qua danh sách orderDetailResponses và thêm tên màu sắc từ colorId
      const mappedData = await Promise?.all(
        dataInfoOrder?.orderDetailResponses?.map(async (item) => {
          const color = await colorFindById(item.productDetailId.colorId);
          const size = await sizeFindById(item.productDetailId.sizeId);
          const product = await productFindById(item.productDetailId.productId);
          return {
            key: item.id,
            productName: product?.data?.data?.name,
            options: `Phân loại hàng: Size-${size?.data?.data.name}, Màu sắc-${color?.data?.data.name}`, // Lấy tên màu
            image: item.productDetailId.image,
            price: {
              discountPrice: item?.productDetailId?.discountPrice,
              defaultPrice: item?.productDetailId?.defaultPrice,
            },
            quantity: item.quantity,
            total: `${(
              (item.productDetailId.discountPrice > 0
                ? item.productDetailId.discountPrice
                : item.productDetailId.defaultPrice) * item.quantity
            ).toLocaleString()}`,
          };
        })
      );
      setProductData(mappedData); // Cập nhật dữ liệu sản phẩm sau khi đã có tên màu
    };

    fetchProductData();
  }, [dataInfoOrder]);
  const stepData = [
    { title: "Đơn hàng đã đặt", status: "pending" },
    { title: "Đã xác nhận", status: "confirmed" },
    { title: "Đang giao", status: "shipping" },
    { title: "Đã nhận được hàng", status: "delivered" },
    { title: "Đơn hàng đã hoàn thành", status: "completed" },
  ];
  const relevantSteps =
    dataInfoOrder.status === "cancelled"
      ? [
          { title: "Đơn hàng đã đặt", status: "pending" },
          ...(dataInfoOrder.status.includes("confirmed")
            ? [{ title: "Đã xác nhận", status: "confirmed" }]
            : []),
          { title: "Đơn hàng đã hủy", status: "cancelled" },
        ]
      : stepData;
  const currentStep = relevantSteps.findIndex(
    (step) => step.status === dataInfoOrder.status
  );
  const updatedAtFormatted = moment(dataInfoOrder.updatedAt).format(
    "DD-MM-YYYY HH:mm:ss"
  );
  return (
    <div style={{ padding: 16, marginTop: "80px" }}>
      <Row
        style={{
          backgroundColor: "#ffff",
          padding: "15px 20px", // Điều chỉnh padding để làm cho nó đẹp hơn
          borderRadius: 8,
          alignItems: "center",
          border: "1px solid #ddd",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "28px",
          display: "flex", // Dùng flex để căn chỉnh các phần tử
          justifyContent: "space-between", // Căn giữa các phần tử
        }}
      >
        <NavLink
          to={"/info-order"}
          style={{
            color: "gray",
            padding: "6px 20px",
            borderRadius: 8,
            alignItems: "center",
            fontSize: "16px",
            display: "flex",
          }}
        >
          <LeftOutlined /> <span style={{ fontSize: "18px" }}>Quay lại</span>
        </NavLink>
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color:
              dataInfoOrder?.paymentResponses?.length > 0 &&
              dataInfoOrder?.paymentResponses[0]?.status === 0
                ? "#ff4d4f"
                : "#52c41a",
            padding: "8px 16px",
            borderRadius: "12px",
            backgroundColor:
              dataInfoOrder?.paymentResponses?.length > 0 &&
              dataInfoOrder?.paymentResponses[0]?.status === 0
                ? "#fff1f0"
                : "#f6ffed",
            border:
              dataInfoOrder?.paymentResponses?.length > 0 &&
              dataInfoOrder?.paymentResponses[0]?.status === 0
                ? "1px solid #ff4d4f"
                : "1px solid #52c41a",
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            display: "inline-block",
          }}
        >
          {dataInfoOrder?.paymentResponses?.length > 0 &&
          dataInfoOrder?.paymentResponses[0]?.status === 0
            ? "Chưa thanh toán"
            : "Đã thanh toán"}
        </Text>
      </Row>
      <Row style={stepStyle}>
        <Steps current={currentStep} style={{ width: "100%" }}>
          {relevantSteps.map((step, index) => {
            let stepStatus = index <= currentStep ? "finish" : "wait";
            if (step.status === "cancelled") {
              stepStatus = "error"; // Dùng "error" để hiển thị dấu "x"
            }
            return (
              <Step
                key={index}
                title={step.title}
                status={stepStatus} // Thay đổi trạng thái nếu là bước hủy
              />
            );
          })}
        </Steps>
      </Row>
      <div style={addressSectionStyle}>
        <Title level={5}>Địa Chỉ Nhận Hàng</Title>
        <Text strong>{dataInfoOrder?.address?.name}</Text>
        <br />
        <Text>Số điện thoại:{dataInfoOrder?.address?.phoneNumber}</Text>
        <br />
        <Text>Địa chỉ: {dataInfoOrder?.address?.addressDetail}</Text>
        <Divider />
        {dataInfoOrder.status === "completed" && (
          <div>
            <Text>{updatedAtFormatted} - Giao hàng thành công</Text>
          </div>
        )}
      </div>

      {/* Sản phẩm */}
      <Card title="Chi Tiết Sản Phẩm" style={cardStyle}>
        <Table
          columns={productColumns}
          dataSource={productData}
          pagination={false}
          bordered
        />
      </Card>
      <div style={cardStyle}>
        <Row justify="space-between">
          <Text>Tổng tiền hàng:</Text>
          <Text>
            ₫{" "}
            {dataInfoOrder?.orderDetailResponses
              ?.reduce((total, item) => {
                const itemTotal =
                  item.productDetailId.discountPrice > 0
                    ? item.productDetailId.discountPrice * item.quantity
                    : item.productDetailId.defaultPrice * item.quantity;
                return total + itemTotal;
              }, 0)
              .toLocaleString()}
          </Text>
        </Row>
        <Row justify="space-between">
          <Text>Phí vận chuyển:</Text>
          <Text>
            ₫
            {dataInfoOrder?.deliveryFee != null
              ? dataInfoOrder.deliveryFee.toLocaleString()
              : "0"}
          </Text>
        </Row>
        {dataInfoOrder?.voucherId !== null && (
          <Row justify="space-between">
            <Text>Voucher:</Text>
            <div className="result_order_detail">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "linear-gradient(to right, #ff5722, #ff1744)",
                  borderRadius: "15px",
                  padding: "10px",
                  color: "#fff",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  height: "50px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {dataInfoOrder?.voucherId ? (
                      dataInfoOrder?.voucherId.discountPercent > 0 ? (
                        <span style={{ color: "#fff" }}>
                          Giảm giá {dataInfoOrder?.voucherId.discountPercent}%
                        </span>
                      ) : dataInfoOrder?.voucherId.discountAmount > 0 ? (
                        <span style={{ color: "#fff" }}>
                          Giảm giá{" "}
                          {new Intl.NumberFormat("vi-VN").format(
                            dataInfoOrder?.voucherId.discountAmount
                          )}
                          đ
                        </span>
                      ) : (
                        "Không áp dụng voucher"
                      )
                    ) : (
                      "Không có voucher"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Row>
        )}
        <Divider />
        <Row justify="space-between" align="middle">
          <Title level={5}>Thành tiền:</Title>
          <Title level={5} style={{ color: "#ff4d4f" }}>
            ₫{" "}
            {dataInfoOrder.totalAmount
              ? dataInfoOrder.totalAmount.toLocaleString()
              : "0"}
          </Title>
        </Row>
      </div>
    </div>
  );
};

export default CustomerInfoOrderDetail;
