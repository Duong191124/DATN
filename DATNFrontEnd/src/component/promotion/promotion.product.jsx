import { Modal, Button, Table, Checkbox, notification, Select } from 'antd';
import { useState, useEffect } from 'react';
import { fetchDataProductDetail, updatePromotionProduct, detailPromotion } from '../../service/api.service';

const { Option } = Select;

const ProductDetailModal = ({ isVisible, onClose, selectedProductDetails, onApply, id, loadData }) => {
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState(selectedProductDetails || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [promotion, setPromotion] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        const fetchProductDetailsAndPromotion = async () => {
            try {
                const productDetailsRes = await fetchDataProductDetail();
                if (productDetailsRes?.data?.data) {
                    const fetchedProductDetails = productDetailsRes.data.data;
        
                    // Ensure each product detail has the activePromotionId, either from the product or by applying your logic
                    const availableProductDetails = fetchedProductDetails.map(item => {
                        // If the item has a promotion, set the activePromotionId accordingly
                        if (item.promotions && item.promotions.length > 0) {
                            // Assuming that we can get the active promotion ID from the product's promotions
                            item.activePromotionId = item.promotions[0].id; // Modify according to your data structure
                        } else {
                            item.activePromotionId = null; // Set as null if no active promotion
                        }
                        return item;
                    });
        
                    setProductDetails(availableProductDetails);
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
        const validIds = filteredData.map(item => item.id);
        setSelectedDetails(prev => prev.filter(id => validIds.includes(id)));
    }, [isVisible, id, selectedProductDetails]);

    // Chỉnh sửa cột 'Chọn' để vô hiệu hóa checkbox cho các product detail đã có khuyến mãi khác
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
    
            const currentDate = new Date(); // Lấy ngày hiện tại
            const promotionExpirationDate = new Date(promotion?.expirationDate); // Ngày hết hạn của khuyến mãi
    
            // Kiểm tra nếu khuyến mãi đã hết hạn
            if (promotionExpirationDate < currentDate) {
                notification.warning({
                    message: "Khuyến Mãi Hết Hạn",
                    description: "Khuyến mãi này đã hết hạn và không thể áp dụng.",
                });
                // Hủy áp dụng khuyến mãi logic ở đây
                return;
            }
    
            // Kiểm tra nếu giá trị giảm giá vượt quá giá của sản phẩm
            const invalidProducts = selectedDetails.filter((productId) => {
                const product = productDetails.find((item) => item.id === productId);
                if (!product) return false;
    
                const discountAmount = promotion.discountAmount || 0; // Giảm giá cố định
                const discountPercent = promotion.discountPercent || 0; // Giảm giá phần trăm
    
                // Tính giá sau giảm
                const calculatedDiscountPrice =
                    discountPercent > 0
                        ? product.defaultPrice * (1 - discountPercent / 100)
                        : product.defaultPrice - discountAmount;
    
                // Nếu giá sau giảm nhỏ hơn 0, sản phẩm không hợp lệ
                return calculatedDiscountPrice < 0;
            });
    
            if (invalidProducts.length > 0) {
                notification.error({
                    message: "Lỗi Áp Dụng",
                    description: "Giá trị giảm giá vượt quá giá của một hoặc nhiều sản phẩm đã chọn.",
                });
                return;
            }
    
            // Nếu tất cả hợp lệ, tiến hành áp dụng khuyến mãi
            const payload = {
                productDetailsIds: selectedDetails,
                applyPromotion: selectedDetails.length > 0,
            };
    
            const res = await updatePromotionProduct(id, payload);
    
            if (res) {
                notification.success({
                    message: "Thành công",
                    description: selectedDetails.length > 0
                        ? "Áp dụng khuyến mãi thành công!"
                        : "Đã hủy áp dụng khuyến mãi.",
                });
    
                // Fetch lại dữ liệu sản phẩm sau khi áp dụng khuyến mãi
                const updatedProductDetails = await fetchDataProductDetail();
                if (updatedProductDetails?.data?.data) {
                    let restoredDetails = updatedProductDetails.data.data;
    
                    if (!payload.applyPromotion) {
                        restoredDetails = restoredDetails.map(product => ({
                            ...product,
                            discountPrice: product.defaultPrice,
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
        // Lọc các sản phẩm không bị dính khuyến mãi khác
        const availableIds = filteredData
            .filter(item => item.activePromotionId === null || item.activePromotionId === id) // chỉ chọn sản phẩm không có khuyến mãi khác
            .map(item => item.id);
    
        // Kiểm tra nếu tất cả các sản phẩm hợp lệ chưa được chọn, chọn tất cả, nếu đã chọn thì bỏ chọn
        setSelectedDetails(prev =>
            allSelected
                ? prev.filter(id => !availableIds.includes(id)) // Bỏ chọn các sản phẩm hợp lệ
                : [...new Set([...prev, ...availableIds])] // Chọn tất cả các sản phẩm hợp lệ
        );
        setAllSelected(prev => !prev);
    };
    

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        setAllSelected(false);
    };

    const filteredData = productDetails.filter(item => {
        // Lọc theo size (nếu có), nhưng không lọc các sản phẩm đã có khuyến mãi khác
        return selectedSize === null || item.size?.name === selectedSize;
    });
    


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
            render: (text, record) => record.size?.name || "Chưa có size",
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
            render: (_, record) => {
                return (
                    <Checkbox
                        checked={selectedDetails.includes(record.id)}
                        onChange={() => handleSelect(record.id)}
                        disabled={record.activePromotionId !== null && record.activePromotionId !== id} // Disable if product has a different active promotion
                    />
                );
            },
        }
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
                dataSource={filteredData} // filteredData dựa trên productDetails đã lọc
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredData.length,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
                rowKey="id"
            />
        </Modal>
    );
};

export default ProductDetailModal;
