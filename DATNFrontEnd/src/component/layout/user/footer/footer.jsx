import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Col, Row, Space, Typography } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import ChatBox from "../../content/chat/chat";
import BackToTop from "../backtotop/backtotop";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;

const FooterWrapper = styled.footer`
  background: #000;
  color: #222222;
  padding: 60px 0 0;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const FooterSection = styled.div`
  margin-bottom: 40px;
`;

const FooterTitle = styled(Title)`
  &.ant-typography {
    color: #fff !important;
    font-size: 18px !important;
    margin-bottom: 24px !important;
    font-weight: 600 !important;
    position: relative;
    padding-bottom: 12px;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: #fff;
    }
  }
`;

const FooterLink = styled(NavLink)`
  color: #a0a0a0 !important;
  font-size: 14px;
  transition: all 0.3s ease;
  display: block;
  margin-bottom: 12px;
  text-decoration: none;

  &:hover {
    color: #fff !important;
    transform: translateX(5px);
  }
`;

const ContactInfo = styled(Text)`
  &.ant-typography {
    color: #a0a0a0 !important;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;

    .anticon {
      color: #fff;
    }

    strong {
      color: #fff;
    }
  }
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.3s ease;
  margin-right: 12px;

  &:hover {
    background: #fff;
    color: #000;
    transform: translateY(-3px);
  }
`;

const BottomBar = styled.div`
  background: #111;
  padding: 20px 0;
  text-align: center;
`;

const Copyright = styled.div`
  color: #a0a0a0;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #a0a0a0;
    }
  }
`;

const CertificationImage = styled.img`
  height: 36px;
  filter: grayscale(100%) brightness(1.2);
  transition: filter 0.3s ease;

  &:hover {
    filter: grayscale(0%);
  }
`;

const Footer = () => {
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("i18nextLng") || "vi";
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);
  return (
    <FooterWrapper>
      <BackToTop />
      <ChatBox />
      <FooterContainer>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle level={4}>{t("MES-078")}</FooterTitle>
              <Space direction="vertical" size={0}>
                <FooterLink to="/">{t("MES-079")}</FooterLink>
                <FooterLink to="/">{t("MES-080")}</FooterLink>
                <FooterLink to="/">{t("MES-081")}</FooterLink>
                <FooterLink to="/">{t("MES-082")}</FooterLink>
              </Space>
            </FooterSection>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle level={4}>{t("MES-083")}</FooterTitle>
              <Space direction="vertical" size={0}>
                <FooterLink to="/">{t("MES-084")}</FooterLink>
                <FooterLink to="/">{t("MES-085")}</FooterLink>
                <FooterLink to="/">{t("MES-086")}</FooterLink>
                <FooterLink to="/">{t("MES-087")}</FooterLink>
              </Space>
            </FooterSection>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle level={4}>{t("MES-088")}</FooterTitle>
              <Space direction="vertical" size={4}>
                <ContactInfo>
                  <PhoneOutlined />
                  <span>
                    {t("MES-089")}: <strong>0999.99.99.99</strong>
                  </span>
                </ContactInfo>
                <ContactInfo>
                  <PhoneOutlined />
                  <span>
                    {t("MES-090")}: <strong>022.2222.2222</strong>
                  </span>
                </ContactInfo>
                <ContactInfo>
                  <MailOutlined />
                  <span>
                    Email: <strong>support@sports-shirt.com</strong>
                  </span>
                </ContactInfo>
                <ContactInfo>
                  <ClockCircleOutlined />
                  <span>
                    {t("MES-091")}: <strong>Mon-Sat 9:00 - 18:00</strong>
                  </span>
                </ContactInfo>
              </Space>
            </FooterSection>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle level={4}>{t("MES-092")}</FooterTitle>
              <div>
                <SocialLink href="https://twitter.com" target="_blank">
                  <TwitterOutlined />
                </SocialLink>
                <SocialLink href="https://youtube.com" target="_blank">
                  <YoutubeOutlined />
                </SocialLink>
                <SocialLink href="https://facebook.com" target="_blank">
                  <FacebookOutlined />
                </SocialLink>
                <SocialLink href="https://linkedin.com" target="_blank">
                  <LinkedinOutlined />
                </SocialLink>
              </div>
            </FooterSection>
          </Col>
        </Row>
      </FooterContainer>

      <BottomBar>
        <FooterContainer>
          <Copyright>
            <span>© 2024 SPORTS SHIRT. {t("MES-093")}</span>
            <NavLink to="/">{t("MES-094")}</NavLink>
            <NavLink to="/">{t("MES-095")}</NavLink>
            <CertificationImage
              src="https://theme.hstatic.net/200000174405/1001111911/14/logo_bct.png?v=1275"
              alt="Certification"
            />
          </Copyright>
        </FooterContainer>
      </BottomBar>
    </FooterWrapper>
  );
};

export default Footer;
