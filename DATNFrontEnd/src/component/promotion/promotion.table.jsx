import React, { useState } from 'react';
import { Table, Space, Modal, notification, Button } from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { deletePromotionAPI, fetchDataProductDetail } from '../../service/api.service';
import PromotionUpdate from "./promotion.update";
import ProductDetailModal from './promotion.product'; // Import modal chi tiết sản phẩm

const PromotionTable = (props) => {
    const { loadData, dataPromotion } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isProductDetailModalVisible, setIsProductDetailModalVisible] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [promotionId, setPromotionId] = useState(null); // Định nghĩa promotionId
    const [selectedDetails, setSelectedDetails] = useState([]); // Định nghĩa selectedDetails


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

    // Hiển thị modal chi tiết sản phẩm
    const showProductDetails = async (productDetailsIds, promotionId) => {
        try {
            const res = await fetchDataProductDetail();
            if (res && res.data.data) {
                // Lọc chỉ sản phẩm có id trong productDetailsIds
                const filteredProductDetails = res.data.data.filter(product =>
                    productDetailsIds.includes(product.id)
                );
                setProductDetails(filteredProductDetails); // Cập nhật danh sách chi tiết sản phẩm
                setSelectedProductIds(productDetailsIds); // Lưu lại product details đã được chọn
                setPromotionId(promotionId); // Lưu promotionId
                setIsProductDetailModalVisible(true); // Hiển thị modal
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Không thể tải danh sách chi tiết sản phẩm",
            });
        }
    };

    // Cập nhật modal chi tiết sản phẩm sau khi người dùng áp dụng thay đổi
    const handleApplyProductDetails = (selectedIds) => {
        setSelectedProductIds(selectedIds);
        setIsProductDetailModalVisible(false); // Đóng modal sau khi áp dụng
    };

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: 'ID',
            dataIndex: 'id',
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
            title: 'Phần trăm giảm giá(%)',
            dataIndex: 'discountPercent',
        },
        {
            title: 'Số tiền giảm giá(VNĐ)',
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
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => {
                            setDataUpdate(record);
                            setIsModalUpdateOpen(true);
                        }}
                    />
                    <DeleteOutlined
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => showDeleteConfirm(record.id)}
                    />
                    <InfoCircleOutlined
                        style={{ color: 'orange', cursor: 'pointer' }}
                        onClick={() => showProductDetails(record.productDetailsId, record.id)} // Đảm bảo promotionId có giá trị
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
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setPagination({ current: page, pageSize });
                    },
                    pageSizeOptions: ['5', '10', '20'],
                }}
                rowKey="id"
            />
            <PromotionUpdate
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                loadData={loadData}
            />
            {/* Modal chi tiết sản phẩm */}
            <ProductDetailModal
                isVisible={isProductDetailModalVisible}
                onClose={() => setIsProductDetailModalVisible(false)}
                selectedProductDetails={selectedProductIds}
                onApply={handleApplyProductDetails}
                id={promotionId}
                loadData={loadData} // Truyền loadData vào đây
            />
        </>
    );
};

export default PromotionTable;
