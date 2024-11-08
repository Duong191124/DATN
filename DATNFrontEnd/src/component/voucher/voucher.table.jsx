import React, { useEffect, useState } from "react";
import { Table, Space, Modal, notification } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined,RetweetOutlined } from "@ant-design/icons"; // hoặc ExclamationCircleOutlined
import { fetchDataVoucher, deleteVoucher, fetchCustomerList, chandleStatus } from "../../service/api.service";
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
                const currentDate = new Date(); // Lấy ngày hiện tại
                const updatedVouchers = response.data.data.map(voucher => {
                    const expirationDate = new Date(voucher.expirationDate);
                    if (expirationDate < currentDate) {
                        return { ...voucher, status: 0 }; // Thay đổi status thành 0 (Hết hạn)
                    }
                    return voucher;
                });
                setDataVoucher(updatedVouchers);
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

    const handleChangeStatus = async (voucher) => {
        const expirationDate = new Date(voucher.expirationDate);
        const currentDate = new Date();

        // Kiểm tra nếu voucher đã hết hạn
        if (expirationDate < currentDate) {
            notification.warning({
                message: "Không thể kích hoạt lại voucher",
                description: "Voucher đã hết hạn. Vui lòng cập nhật ngày hết hạn để kích hoạt lại.",
            });
            return; // Dừng lại nếu voucher đã hết hạn
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
            title: "Giảm giá (VNĐ)",
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
                        onClick={() => handleDelete(record.id, record.customers)} // Gọi handleDelete với customers
                    />
                     <PlusCircleOutlined
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => handleShowCustomerDetail(record.customers, record.id)}
                    />
                    <RetweetOutlined // Hoặc ExclamationCircleOutlined
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
