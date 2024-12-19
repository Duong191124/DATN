import { Modal, Button, Table, Checkbox, notification, Select, Tooltip, Input } from 'antd';
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
    const [selectedColor, setSelectedColor] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(''); // Thêm state cho thanh tìm kiếm

    useEffect(() => {
        const fetchProductDetailsAndPromotion = async () => {
            try {
                const productDetailsRes = await fetchDataProductDetail();
                if (productDetailsRes?.data?.data) {
                    const fetchedProductDetails = productDetailsRes.data.data.map(item => ({
                        ...item,
                        activePromotionId: item.promotions?.length > 0 ? item.promotions[0].id : null,
                    }));
                    setProductDetails(fetchedProductDetails);
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
                    description: selectedDetails.length > 0
                        ? "Áp dụng khuyến mãi thành công!"
                        : "Đã hủy áp dụng khuyến mãi.",
                });
                onApply(selectedDetails);
                onClose();
                if (loadData) loadData();
            } else {
                throw new Error("Không thể cập nhật khuyến mãi.");
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error.response?.data?.message || "Không thể áp dụng khuyến mãi",
            });
        }
    };

    const handleSelectAll = () => {
        const availableIds = filteredData
            .filter(item => item.activePromotionId === null || item.activePromotionId === id)
            .map(item => item.id);

        setSelectedDetails(prev =>
            allSelected
                ? prev.filter(id => !availableIds.includes(id))
                : [...new Set([...prev, ...availableIds])]
        );
        setAllSelected(prev => !prev);
    };

    const filteredData = productDetails
        .filter(item => {
            const sizeMatch = selectedSize === null || item.size?.name === selectedSize;
            const colorMatch = selectedColor === null || item.color?.name === selectedColor;
            const searchMatch = searchKeyword === '' || item.code.toLowerCase().includes(searchKeyword.toLowerCase());
            return sizeMatch && colorMatch && searchMatch;
        })
        .sort((a, b) => {
            if (a.activePromotionId === null && b.activePromotionId !== null) return -1;
            if (a.activePromotionId !== null && b.activePromotionId === null) return 1;
            return 0;
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
            render: (_, record) => record.size?.name || "Chưa có size",
        },
        {
            title: "Color",
            dataIndex: "color",
            render: (_, record) => record.color?.name || "Chưa có color",
        },
        {
            title: "Giá Gốc",
            dataIndex: "defaultPrice",
            render: (price) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}</span>
            ),
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
                <Tooltip
                    title={record.activePromotionId !== null && record.activePromotionId !== id
                        ? "Sản phẩm đang thuộc khuyến mãi khác" : ""}
                >
                    <Checkbox
                        checked={selectedDetails.includes(record.id)}
                        onChange={() => handleSelect(record.id)}
                        disabled={record.activePromotionId !== null && record.activePromotionId !== id}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <Modal
            title="Chọn Chi Tiết Sản Phẩm"
            visible={isVisible}
            onCancel={onClose}
            width={1200}
            footer={[
                <Button key="cancel" onClick={onClose}>Hủy</Button>,
                <Button key="apply" type="primary" onClick={handleApply}>Áp Dụng</Button>,
            ]}
        >
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <Input.Search
                    placeholder="Tìm kiếm theo tên sản phẩm"
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Chọn Size"
                    style={{ width: 200 }}
                    onChange={(size) => setSelectedSize(size)}
                    allowClear
                >
                    {[...new Set(productDetails.map(item => item.size?.name).filter(Boolean))].map(size => (
                        <Option key={size} value={size}>{size}</Option>
                    ))}
                </Select>
                <Select
                    placeholder="Chọn màu sắc"
                    style={{ width: 200 }}
                    onChange={(color) => setSelectedColor(color)}
                    allowClear
                >
                    {[...new Set(productDetails.map(item => item.color?.name).filter(Boolean))].map(color => (
                        <Option key={color} value={color}>{color}</Option>
                    ))}
                </Select>
                <Button onClick={handleSelectAll}>
                    {allSelected ? "Bỏ Chọn Tất Cả" : "Chọn Tất Cả"}
                </Button>
            </div>
            <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredData.length,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
                rowKey="id"
            />
        </Modal>
    );
};

export default ProductDetailModal;
