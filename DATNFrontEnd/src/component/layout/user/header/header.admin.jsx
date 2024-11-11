import React, { useState } from 'react';
import { Layout, Avatar, Badge, Dropdown, message } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import './header.admin.css'; // Optional for styling
import logo from '../../../../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import NoticeDrawer from '../../../notice/notice.drawer';

const { Header } = Layout;

const HeaderAdmin = () => {
  const [openNotice, setOpenNotice] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("loginStatus")
    message.success("Logout")
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: "1",
      label: "Profile",
    },
    {
      label: (
        <p onClick={handleLogOut}>Logout</p>
      ),
      key: "2",
    },
  ];

  const showNotice = () => {
    setOpenNotice(true);
  }

  return (
    <>
      <Header className="header-admin">
        <div className="header-left">
          <Link to="/admin">
            <img src={logo} className="logo" alt='logo' />
          </Link>
        </div>
        <div
          style={{
            gap: 15
          }}
          className="header-right"
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <span
              className="user-dropdown">
              <Avatar size="large" icon={<UserOutlined />} />
              <span className="user-name">Admin User</span>
            </span>
          </Dropdown>
          <Badge
            count={5}
            onClick={() => {
              showNotice();
            }}
            style={{
              cursor: 'pointer'
            }}
          >
            <BellOutlined style={{
              fontSize: 25,
              cursor: 'pointer'
            }} />
          </Badge>
        </div>
      </Header>
      <NoticeDrawer
        openNotice={openNotice}
        setOpenNotice={setOpenNotice}
      />
    </>
  );
};

export default HeaderAdmin;
