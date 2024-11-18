import React, { useState } from "react";
import {
  Layout,
  Avatar,
  Badge,
  Dropdown,
  message,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  BellOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
  BankOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import NoticeDrawer from "../../../notice/notice.drawer";

const { Header } = Layout;

// Styled Components
const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Logo = styled.img`
  height: 32px;
  width: auto;
  vertical-align: middle;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-left: 8px;
`;

const IconWrapper = styled.div`
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;

const MenuButton = styled.div`
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 6px;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
`;
const Sell = styled.div`
  cursor: pointer;
  font-size: 24px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ddd;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
`;

const HeaderAdmin = ({ collapsed, setCollapsed }) => {
  const [openNotice, setOpenNotice] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("loginStatus");
    message.success("Logged out successfully");
    navigate("/login");
  };
  const handleCounterSaleClick = () => {
    navigate("/counter-sales");
  };
  const userMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "2",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "3",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogOut,
      danger: true,
    },
  ];

  const showNotice = () => {
    setOpenNotice(true);
  };

  return (
    <>
      <StyledHeader>
        <HeaderLeft>
          <MenuButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </MenuButton>
          <Link to="/admin">
            <Logo
              src="https://logopond.com/logos/58fef5b7f302e7d32bfc17a21f56b008.png"
              alt="Logo"
            />
          </Link>
        </HeaderLeft>

        <HeaderRight>
          <Sell onClick={handleCounterSaleClick}>
            <Tooltip title="Bán hàng tại quầy" placement="top">
              <DollarCircleOutlined />
            </Tooltip>
          </Sell>
          <IconWrapper>
            <Badge count={5} onClick={showNotice} offset={[-2, 2]}>
              <BellOutlined
                style={{
                  fontSize: 20,
                  color: "rgba(0, 0, 0, 0.65)",
                }}
              />
            </Badge>
          </IconWrapper>

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
            arrow
          >
            <UserSection>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#1890ff",
                  verticalAlign: "middle",
                }}
              />
              <UserName>Admin User</UserName>
            </UserSection>
          </Dropdown>
        </HeaderRight>
      </StyledHeader>

      <NoticeDrawer openNotice={openNotice} setOpenNotice={setOpenNotice} />
    </>
  );
};

export default HeaderAdmin;
