import React, { useEffect, useState } from "react";
import { Table, Space, Modal, notification, DatePicker, Button, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined, RetweetOutlined } from "@ant-design/icons"; // hoặc ExclamationCircleOutlined
import { fetchDataVoucher, deleteVoucher, fetchCustomerList, chandleStatus } from "../../service/api.service";
import VoucherUpdateModal from "./voucher.update";
import VoucherCustomer from "./voucher.customer";
import moment from 'moment'; // Đảm bảo bạn có cài moment.js để xử lý ngày tháng


const VoucherTable = ({ refreshData }) => {
    const [dataVoucher, setDataVoucher] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    // Lấy danh sách khách hàng khi component mount
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetchCustomerList();
                if (res && res.data && res.data.data) {
                    setCustomers(res.data.data.content);
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh sách khách hàng",
                });
            }
        };
        fetchCustomers();
    }, []);

    const loadData = async (dateRange = []) => {
        try {
            const response = await fetchDataVoucher();
            if (response.data.data) {
                const currentDate = new Date(); // Ngày hiện tại
                const updatedVouchers = response.data.data.map(voucher => {
                    const expirationDate = new Date(voucher.expirationDate);
                    return {
                        ...voucher,
                        status: expirationDate < currentDate ? 0 : voucher.status, // Nếu quá hạn, đặt status = 0
                    };
                });
    
                const filteredVouchers = updatedVouchers.filter((voucher) => {
                    if (dateRange.length === 0) return true;
                    const expirationDate = moment(voucher.expirationDate);
                    const [startDate, endDate] = dateRange;
                    return expirationDate.isBetween(startDate, endDate, null, "[]");
                });
    
                setDataVoucher(filteredVouchers);
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Không thể lấy dữ liệu voucher"
            });
        }
    };
    
    useEffect(() => {
        loadData();
    }, [refreshData]);

    const handleDelete = (id, customers) => {
        if (customers && customers.length > 0) {
            // Nếu voucher có khách hàng áp dụng, không cho phép xóa
            notification.warning({
                message: "Không thể xóa",
                description: "Voucher này đã áp dụng cho khách hàng và không thể xóa.",
            });
            return;
        }

        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc chắn muốn xóa voucher này?",
            onOk: async () => {
                try {
                    const res = await deleteVoucher(id);
                    if (res.status === 200 || res.status === 204) {
                        notification.success({
                            message: "Xóa Voucher",
                            description: "Xóa voucher thành công."
                        });
                        loadData();
                    } else {
                        notification.error({
                            message: "Xóa Voucher",
                            description: "Đã có lỗi xảy ra khi xóa voucher."
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Xóa Voucher",
                        description: "Đã có lỗi xảy ra khi xóa voucher."
                    });
                }
            }
        });
    };


    const handleEdit = (voucher) => {
        setSelectedVoucherId(voucher.id);
        setIsModalOpen(true);
    };

    const handleUpdateSuccess = () => {
        setIsModalOpen(false);
        loadData();
    };

    const handleShowCustomerDetail = (customerIds, voucher) => {
        // Kiểm tra nếu voucher đã hết hạn
        if (voucher.status === 0) {
            notification.warning({
                message: "Không thể áp dụng",
                description: "Voucher này đã hết hạn và không thể áp dụng cho khách hàng.",
            });
            return; // Dừng lại nếu voucher đã hết hạn
        }

        setSelectedVoucherId(voucher.id);
        if (customerIds && customerIds.length > 0) {
            const selectedCustomer = customers.filter(customer => customerIds.includes(customer.id));
            setSelectedCustomers(selectedCustomer);
            setIsCustomerModalOpen(true);
        } else {
            notification.warning({
                message: "Thông báo",
                description: "Voucher này chưa áp dụng cho khách hàng nào.",
            });
            setSelectedCustomers([]);
            setIsCustomerModalOpen(true);
        }
    };



    const handleApply = (selected) => {
        loadData();
    };

    const handleChangeStatus = async (voucher) => {
        const expirationDate = new Date(voucher.expirationDate);
        const currentDate = new Date();
    
        if (expirationDate < currentDate) {
            notification.warning({
                message: "Không thể kích hoạt lại voucher",
                description: "Voucher đã hết hạn. Vui lòng cập nhật ngày hết hạn để kích hoạt lại.",
            });
            return;
        }
    
        try {
            const res = await chandleStatus(voucher.id);
            if (res.status === 200 || res.status === 204) {
                notification.success({
                    message: "Cập nhật trạng thái",
                    description: "Cập nhật trạng thái voucher thành công."
                });
                loadData();
            } else {
                notification.error({
                    message: "Cập nhật trạng thái",
                    description: "Đã có lỗi xảy ra khi cập nhật trạng thái voucher."
                });
            }
        } catch (error) {
            notification.error({
                message: "Cập nhật trạng thái",
                description: "Đã có lỗi xảy ra khi cập nhật trạng thái voucher."
            });
        }
    };
    
    const columns = [
        {
            title: 'STT',
            render: (text, record, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Tên Voucher",
            dataIndex: "code",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập tên voucher"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()} // Kích hoạt tìm kiếm khi nhấn Enter
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()} // Kích hoạt tìm kiếm
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters() && confirm()} // Xóa bộ lọc và làm mới tìm kiếm
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                return record.code && record.code.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập số lượng"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()} // Kích hoạt tìm kiếm khi nhấn Enter
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()} // Kích hoạt tìm kiếm
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters() && confirm()} // Xóa bộ lọc và làm mới tìm kiếm
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                const filterValue = parseInt(value, 10); // Chuyển giá trị bộ lọc thành số nguyên
                return record.quantity >= filterValue;
            },
        },
        {
            title: "Giảm giá (VNĐ)",
            dataIndex: "discountAmount",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập số tiền"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                const filterValue = parseFloat(value);
                return record.discountAmount >= filterValue; // Hiển thị các bản ghi có discountAmount lớn hơn hoặc bằng giá trị lọc
            },
        },
        {
            title: "Giảm giá (%)",
            dataIndex: "discountPercent",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập phần trăm"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                const filterValue = parseFloat(value);
                return record.discountPercent >= filterValue; // Hiển thị các bản ghi có discountPercent lớn hơn hoặc bằng giá trị lọc
            },
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expirationDate",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <DatePicker.RangePicker
                        onChange={(dates) => {
                            if (dates) {
                                const [start, end] = dates;
                                setSelectedKeys([[start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]]); // Cập nhật bộ lọc ngày
                            } else {
                                setSelectedKeys([]); // Xóa bộ lọc ngày
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                    <Space style={{ marginTop: '8px' }}>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ borderRadius: '5px', marginRight: '8px' }}
                        >
                            Tìm kiếm
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                if (!value || value.length === 0) return true; // Nếu không có bộ lọc, cho phép tất cả
                const [startDate, endDate] = value;
                const recordDate = moment(record.expirationDate); // Sử dụng moment để so sánh ngày
                return recordDate.isBetween(startDate, endDate, null, '[]'); // Kiểm tra ngày trong khoảng
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            filters: [
                { text: 'Hoạt động', value: 1 },
                { text: 'Hết hạn', value: 0 },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const statusText = status === 1 ? "Hoạt động" : "Hết hạn";
                const statusColor = status === 1 ? "green" : "red"; // Đặt màu sắc tương ứng
                return (
                    <span style={{ color: statusColor }}>
                        {statusText}
                    </span>
                );
            }
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleEdit(record)}
                    />
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(record.id, record.customers)}
                    />
                    <PlusCircleOutlined
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => handleShowCustomerDetail(record.customers, record)} // Truyền đúng đối tượng record
                    />
                    <RetweetOutlined
                        style={{ color: "aqua", cursor: "pointer" }}
                        onClick={() => handleChangeStatus(record)}
                    />
                </Space>
            )
        }
    ];



    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataVoucher}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: false,
                    onChange: (page, pageSize) => {
                        setPagination({ current: page, pageSize });
                    },
                }}
                rowKey="id"
            />
            {isModalOpen && (
                <VoucherUpdateModal
                    visible={isModalOpen}
                    voucherId={selectedVoucherId}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleUpdateSuccess}
                />
            )}
            {isCustomerModalOpen && (
                <VoucherCustomer
                    appliedCustomers={selectedCustomers}
                    onClose={() => setIsCustomerModalOpen(false)}
                    onApply={handleApply}
                    voucherId={selectedVoucherId}
                    onRefresh={loadData}
                />
            )}
        </div>
    );
};

export default VoucherTable;
