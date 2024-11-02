import { Modal, Button, Table, Checkbox, Pagination, notification } from 'antd';
import { useState, useEffect } from 'react';
import { fetchDataProductDetail, updatePromotionProduct, detailPromotion } from '../../service/api.service';

const ProductDetailModal = ({ isVisible, onClose, selectedProductDetails, onApply, id, loadData }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState(selectedProductDetails || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [promotion, setPromotion] = useState(null);

    useEffect(() => {
        const fetchProductDetailsAndPromotion = async () => {
            try {
                const productDetailsRes = await fetchDataProductDetail();
                if (productDetailsRes?.data?.data) {
                    setProductDetails(productDetailsRes.data.data);
                } else {
                    throw new Error('Dữ liệu không hợp lệ');
                }

                if (id) {
                    const promotionRes = await detailPromotion(id);
                    if (promotionRes?.data) {
                        setPromotion(promotionRes.data);
                    } else {
                        throw new Error('Không thể lấy thông tin khuyến mãi');
                    }
                }
            } catch (error) {
                console.error('Error fetching product details or promotion:', error);
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh sách chi tiết sản phẩm hoặc khuyến mãi",
                });
            }
        };

        if (isVisible) {
            fetchProductDetailsAndPromotion();
            setSelectedDetails(selectedProductDetails || []); // Cập nhật selectedDetails từ props
        }
    }, [isVisible, id, selectedProductDetails]);

    const calculateDiscountedPrice = (price,promotion) => {
        if (!promotion) return price;
        console.log(promotion)
        const discountAmount = parseInt(promotion.discountAmount) || 0;
        const discountPercent = parseInt(promotion.discountPercent) || 0;

        let discountedPrice = price;
        
        if (discountAmount > 0) {
            discountedPrice -= discountAmount;
        }
        
        if (discountPercent > 0) {
            discountedPrice -= (price * (discountPercent / 100));
        }

        return Math.max(discountedPrice, 0);
    };

    const handleSelect = (productId) => {
        setSelectedDetails((prevSelected) => 
            prevSelected.includes(productId) 
                ? prevSelected.filter(id => id !== productId) 
                : [...prevSelected, productId]
        );
    };

    const handleApply = async () => {
        try {
            if (!id) {
                throw new Error("Promotion ID không hợp lệ.");
            }

            const payload = { productDetailsIds: selectedDetails };

            const res = await updatePromotionProduct(id, payload);

            if (res?.data) {
                notification.success({
                    message: "Thành công",
                    description: "Áp dụng khuyến mãi thành công!",
                });

                onApply(selectedDetails);
                onClose();

                if (loadData) {
                    loadData();
                }
            } else {
                throw new Error("Không thể cập nhật khuyến mãi.");
            }
        } catch (error) {
            console.error('Error applying promotion:', error);
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "Không thể áp dụng khuyến mãi",
            });
        }
    };

    const currentData = productDetails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            title: "Giá Gốc",
            dataIndex: "price",
            render: (price) => <span>{price} VND</span>,
        },
        {
            title: "Giá Sau Khuyến Mãi",
            dataIndex: "discountedPrice",
            render: (_, record) => (
                <span>{calculateDiscountedPrice(record.price,record.promotion)} VND</span>
            ),
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
