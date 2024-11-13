import { Modal, Button, Table, Checkbox, Pagination, notification, Select } from 'antd';
import { useState, useEffect } from 'react';
import { fetchDataProductDetail, updatePromotionProduct, detailPromotion } from '../../service/api.service';

const { Option } = Select;

const ProductDetailModal = ({ isVisible, onClose, selectedProductDetails, onApply, id, loadData }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState(selectedProductDetails || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [promotion, setPromotion] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        const fetchProductDetailsAndPromotion = async () => {
            try {
                const productDetailsRes = await fetchDataProductDetail();
                if (productDetailsRes?.data?.data) {
                    setProductDetails(productDetailsRes.data.data);
                }

                if (id) {
                    const promotionRes = await detailPromotion(id);
                    if (promotionRes?.data?.data) {
                        setPromotion(promotionRes.data.data);
                    }
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh sách chi tiết sản phẩm hoặc khuyến mãi",
                });
            }
        };

        if (isVisible) {
            fetchProductDetailsAndPromotion();
            setSelectedDetails(selectedProductDetails || []);
        }
    }, [isVisible, id, selectedProductDetails]);

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

            const payload = {
                productDetailsIds: selectedDetails,
                applyPromotion: selectedDetails.length > 0,
            };

            const res = await updatePromotionProduct(id, payload);
            if (res) {
                notification.success({
                    message: "Thành công",
                    description: selectedDetails.length > 0 ? "Áp dụng khuyến mãi thành công!" : "Đã hủy áp dụng khuyến mãi.",
                });

                // Xử lý lại danh sách sản phẩm
                const updatedProductDetails = await fetchDataProductDetail();
                if (updatedProductDetails?.data?.data) {
                    let restoredDetails = updatedProductDetails.data.data;

                    if (!payload.applyPromotion) {
                        restoredDetails = restoredDetails.map(product => ({
                            ...product,
                            discountPrice: product.defaultPrice, // Đặt discountPrice về giá gốc
                        }));
                    }

                    setProductDetails(restoredDetails);
                }
                onApply(selectedDetails);
                onClose();

                if (loadData) {
                    loadData();
                }
            } else {
                throw new Error("Không thể cập nhật khuyến mãi.");
            }
        } catch (error) {
            console.error("Error applying promotion:", error);
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "Không thể áp dụng khuyến mãi",
            });
        }
    };

    const handleSelectAll = () => {
        const filteredIds = productDetails
            .filter(item => selectedSize === null || item.size?.name === selectedSize)
            .map(item => item.id);

        setSelectedDetails(prev => 
            allSelected ? prev.filter(id => !filteredIds.includes(id)) : [...new Set([...prev, ...filteredIds])]
        );
        setAllSelected(prev => !prev);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        setAllSelected(false); // Deselect all when size filter changes
    };

    const currentData = productDetails
        .filter(item => selectedSize === null || item.size?.name === selectedSize)
        .slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            title: "Size",
            dataIndex: "size",
            render: (text, record) => {
                return record.size?.name || "Chưa có size";
            },
        },
        {
            title: "Giá Gốc",
            dataIndex: "defaultPrice",
            render: (price) => <span>{price} VND</span>,
        },
        {
            title: "Giá Sau Khuyến Mãi",
            dataIndex: "discountPrice",
            render: (discountPrice) => (
                <span>{discountPrice ? `${discountPrice} VND` : "Không có khuyến mãi"}</span>
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
            <Select
                placeholder="Chọn Size"
                style={{ width: 200, marginBottom: 16 }}
                onChange={handleSizeChange}
                allowClear
            >
                <Option key="all" value={null}>Tất cả</Option>
                {[...new Set(productDetails.map(item => item.size?.name).filter(Boolean))].map(size => (
                    <Option key={size} value={size}>
                        {size}
                    </Option>
                ))}
            </Select>
            <Button onClick={handleSelectAll} style={{ marginBottom: 16, marginLeft: 8 }}>
                {allSelected ? "Bỏ Chọn Tất Cả" : "Chọn Tất Cả"}
            </Button>
            <Table
                dataSource={currentData}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: productDetails.length,
                    onChange: setCurrentPage,
                    onShowSizeChange: (current, size) => setPageSize(size)
                }}
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
