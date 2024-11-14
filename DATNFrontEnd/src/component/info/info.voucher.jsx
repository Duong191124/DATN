import React, { useState } from 'react';
import { Card, List, Button, Tag, Space, Modal, Typography, Badge } from 'antd';
import { GiftOutlined, ClockCircleOutlined, InfoCircleOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';

const { Text, Title } = Typography;

// Styled Components
const MainContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const VoucherHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 4px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const VoucherCount = styled.div`
  background: #1a1a1a;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const VoucherContainer = styled.div`
  max-height: 370px;
  overflow-y: auto;
  padding: 4px;
  border-radius: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const VoucherCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  background: white;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }

  .ant-card-body {
    padding: 16px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const DiscountTag = styled(Tag)`
  padding: 4px 8px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
`;

const DetailButton = styled(Button)`
  background: #1a1a1a;
  border-color: #1a1a1a;
  border-radius: 6px;
  
  &:hover {
    background: #333 !important;
    border-color: #333 !important;
  }
`;

const VoucherCode = styled.div`
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  &:hover {
    background: #e8e8e8;
  }
`;

const InfoVoucher = () => {
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    // Sample data
    const vouchers = [
        {
            id: 1,
            code: 'NEWUSER2024',
            discount: '50%',
            maxDiscount: 100000,
            minSpend: 200000,
            expiryDate: '2024-12-31',
            description: 'Giảm 50% cho đơn hàng đầu tiên',
            terms: 'Áp dụng cho khách hàng mới',
            status: 'active',
            type: 'percentage'
        },
        {
            id: 2,
            code: 'FRESH150K',
            discount: '150.000đ',
            minSpend: 500000,
            expiryDate: '2024-06-30',
            description: 'Giảm 150.000đ cho đơn hàng từ 500.000đ',
            terms: 'Áp dụng cho tất cả sản phẩm',
            status: 'active',
            type: 'fixed'
        },
        {
            id: 3,
            code: 'SUMMER30',
            discount: '30%',
            maxDiscount: 50000,
            minSpend: 300000,
            expiryDate: '2024-08-31',
            description: 'Giảm 30% cho đơn hàng mùa hè',
            terms: 'Không áp dụng cho sản phẩm giảm giá',
            status: 'active',
            type: 'percentage'
        },
        {
            id: 4,
            code: 'FLASH200K',
            discount: '200.000đ',
            minSpend: 1000000,
            expiryDate: '2024-05-15',
            description: 'Flash sale - Giảm 200.000đ',
            terms: 'Số lượng có hạn',
            status: 'active',
            type: 'fixed'
        },
        {
            id: 5,
            code: 'WEEKEND25',
            discount: '25%',
            maxDiscount: 75000,
            minSpend: 250000,
            expiryDate: '2024-07-31',
            description: 'Ưu đãi cuối tuần - Giảm 25%',
            terms: 'Chỉ áp dụng T7-CN',
            status: 'active',
            type: 'percentage'
        },
        {
            id: 6,
            code: 'LOYAL100K',
            discount: '100.000đ',
            minSpend: 400000,
            expiryDate: '2024-09-30',
            description: 'Ưu đãi khách hàng thân thiết',
            terms: 'Dành cho khách hàng cấp độ Vàng trở lên',
            status: 'active',
            type: 'fixed'
        },
        {
            id: 7,
            code: 'BDAY40OFF',
            discount: '40%',
            maxDiscount: 120000,
            minSpend: 300000,
            expiryDate: '2024-12-31',
            description: 'Ưu đãi sinh nhật đặc biệt',
            terms: 'Áp dụng trong tháng sinh nhật',
            status: 'active',
            type: 'percentage'
        },
        {
            id: 8,
            code: 'MEMBER80K',
            discount: '80.000đ',
            minSpend: 350000,
            expiryDate: '2024-10-31',
            description: 'Ưu đãi thành viên mới',
            terms: 'Cho thành viên đăng ký mới',
            status: 'active',
            type: 'fixed'
        },
        {
            id: 9,
            code: 'SPECIAL35',
            discount: '35%',
            maxDiscount: 90000,
            minSpend: 280000,
            expiryDate: '2024-11-30',
            description: 'Ưu đãi đặc biệt',
            terms: 'Áp dụng cho danh mục được chọn',
            status: 'active',
            type: 'percentage'
        },
        {
            id: 10,
            code: 'HOLIDAY250K',
            discount: '250.000đ',
            minSpend: 1200000,
            expiryDate: '2024-12-25',
            description: 'Ưu đãi lễ hội cuối năm',
            terms: 'Áp dụng cho tất cả sản phẩm',
            status: 'active',
            type: 'fixed'
        }
    ];

    const handleViewDetails = (voucher) => {
        setSelectedVoucher(voucher);
        setModalVisible(true);
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getDaysRemaining = (expiryDate) => {
        const days = moment(expiryDate).diff(moment(), 'days');
        return days > 0 ? days : 0;
    };

    const formatMinSpend = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getActiveVoucherCount = () => {
        return vouchers.filter(v => v.status === 'active').length;
    };

    return (
        <MainContainer>
            <VoucherHeader>
                <HeaderTitle>
                    <Title level={4} style={{ margin: 0 }}>Your Vouchers</Title>
                    <VoucherCount>{getActiveVoucherCount()} available</VoucherCount>
                </HeaderTitle>
            </VoucherHeader>
            <VoucherContainer>
                <List
                    dataSource={vouchers}
                    renderItem={(voucher) => (
                        <VoucherCard>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                                    <Space size="large">
                                        <div style={{ position: 'relative' }}>
                                            <GiftOutlined style={{ fontSize: '28px', color: '#1a1a1a' }} />
                                            {voucher.type === 'percentage' && (
                                                <Text style={{ position: 'absolute', top: -8, right: -8, fontSize: '12px', fontWeight: 'bold' }}>
                                                    %
                                                </Text>
                                            )}
                                        </div>
                                        <div>
                                            <VoucherCode onClick={() => handleCopyCode(voucher.code)}>
                                                <Text strong style={{ marginRight: '8px' }}>{voucher.code}</Text>
                                                {copiedCode === voucher.code ? (
                                                    <CheckOutlined style={{ color: '#52c41a' }} />
                                                ) : (
                                                    <CopyOutlined style={{ color: '#8c8c8c' }} />
                                                )}
                                            </VoucherCode>
                                            <DiscountTag color="#1a1a1a">
                                                Giảm {voucher.discount}
                                                {voucher.maxDiscount && ` (Tối đa ${formatMinSpend(voucher.maxDiscount)})`}
                                            </DiscountTag>
                                        </div>
                                    </Space>
                                    <DetailButton
                                        type="primary"
                                        onClick={() => handleViewDetails(voucher)}
                                        icon={<InfoCircleOutlined />}
                                    >
                                        Chi tiết
                                    </DetailButton>
                                </Space>

                                <Space style={{ color: '#595959' }}>
                                    <ClockCircleOutlined />
                                    <Text>
                                        Còn {getDaysRemaining(voucher.expiryDate)} ngày - HSD: {moment(voucher.expiryDate).format('DD/MM/YYYY')}
                                    </Text>
                                </Space>

                                <Text type="secondary">
                                    Đơn tối thiểu: {formatMinSpend(voucher.minSpend)}
                                </Text>
                            </Space>
                        </VoucherCard>
                    )}
                />
            </VoucherContainer>

            <Modal
                title={<Title level={4}>Chi tiết Voucher</Title>}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={600}
                style={{ top: 20 }}
            >
                {selectedVoucher && (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <VoucherCode onClick={() => handleCopyCode(selectedVoucher.code)} style={{ width: 'fit-content' }}>
                            <Text strong style={{ marginRight: '8px' }}>{selectedVoucher.code}</Text>
                            {copiedCode === selectedVoucher.code ? (
                                <CheckOutlined style={{ color: '#52c41a' }} />
                            ) : (
                                <CopyOutlined style={{ color: '#8c8c8c' }} />
                            )}
                        </VoucherCode>

                        <div>
                            <Text strong>Giá trị voucher:</Text>
                            <div>
                                <DiscountTag color="#1a1a1a">
                                    Giảm {selectedVoucher.discount}
                                    {selectedVoucher.maxDiscount && ` (Tối đa ${formatMinSpend(selectedVoucher.maxDiscount)})`}
                                </DiscountTag>
                            </div>
                        </div>

                        <div>
                            <Text strong>Điều kiện áp dụng:</Text>
                            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                                <li>Đơn hàng tối thiểu: {formatMinSpend(selectedVoucher.minSpend)}</li>
                                <li>{selectedVoucher.terms}</li>
                            </ul>
                        </div>

                        <div>
                            <Text strong>Thời hạn sử dụng:</Text>
                            <p style={{ marginTop: '4px' }}>
                                Đến hết ngày {moment(selectedVoucher.expiryDate).format('DD/MM/YYYY')}
                            </p>
                        </div>

                        <div>
                            <Text strong>Mô tả:</Text>
                            <p style={{ marginTop: '4px' }}>{selectedVoucher.description}</p>
                        </div>
                    </Space>
                )}
            </Modal>
        </MainContainer>
    );
};

export default InfoVoucher;