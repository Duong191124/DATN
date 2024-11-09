import { Modal, Button, Table, Checkbox, Pagination, notification, Select } from 'antd';
import { useState, useEffect } from 'react';
import { fetchDataProductDetail, updatePromotionProduct, detailPromotion } from '../../service/api.service';

const { Option } = Select;

const ProductDetailModal = ({ isVisible, onClose, selectedProductDetails, onApply, id, loadData }) => {

//     <ProductDetailModal
//     isVisible={isProductDetailModalVisible}
//     onClose={() => setIsProductDetailModalVisible(false)}
//     selectedProductDetails={selectedProductIds}
//     onApply={handleApplyProductDetails}
//     id={promotionId}
//     loadData={loadData}
// />
    const [productDetails, setProductDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState(selectedProductDetails || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [promotion, setPromotion] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); // State cho kích thước đã chọn
    const [allSelected, setAllSelected] = useState(false); // State để kiểm tra trạng thái chọn tất cả

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
                    console.log("PromotionProduct: ",promotionRes)
                    if (promotionRes?.data.data) {
                        setPromotion(promotionRes.data.data);
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
            setSelectedDetails(selectedProductDetails || []);
            
        }
    }, [isVisible, id, selectedProductDetails]);
    // const calculateDiscountedPrice = (price, id,promotion) => {

    //     if (!selectedDetails.includes(id)) return price;
        
    //     const discountAmount = parseInt(promotion.discountAmount) || 0;
    //     const discountPercent = parseInt(promotion.discountPercent) || 0;
    //     console.log(discountAmount, discountPercent);
    //     let discountedPrice = price;

    //     if (discountAmount > 0) {
    //         discountedPrice -= discountAmount;
    //     }

    //     if (discountPercent > 0) {
    //         discountedPrice -= (price * (discountPercent / 100));
    //     }

    //     return Math.max(discountedPrice, 0);
        
    // };

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
    
            // Gọi API để áp dụng khuyến mãi
            const res = await updatePromotionProduct(id, payload);
    
            if (res?.data) {
                notification.success({
                    message: "Thành công",
                    description: "Áp dụng khuyến mãi thành công!",
                });
    
            const payload = { productDetailsIds: selectedDetails };
                onApply(selectedDetails);

                onClose();
    
                // Nếu có hàm loadData, gọi lại để làm mới dữ liệu
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
    
    const calculateDiscountedPrice = (price, id, promotion) => {
        // Nếu sản phẩm chưa được chọn, không cần tính toán
        if (!selectedDetails.includes(id)) return price;
    
        // Lấy giá trị giảm giá từ khuyến mãi (giảm giá cố định hoặc theo tỷ lệ phần trăm)
        const discountAmount = parseInt(promotion.discountAmount) || 0;
        const discountPercent = parseInt(promotion.discountPercent) || 0;
    
        // Tính giá sau khuyến mãi
        let discountedPrice = price;
    
        if (discountAmount > 0) {
            discountedPrice -= discountAmount;  // Giảm giá cố định
        }
    
        if (discountPercent > 0) {
            discountedPrice -= (price * (discountPercent / 100));  // Giảm giá theo tỷ lệ phần trăm
        }
    
        // Đảm bảo giá không âm
        return Math.max(discountedPrice, 0);
    };
    
    

    const handleSelectAll = () => {
        const filteredIds = productDetails
            .filter(item => selectedSize === null || item.size?.name === selectedSize)
            .map(item => item.id);

        // Kiểm tra nếu tất cả đã được chọn => bỏ chọn tất cả, ngược lại chọn tất cả
        if (allSelected) {
            setSelectedDetails(prev => prev.filter(id => !filteredIds.includes(id)));
            setAllSelected(false);
        } else {
            setSelectedDetails(prev => [...new Set([...prev, ...filteredIds])]);
            setAllSelected(true);
        }
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        setAllSelected(false); // Đặt lại nút chọn tất cả khi thay đổi kích thước
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
                render: (_, record) => {
                    // Tính giá sau khuyến mãi cho mỗi sản phẩm
                    const discountedPrice = calculateDiscountedPrice(record.defaultPrice, record.id, promotion);
                    return <span>{discountedPrice} VND</span>;
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
