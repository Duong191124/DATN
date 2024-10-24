import { Modal, Button, Table, Checkbox, Pagination, notification } from 'antd';
import { useState, useEffect } from 'react';
import { fetchDataProductDetail, updatePromotionProduct } from '../../service/api.service';

const ProductDetailModal = ({ isVisible, onClose, selectedProductDetails, onApply, id, loadData }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch all product details when the modal is opened
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await fetchDataProductDetail();
                if (res && res.data && res.data.data) {
                    setProductDetails(res.data.data); // Lưu tất cả chi tiết sản phẩm vào state
                    setSelectedDetails(selectedProductDetails || []); // Cập nhật selectedDetails từ props
                } else {
                    throw new Error('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh sách chi tiết sản phẩm",
                });
            }
        };

        if (isVisible) { // Chỉ fetch khi modal mở
            fetchProductDetails();
        }
    }, [isVisible, selectedProductDetails]);

    // Handle selecting product details
    const handleSelect = (productId) => {
        setSelectedDetails((prevSelected) => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId); // Bỏ chọn nếu đã chọn
            } else {
                return [...prevSelected, productId]; // Thêm vào danh sách chọn
            }
        });
    };

    // Handle applying promotion
    const handleApply = async () => {
        if (selectedDetails.length === 0) {
            notification.warning({
                message: "Chưa chọn chi tiết sản phẩm",
                description: "Vui lòng chọn ít nhất một chi tiết sản phẩm trước khi áp dụng.",
            });
            return;
        }

        try {
            if (!id) {
                throw new Error("Promotion ID không hợp lệ.");
            }

            // Gọi API để cập nhật chỉ trường productDetailsIds
            const payload = {
                productDetailsIds: selectedDetails // Chỉ gửi trường cần cập nhật
            };

            // Gọi API để cập nhật khuyến mãi
            const res = await updatePromotionProduct(id, payload);

            // Kiểm tra phản hồi từ API
            if (res && res.data) {
                notification.success({
                    message: "Thành công",
                    description: "Áp dụng khuyến mãi thành công!",
                });
                
                onApply(selectedDetails); // Trả về danh sách đã chọn cho component cha
                onClose(); // Đóng modal sau khi cập nhật thành công

                // Gọi lại hàm loadData để cập nhật dữ liệu mới từ server
                if (loadData) {
                    loadData(); // Gọi lại để lấy lại dữ liệu mới
                }
            } else {
                throw new Error("Không thể cập nhật khuyến mãi.");
            }
        } catch (error) {
            console.error('Error applying promotion:', error);
            notification.error({
                message: "Lỗi",
                description: error.response && error.response.data.message ? error.response.data.message : "Không thể áp dụng khuyến mãi",
            });
        }
    };

    // Paginate current data
    const currentData = productDetails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Define columns for the table
    const columns = [
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: "Số Lượng",
            dataIndex: "quantity",
        },
        {
            title: "Giá",
            dataIndex: "price",
        },
        {
            title: "Kích Cỡ",
            dataIndex: "size",
            render: (text, record) => {
                return record.size?.name || "Chưa có kích cỡ";
            },
        },
        {
            title: "Màu",
            dataIndex: "color",
            render: (text, record) => {
                return record.color?.name || "Chưa có màu";
            },
        },
        {
            title: 'Chọn',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={selectedDetails.includes(record.id)}
                    onChange={() => handleSelect(record.id)}
                />
            ),
        },
    ];

    return (
        <Modal
            title="Chọn Chi Tiết Sản Phẩm"
            visible={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="apply" type="primary" onClick={handleApply}>
                    Áp Dụng
                </Button>,
            ]}
        >
            <Table
                dataSource={currentData}
                columns={columns}
                pagination={false}
                rowKey="id"
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={productDetails.length}
                onChange={setCurrentPage}
                onShowSizeChange={(current, size) => setPageSize(size)}
            />
        </Modal>
    );
};

export default ProductDetailModal;
