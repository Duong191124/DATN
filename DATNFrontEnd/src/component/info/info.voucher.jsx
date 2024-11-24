import React, { useEffect, useState } from 'react';
import { Card, List, Button, Tag, Space, Modal, Typography, Badge } from 'antd';
import { GiftOutlined, ClockCircleOutlined, InfoCircleOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import styled from 'styled-components';
import { getVouchersByCustomerId } from '../../service/api.service';

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

const InfoVoucher = ({ user }) => {
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const [vouchers, setVouchers] = useState([

    ]);

    const getVoucherData = async () => {
        const res = await getVouchersByCustomerId(user.id);
        setVouchers(res.data.data);
    }

    useEffect(() => {
        getVoucherData();
    }, []);

    const handleViewDetails = (voucher) => {
        setSelectedVoucher(voucher);
        setModalVisible(true);
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const formatMinSpend = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getActiveVoucherCount = () => {
        return vouchers.filter(v => v.status === 1).length;
    };

    const getDaysRemaining = (expirationDate) => {
        const days = moment(expirationDate).diff(moment(), 'days');
        return days > 0 ? days : 0; // Ensure it returns 0 if the voucher is already expired
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
                        voucher.status === 1 && ( // Check if status is 1
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
                                                    {voucher.discountPercent > 0 ? `Giảm ${voucher.discountPercent}%` : `Giảm ${formatMinSpend(voucher.discountAmount)}`}
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
                                            HSD: {moment(voucher.expiryDate).format('DD/MM/YYYY')}
                                        </Text>
                                    </Space>

                                    <Text type="secondary">
                                        Đơn tối thiểu: {formatMinSpend(voucher.minPurchaseAmount)} -
                                        Giảm tối đa: {voucher.maxDiscountAmount ? formatMinSpend(voucher.maxDiscountAmount) : ""}
                                    </Text>

                                </Space>
                            </VoucherCard>
                        )
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
                                {selectedVoucher.discountPercent > 0 && (
                                    <DiscountTag color="#1a1a1a">
                                        Giảm {selectedVoucher.discountPercent}%
                                        {selectedVoucher.maxDiscount && ` (Tối đa ${formatMinSpend(selectedVoucher.maxDiscount)})`}
                                    </DiscountTag>
                                )}
                                {selectedVoucher.discountAmount > 0 && (
                                    <DiscountTag color="#1a1a1a">
                                        Giảm {formatMinSpend(selectedVoucher.discountAmount)}
                                        {selectedVoucher.maxDiscount && ` (Tối đa ${formatMinSpend(selectedVoucher.maxDiscount)})`}
                                    </DiscountTag>
                                )}
                            </div>
                        </div>

                        <div>
                            <Text strong>Điều kiện áp dụng:</Text>
                            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                                <li>Đơn hàng tối thiểu: {formatMinSpend(selectedVoucher.minPurchaseAmount)}</li>
                                <li>{selectedVoucher.termsAndConditions}</li>
                            </ul>
                        </div>

                        <div>
                            <Text strong>Thời hạn sử dụng:</Text>
                            <p style={{ marginTop: '4px' }}>
                                Đến hết ngày {moment(selectedVoucher.expiryDate).format('DD/MM/YYYY')}
                            </p>
                        </div>
                    </Space>
                )}
            </Modal>
        </MainContainer>
    );
};

export default InfoVoucher;