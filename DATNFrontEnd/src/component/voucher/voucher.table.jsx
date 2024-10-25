import React, { useEffect, useState } from "react";
import { Table, Space, Modal, notification } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchDataVoucher, deleteVoucher, fetchCustomerList } from "../../service/api.service";
import VoucherUpdateModal from "./voucher.update";
import VoucherCustomer from "./voucher.customer";

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

    const loadData = async () => {
        try {
            const response = await fetchDataVoucher();
            if (response.data.data) {
                setDataVoucher(response.data.data);
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

    const handleDelete = (id) => {
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

    const handleShowCustomerDetail = (customerIds, voucherId) => {
        setSelectedVoucherId(voucherId);
        if (customerIds && customerIds.length > 0) { // Kiểm tra nếu customerIds có dữ liệu
            const selectedCustomer = customers.filter(customer => customerIds.includes(customer.id)); // Lấy danh sách khách hàng
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
        console.log("Khách hàng được áp dụng:", selected);
        loadData();
    };

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "ID",
            dataIndex: 'id',
        },
        {
            title: "Mã Voucher",
            dataIndex: "code",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
        },
        {
            title: "Giảm giá (Số tiền)",
            dataIndex: "discountAmount",
        },
        {
            title: "Giảm giá (%)",
            dataIndex: "discountPercent",
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expirationDate",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => (status === 1 ? "Hoạt động" : "Hết hạn")
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => handleShowCustomerDetail(record.customers, record.id)}
                    />
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleEdit(record)}
                    />
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(record.id)}
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
