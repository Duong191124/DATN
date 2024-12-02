import React from "react";
import { Row, Col, Typography, Button, Card, Divider, Tag } from "antd";
import { BorderTopOutlined, LeftOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

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
        <Text type="secondary">Yêu cầu vào: 14:15 06-02-2024</Text>
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
        <Text type="secondary"> vào: 14:15 06-02-2024</Text>
      </Row>
      <Card style={cardStyle}>
        <Row justify="end" style={{ marginBottom: 16 }}>
          <Button style={{}}>Xem Shop</Button>
        </Row>
        <Row style={productStyle}>
          <Col span={2}>
            <img
              src="https://via.placeholder.com/100?text=Áo+Sơ+Mi"
              alt="Áo sơ mi"
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Col>
          <Col span={22} style={{ paddingLeft: 16 }}>
            <Title level={5}>
              Áo sơ mi cộc tay Original ODIN CLUB, Áo sơ mi form rộng unisex nam
              nữ, Local Brand ODIN CLUB
            </Title>
            <Row
              justify="space-between"
              align="middle"
              style={{ margin: "5px 0" }}
            >
              <Text>Trắng, M</Text>
              <Text style={{ fontSize: "16px" }}>
                115.000<sup>₫</sup>
              </Text>
            </Row>
            <Text type="secondary">x1</Text>
          </Col>
        </Row>
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
            <Text style={{ color: "gray" }}>Phương thức thanh toán </Text>
          </Col>
          <Col span={6} style={{ textAlign: "right", padding: "10px 0" }}>
            <Tag color="green">COD</Tag>
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
            <Text style={{ color: "gray" }}>Mã đơn hàng </Text>
          </Col>
          <Col span={6} style={{ textAlign: "right", padding: "10px 0" }}>
            <NavLink to={"/info-order-detail"}>240206T4UAHRJ9</NavLink>
          </Col>
        </Row>
      </Card>
      <div style={addressSectionStyle}>
        <Text style={{ fontSize: "14px" }}>
          Lý do: Thay đổi đơn hàng (màu sắc, kích thước, thêm mã giảm giá,...)
        </Text>
      </div>
    </div>
  );
};

export default CustomerInfoOrderCanceled;
