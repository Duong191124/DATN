import React, { useEffect, useState } from "react";
import { Table, Space, Modal, notification } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { fetchDataVoucher, deleteVoucher } from "../../service/api.service";
import VoucherUpdateModal from "./voucher.update";
import VoucherCustomer from "./voucher.customer"; // Nhập component hiển thị khách hàng

const VoucherTable = ({ refreshData }) => {
    const [dataVoucher, setDataVoucher] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false); // Thêm trạng thái cho modal khách hàng
    const [selectedCustomers, setSelectedCustomers] = useState([]); // Khách hàng đã chọn để xem chi tiết
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

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
        loadData(); // Tải dữ liệu lần đầu
    }, []);

    useEffect(() => {
        loadData(); // Tải lại dữ liệu khi refreshData thay đổi
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
                        loadData(); // Tải lại dữ liệu sau khi xóa
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

    // Xử lý hiển thị modal khách hàng với danh sách khách hàng đã áp dụng cho voucher
    const handleShowCustomerDetail = (customers) => {
        if (customers && customers.length > 0) {
            setSelectedCustomers(customers); // Lưu khách hàng đã áp dụng vào state
            setIsCustomerModalOpen(true); // Mở modal
        } else {
            notification.warning({
                message: "Thông báo",
                description: "Voucher này chưa áp dụng cho khách hàng nào.",
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
            title: "Giảm giá (Số tiền)",
            dataIndex: "discountAmount",
        },
        {
            title: "Giảm giá (Phần trăm)",
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
                        onClick={() => handleShowCustomerDetail(record.customers)} // Gọi hàm hiển thị chi tiết khách hàng
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
                    appliedCustomers={selectedCustomers} // Truyền danh sách khách hàng đã áp dụng cho voucher
                    onClose={() => setIsCustomerModalOpen(false)} // Đóng modal
                    onApply={(selected) => console.log(selected)} // Xử lý khi khách hàng được áp dụng
                />
            )}
        </div>
    );
};

export default VoucherTable;
