import { Table, Space, Modal, notification } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { deletePromotionAPI } from '../../service/api.service';
import PromotionUpdate from "./promotion.update";
import { useState } from "react";

const PromotionTable = (props) => {
    const { loadData, dataPromotion } = props;

    // Trạng thái để quản lý việc hiển thị modal và dữ liệu cần cập nhật
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
    });
    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: 'Bạn có muốn xóa khuyến mãi này không?',
            content: 'Sau khi xóa, bạn sẽ không thể phục hồi dữ liệu này.',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: () => handleDelete(id),
        });
    };

    const handleDelete = async (id) => {
        try {
            const res = await deletePromotionAPI(id);
            if (res.status === 200) {
                notification.success({
                    message: "Xóa Khuyến Mại",
                    description: "Xóa khuyến mại thành công."
                });
                loadData(); // Gọi lại hàm loadData sau khi xóa thành công
            } else {
                notification.error({
                    message: "Xóa Khuyến Mại",
                    description: "Đã có lỗi xảy ra khi xóa khuyến mại."
                });
            }
        } catch (error) {
            notification.error({
                message: "Xóa Khuyến Mại",
                description: "Đã có lỗi xảy ra khi xóa khuyến mại."
            });
        }
    };

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => 
                (pagination.current - 1) * pagination.pageSize + index + 1, // Tính toán lại index
        },
        {
            title: 'ID',
            dataIndex: 'id', // Hiển thị ID từ cơ sở dữ liệu
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
        },
        {
            title: 'Phần trăm giảm giá',
            dataIndex: 'discountPercent',
        },
        {
            title: 'Số tiền giảm giá',
            dataIndex: 'discountAmount',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'
            ),
        },
        {
            title: 'Chi tiết sản phẩm',
            dataIndex: 'productDetailsId',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => {
                            setDataUpdate(record); // Lưu dữ liệu khuyến mãi vào state
                            setIsModalUpdateOpen(true); // Mở modal
                        }}
                    />
                    <DeleteOutlined
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => showDeleteConfirm(record.id)} // Gọi modal xác nhận khi xóa
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={dataPromotion}
                columns={columns}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    onChange: (page, pageSize) => {
                        setPagination({ current: page, pageSize });
                    },
                }}
                rowKey="id"
            />
            <PromotionUpdate
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                loadData={loadData} // Gọi lại loadData khi cập nhật thành công
            />
        </>
    );
};

export default PromotionTable;
