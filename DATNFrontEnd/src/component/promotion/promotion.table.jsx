import React, { useState } from 'react';
import { Table, Space, Modal, notification, DatePicker, Button, Input } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined, RetweetOutlined } from '@ant-design/icons';
import { chandleStatusPromotion, deletePromotionAPI, fetchDataProductDetail } from '../../service/api.service';
import PromotionUpdate from "./promotion.update";
import ProductDetailModal from './promotion.product';

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
    const [promotionId, setPromotionId] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState([]);

    const isPromotionActive = (endDate) => {
        const currentDate = new Date();
        const promotionEndDate = new Date(endDate);
        return promotionEndDate >= currentDate;
    };

    const showDeleteConfirm = (id, productDetailsIds) => {
        Modal.confirm({
            title: 'Bạn có muốn xóa khuyến mãi này không?',
            content: 'Sau khi xóa, bạn sẽ không thể phục hồi dữ liệu này.',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk: () => handleDelete(id, productDetailsIds),
        });
    };

    const handleDelete = async (id, productDetailsIds) => {
        if (productDetailsIds && productDetailsIds.length > 0) {
            notification.warning({
                message: "Xóa Khuyến Mại",
                description: "Không thể xóa khuyến mãi đang được áp dụng cho sản phẩm.",
            });
            return;
        }

        try {
            const res = await deletePromotionAPI(id);
            if (res.status === 200) {
                notification.success({
                    message: "Xóa Khuyến Mại",
                    description: "Xóa khuyến mại thành công."
                });
                loadData();
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

    const showProductDetails = async (productDetailsIds, promotionId) => {
        
        try {
            const res = await fetchDataProductDetail();
            if (res && res.data.data) {
                const filteredProductDetails = res.data.data.filter(product =>
                    productDetailsIds.includes(product.id)
                );
                setProductDetails(filteredProductDetails);
                setSelectedProductIds(productDetailsIds);
                setPromotionId(promotionId);
               
                setIsProductDetailModalVisible(true);
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Không thể tải danh sách chi tiết sản phẩm",
            });
        }
    };

    const isEndDateValid = (endDate) => {
        const currentDate = new Date();
        const promotionEndDate = new Date(endDate);
        return promotionEndDate > currentDate;
    };

    const handleChangeStatus = async (id, endDate) => {
        if (!isEndDateValid(endDate)) {
            notification.warning({
                message: "Không thể thay đổi trạng thái",
                description: "Khuyến mãi không thể thay đổi trạng thái vì ngày kết thúc đã qua.",
            });
            return;
        }

        try {
            // Gọi API để cập nhật trạng thái
            const response = await chandleStatusPromotion(id);
            console.log(response); // Kiểm tra phản hồi từ API
            if (response.status === 200 || response.status === 204) {
                // Cập nhật trạng thái trong danh sách khuyến mãi
                loadData(); // Gọi lại hàm loadData để tải lại dữ liệu từ server
                notification.success({
                    message: "Cập nhật trạng thái",
                    description: `Thay đổi trạng thái khuyến mãi thành công.`,
                });
            } else {
                notification.error({
                    message: "Cập nhật trạng thái",
                    description: "Đã có lỗi xảy ra khi thay đổi trạng thái khuyến mãi.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Cập nhật trạng thái",
                description: "Đã có lỗi xảy ra khi thay đổi trạng thái khuyến mãi.",
            });
        }
    };


    const handleApplyProductDetails = (selectedIds) => {
        setSelectedProductIds(selectedIds);
        setIsProductDetailModalVisible(false);
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
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập tên"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                return record.name.toLowerCase().includes(value[0].toLowerCase());
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <DatePicker.RangePicker
                        onChange={(dates) => {
                            if (dates) {
                                const [start, end] = dates;
                                setSelectedKeys([[start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]]);
                            } else {
                                setSelectedKeys([]);
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                    <Space style={{ marginTop: '8px' }}>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ borderRadius: '5px', marginRight: '8px' }}
                        >
                            Tìm kiếm
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                if (!value || value.length === 0) return true; // Thêm điều kiện này
                const [startDate, endDate] = value;
                const recordDate = new Date(record.startDate);
                return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
            },
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <DatePicker.RangePicker
                        onChange={(dates) => {
                            if (dates) {
                                const [start, end] = dates;
                                setSelectedKeys([[start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]]);
                            } else {
                                setSelectedKeys([]);
                            }
                        }}
                        style={{ width: '100%' }}
                    />
                    <Space style={{ marginTop: '8px' }}>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ borderRadius: '5px', marginRight: '8px' }}
                        >
                            Tìm kiếm
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                if (!value || value.length === 0) return true; // Thêm điều kiện này
                const [startDate, endDate] = value;
                const recordDate = new Date(record.endDate);
                return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
            },
        },
        {
            title: 'Phần trăm giảm giá(%)',
            dataIndex: 'discountPercent',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập phần trăm"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                const filterValue = parseFloat(value);
                return record.discountPercent >= filterValue; // Hiển thị các bản ghi có discountPercent lớn hơn hoặc bằng giá trị lọc
            },
        },
        {
            title: 'Số tiền giảm giá(VNĐ)',
            dataIndex: 'discountAmount',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Nhập số tiền"
                        value={selectedKeys[0] || ''}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => clearFilters()}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                const filterValue = parseFloat(value);
                return record.discountAmount >= filterValue; // Hiển thị các bản ghi có discountAmount lớn hơn hoặc bằng giá trị lọc
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
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
            },
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
                        onClick={() => showDeleteConfirm(record.id, record.productDetailsId)}
                    />
                    <PlusCircleOutlined
                        style={{ color: 'green', cursor: 'pointer' }}
                        onClick={() => showProductDetails(record.productDetailsId, record.id)}
                    />
                    <RetweetOutlined
                        style={{ color: 'aqua', cursor: 'pointer' }}
                        onClick={() => handleChangeStatus(record.id, record.endDate)}
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
            <ProductDetailModal
                isVisible={isProductDetailModalVisible}
                onClose={() => setIsProductDetailModalVisible(false)}
                selectedProductDetails={selectedProductIds}
                onApply={handleApplyProductDetails}
                id={promotionId}
                loadData={loadData}
            />
        </>
    );
};

export default PromotionTable;
