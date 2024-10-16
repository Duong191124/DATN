import { useState } from "react";
import {
  TeamOutlined,
  ProductOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <TeamOutlined />,
    label: <Link to="/counter-sales">Counter-Sales Management</Link>,

  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: <Link to="/order">Bill Management</Link>,
  },
  {
    key: "3",
    icon: <ProductOutlined />,
    label: <Link to="/products">Product Management</Link>,
  },
  {
    key: "4",
    icon: <TeamOutlined />,
    label: <Link to="/staff">Staff Management</Link>,
  },
  {
    key: "5",
    icon: <TeamOutlined />,
    label: <Link to="/colors">Color Management</Link>,
  },
  {
    key: "6",
    icon: <TeamOutlined />,
    label: <Link to="/sizes">Size Management</Link>,
  },
  {
    key: "7",
    icon: <TeamOutlined />,
    label: <Link to="/collars">Collar Management</Link>,
  },
  {
    key: "8",
    icon: <TeamOutlined />,
    label: <Link to="/brands">Brand Management</Link>,
  },
  {
    key: "9",
    icon: <TeamOutlined />,
    label: <Link to="/categories">Category Management</Link>,
  },
  {
    key: "10",
    icon: <SettingOutlined />,
    label: <Link to="/sleeves">Sleeve Management</Link>,
  },
  {
    key: "10",
    icon: <SettingOutlined />,
    label: <Link to="/permission">Permission Management</Link>,
  },
  {
    key: "11",
    icon: <SettingOutlined />,
    label: "Navigation Three",
  },
];
const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};
const levelKeys = getLevelKeys(items);
const NavbarAdmin = () => {
  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "23"]);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  return (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["123"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
        }}
        className="menu-sidebar"
        items={items}
      />
    </>
  );
};
export default NavbarAdmin;
