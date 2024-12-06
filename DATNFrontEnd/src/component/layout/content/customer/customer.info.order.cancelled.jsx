import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Card, Divider, Tag } from "antd";
import { BorderTopOutlined, LeftOutlined } from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import { orderFindByCode } from "../../../../service/api.service";
import moment from "moment";

const { Title, Text } = Typography;

const CustomerInfoOrderCanceled = () => {
  const cardStyle = {
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "16px 0px 0px 0px",
    marginBottom: 16,
  };

  const productStyle = {
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #ddd",
    padding: "15px 0",
  };

  const addressSectionStyle = {
    marginBottom: 16,
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  };
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
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
  const updatedAtFormatted = moment(dataInfoOrder.updatedAt).format(
    "DD-MM-YYYY HH:mm:ss"
  );
  console.log("a", dataInfoOrder);
  return (
    <div style={{ padding: 16, marginTop: "85px" }}>
      <Row
        justify="space-between"
        style={{
          backgroundColor: "#ffff",
          padding: "12px 16px",
          borderRadius: 8,
          alignItems: "center",
          border: "1px solid #ddd",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <NavLink
          to={"/info-order"}
          style={{
            color: "gray",
            padding: "6px 20px",
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <LeftOutlined /> <span style={{ fontSize: "18px" }}>Quay lại</span>
        </NavLink>
        <Text type="secondary">Yêu cầu vào: {updatedAtFormatted}</Text>
      </Row>
      <Row
        style={{
          marginBottom: 16,
          backgroundColor: "#FFFCF5",
          padding: "12px 16px",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ddd",
        }}
      >
        <Text style={{ color: "#ff4d4f", fontWeight: "500", fontSize: "20px" }}>
          Đã hủy đơn hàng
        </Text>
        <Text type="secondary"> vào: {updatedAtFormatted}</Text>
      </Row>
      <Card style={cardStyle}>
        {dataInfoOrder?.orderDetailResponses?.map((item, index) => (
          <Row key={index} style={productStyle}>
            <Col span={2}>
              <img
                src={item.productDetailId?.image}
                alt={item.productDetailId?.code}
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Col>
            <Col span={22} style={{ paddingLeft: 16 }}>
              <Title level={5}>
                {`Sản phẩm: ${item.productDetailId?.code}`}
              </Title>
              <Row
                justify="space-between"
                align="middle"
                style={{ margin: "5px 0" }}
              >
                <Text>{`Trạng thái: ${
                  item.productDetailId?.status === 1 ? "Còn hàng" : "Hết hàng"
                }`}</Text>
                <Text style={{ fontSize: "16px" }}>
                  {item.price.toLocaleString()}
                  <sup>₫</sup>
                </Text>
              </Row>
              <Text type="secondary">{`Số lượng: x${item.quantity}`}</Text>
            </Col>
          </Row>
        ))}
        <Row
          style={{
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Col
            span={18}
            style={{
              borderRight: "1px solid #ddd",
              padding: "10px 10px 10px 0",
              textAlign: "end",
            }}
          >
            <Text style={{ color: "gray" }}>Yêu cầu bởi </Text>
          </Col>
          <Col span={6} style={{ textAlign: "right", padding: "10px 0" }}>
            <Text strong>Người mua</Text>
          </Col>
        </Row>
        <Row
          style={{
            borderBottom: "1px solid #ddd",
          }}
        >
          <Col
            span={18}
            style={{
              borderRight: "1px solid #ddd",
              padding: "10px 10px 10px 0",
              textAlign: "end",
            }}
          >
            <Text style={{ color: "gray" }}>Phương thức thanh toán</Text>
          </Col>
          <Col span={6} style={{ textAlign: "right", padding: "10px 0" }}>
            <Tag color="green">
              {dataInfoOrder?.paymentResponses?.[0]?.paymentMethod?.toUpperCase() ||
                "N/A"}
            </Tag>
          </Col>
        </Row>
        <Row>
          <Col
            span={18}
            style={{
              borderRight: "1px solid #ddd",
              padding: "10px 10px 10px 0",
              textAlign: "end",
            }}
          >
            <Text style={{ color: "gray" }}>Mã đơn hàng</Text>
          </Col>
          <Col span={6} style={{ textAlign: "right", padding: "10px 0" }}>
            <NavLink to={`/info-order-detail?code=${dataInfoOrder?.code}`}>
              {dataInfoOrder?.code || "N/A"}
            </NavLink>
          </Col>
        </Row>
      </Card>
      <div style={addressSectionStyle}>
        <Text style={{ fontSize: "14px" }}>
          Lý do: {dataInfoOrder?.note || "Không có lý do cụ thể"}
        </Text>
      </div>
    </div>
  );
};

export default CustomerInfoOrderCanceled;
