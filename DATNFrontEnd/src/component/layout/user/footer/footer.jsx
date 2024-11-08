import { NavLink } from "react-router-dom";
import { Col, Row, Space, Tag, Typography } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import "./footer.css";

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <div className="footer">
      <div
        className="footer-container"
        style={{ padding: "40px 20px" }}
      >
        <Row gutter={32} justify="center">
          {/* About Us Section */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>About Us</Title>
            <Space direction="vertical" size="small" className="footer-content">
              <NavLink to="/">Our Story</NavLink>
              <NavLink to="/">Careers</NavLink>
              <NavLink to="/">Company History</NavLink>
              <NavLink to="/">Branches</NavLink>
            </Space>
          </Col>

          {/* Customer Support Section */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Customer Support</Title>
            <Space direction="vertical" size="small" className="footer-content">
              <NavLink to="/">Customer Service</NavLink>
              <NavLink to="/">Order Guide</NavLink>
              <NavLink to="/">Return Process</NavLink>
              <NavLink to="/">Shipping Methods</NavLink>
            </Space>
          </Col>

          {/* Contact Section */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Contact</Title>
            <Space direction="vertical" size="small" className="footer-content">
              <Text strong>Phone: 0999.99.99.99</Text>
              <Text>
                Warranty Support: <br />
                <Text strong>022.2222.2222</Text>
              </Text>
              <Text>
                Business Inquiries: <br />
                <Text strong>03.3333.3333</Text>
              </Text>
            </Space>
          </Col>

          {/* Social Links Section */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4}>Connect with Us</Title>
            <Space size="middle" wrap>
              <Tag icon={<TwitterOutlined />} color="#55acee" className="social-tag">
                Twitter
              </Tag>
              <Tag icon={<YoutubeOutlined />} color="#cd201f" className="social-tag">
                YouTube
              </Tag>
              <Tag icon={<FacebookOutlined />} color="#3b5999" className="social-tag">
                Facebook
              </Tag>
              <Tag icon={<LinkedinOutlined />} color="#0077b5" className="social-tag">
                <NavLink to="https://linkedin.com">LinkedIn</NavLink>
              </Tag>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom" style={{ textAlign: "center", padding: "20px 0", backgroundColor: "#e1e4e8" }}>
        <p>
          Copyright © 2024{" "}
          <NavLink to="/" className="name-brand">
            SPORTS SHIRT
          </NavLink>{" "}
          <NavLink to="/" className="image-footer-bottom">
            <img
              src="https://theme.hstatic.net/200000174405/1001111911/14/logo_bct.png?v=1275"
              alt="Brand Logo"
              style={{ marginLeft: "10px", verticalAlign: "middle", height: "30px" }}
            />
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Footer;
