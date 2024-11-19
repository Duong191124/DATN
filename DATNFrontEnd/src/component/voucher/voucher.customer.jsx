import React, { useEffect, useState } from 'react';
import { Button, Modal, notification, Table, Checkbox, Input, Space, Select } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { fetchCustomerList, updateVoucherCustomer } from '../../service/api.service';

const { Option } = Select;

const VoucherCustomer = ({ appliedCustomers, onApply, onClose, voucherId, onRefresh }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [genderFilter, setGenderFilter] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetchCustomerList();
                if (res && res.data && res.data.data) {
                    const customerData = res.data.data.content || [];
                    setCustomers(customerData);

                    if (appliedCustomers && appliedCustomers.length > 0) {
                        const appliedCustomerIds = appliedCustomers.map(customer => customer.id);
                        setSelectedCustomers(appliedCustomerIds);
                    } else {
                        setSelectedCustomers([]);
                    }
                } else {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không thể tải danh sách khách hàng',
                    });
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi tải danh sách khách hàng',
                });
            }
        };

        fetchCustomers();
    }, [appliedCustomers]);

    const filteredCustomers = customers
        .filter(customer => customer.id !== 1) // Ẩn khách hàng có id = 1
        .filter(customer => {
            if (genderFilter === 'male') return customer.gender === 1;
            if (genderFilter === 'female') return customer.gender === 2;
            if (genderFilter === 'other') return customer.gender !== 1 && customer.gender !== 2;
            return true;
        })
        .filter(customer => {
            if (!searchText) return true;
            const lowerSearch = searchText.toLowerCase();
            return (
                customer.username.toLowerCase().includes(lowerSearch) ||
                customer.phoneNumber.toLowerCase().includes(lowerSearch)
            );
        });

    useEffect(() => {
        const allSelected =
            filteredCustomers.length > 0 &&
            filteredCustomers.every(customer => selectedCustomers.includes(customer.id));
        setSelectAll(allSelected);
    }, [filteredCustomers, selectedCustomers]);

    const handleGenderFilterChange = value => {
        setGenderFilter(value);
    };

    const handleSelectAll = e => {
        const { checked } = e.target;

        setSelectAll(checked);

        // Nếu không có bộ lọc giới tính, chọn/tắt chọn tất cả khách hàng ngoại trừ khách hàng có id = 1
        if (genderFilter === null) {
            const allCustomerIds = customers.filter(customer => customer.id !== 1).map(customer => customer.id);
            setSelectedCustomers(checked ? allCustomerIds : []);
        } else {
            // Nếu có bộ lọc giới tính, chọn/tắt chọn khách hàng theo giới tính, ngoại trừ khách hàng có id = 1
            const filteredCustomersByGender = customers.filter(customer => {
                if (genderFilter === 'male') return customer.gender === 1;
                if (genderFilter === 'female') return customer.gender === 2;
                return false;
            }).filter(customer => customer.id !== 1); // Lọc bỏ khách hàng có id = 1

            const filteredIds = filteredCustomersByGender.map(customer => customer.id);
            setSelectedCustomers(checked ? filteredIds : []);
        }
    };

    const handleSelect = customerId => {
        setSelectedCustomers(prev =>
            prev.includes(customerId) ? prev.filter(id => id !== customerId) : [...prev, customerId]
        );
    };

    const handleSearch = e => {
        setSearchText(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchText('');
    };

    const handleApply = async () => {
        try {
            const payload = { customers: selectedCustomers.length > 0 ? selectedCustomers : [] };
            if (!voucherId) {
                throw new Error('Voucher ID is required');
            }
            await updateVoucherCustomer(voucherId, payload);
            notification.success({
                message: 'Thành công',
                description: 'Đã áp dụng voucher cho khách hàng thành công',
            });

            const selectedCustomerDetails = customers.filter(customer =>
                selectedCustomers.includes(customer.id)
            );
            onApply(selectedCustomerDetails);
            onRefresh();
            onClose();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi áp dụng voucher cho khách hàng',
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            width: '10%',
        },
        {
            title: 'Tên Khách Hàng',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
            width: '25%',
        },
        {
            title: 'Giới tính',
            key: 'gender',
            render: (_, record) => <p>{record.gender === 1 ? 'Nam' : record.gender === 2 ? 'Nữ' : 'Khác'}</p>,
            width: '15%',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
            width: '20%',
        },
        {
            title: 'Chọn',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={selectedCustomers.includes(record.id)}
                    onChange={() => handleSelect(record.id)}
                />
            ),
            width: '10%',
        }
    ];

    return (
        <Modal
            title="Danh sách Khách Hàng"
            open={true}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="apply" type="primary" onClick={handleApply}>
                    Áp dụng
                </Button>,
            ]}
            width={800}
        >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                        value={searchText}
                        onChange={handleSearch}
                        prefix={<SearchOutlined />}
                        suffix={searchText && <ClearOutlined onClick={handleClearSearch} style={{ cursor: 'pointer' }} />}
                        allowClear
                        style={{ width: 300 }}
                    />
                    <Select
                        placeholder="Lọc theo giới tính"
                        onChange={handleGenderFilterChange}
                        allowClear
                        style={{ width: 150 }}
                    >
                        <Option value="male">Nam</Option>
                        <Option value="female">Nữ</Option>
                        <Option value="other">Khác</Option>
                    </Select>
                </Space>
                <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                >
                    {selectAll ? "Bỏ chọn tất cả" : genderFilter ? `Chọn ${genderFilter === 'male' ? 'nam' : 'nữ'}` : "Chọn tất cả"}
                </Checkbox>

            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredCustomers}
                pagination={{ pageSize: 5 }}
            />
        </Modal>
    );
};

export default VoucherCustomer;
