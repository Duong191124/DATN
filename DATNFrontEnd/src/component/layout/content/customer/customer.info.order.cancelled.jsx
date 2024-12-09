import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Card, Divider, Tag } from "antd";
import { BorderTopOutlined, LeftOutlined } from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import { orderFindByCode } from "../../../../service/api.service";
import moment from "moment";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;

const CustomerInfoOrderCanceled = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      const defaultLang = i18n.language || "vi";
      i18n.changeLanguage(defaultLang);
    }
  }, [i18n.language]);
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
          <LeftOutlined />{" "}
          <span style={{ fontSize: "18px" }}>{t("MES-135")}</span>
        </NavLink>
        <Text type="secondary">
          {t("MES-146")}: {updatedAtFormatted}
        </Text>
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
          {t("MES-147")}
        </Text>
        <Text type="secondary"> enter: {updatedAtFormatted}</Text>
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
                {`${t("MES-131")}: ${item.productDetailId?.code}`}
              </Title>
              <Row
                justify="space-between"
                align="middle"
                style={{ margin: "5px 0" }}
              >
                <Text>{`${t("MES-148")}: ${
                  item.productDetailId?.status === 1
                    ? `${t("MES-149")}`
                    : `${t("MES-150")}`
                }`}</Text>
                <Text style={{ fontSize: "16px" }}>
                  {item.price.toLocaleString()}
                  <sup>₫</sup>
                </Text>
              </Row>
              <Text type="secondary">{`${t("MES-133")}: x${
                item.quantity
              }`}</Text>
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
            <Text style={{ color: "gray" }}>{t("MES-151")} </Text>
          </Col>
          <Col span={6} style={{ textAlign: "right", padding: "10px 0" }}>
            <Text strong>{t("MES-152")}</Text>
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
            <Text style={{ color: "gray" }}>{t("MES-105")}</Text>
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
            <Text style={{ color: "gray" }}>{t("MES-153")}</Text>
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
          {t("MES-154")}: {dataInfoOrder?.note || "Không có lý do cụ thể"}
        </Text>
      </div>
    </div>
  );
};

export default CustomerInfoOrderCanceled;
