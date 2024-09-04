import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [current, setCurrent] = useState('');
    const navigate = useNavigate();
    const onClick = (e) => {
        setCurrent(e.key);
    };
    const items = [
        {
            label: <Link to={"promotion"}>Promotion</Link> ,
            key: 'promotion',
            icon: <MailOutlined />,
        },
        {
            label: <Link to={"category"}>Category</Link>,
            key: 'category',
            icon: <SettingOutlined />,
        },
    ];

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    )
}

export default Header;