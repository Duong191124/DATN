import React from 'react';
import { Layout, Avatar, Badge, Menu, Dropdown } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import './header.admin.css'; // Optional for styling
import logo from '../../../assets/react.svg';

const { Header } = Layout;

const userMenuItems = [
    {
      key: '1',
      label: 'Profile',
    },
    {
      key: '2',
      label: 'Logout',
    },
  ];

const HeaderAdmin = () => {
  return (
    <Header className="header-admin">
      <div className="header-left">
        <img src={logo} className="logo" alt='logo' />
      </div>
      <div className="header-right">
        <Badge count={5} className="notification-icon">
          <BellOutlined style={{ fontSize: '20px' }} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <span className="user-dropdown">
            <Avatar size="large" icon={<UserOutlined />} />
            <span className="user-name">Admin User</span>
          </span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderAdmin;