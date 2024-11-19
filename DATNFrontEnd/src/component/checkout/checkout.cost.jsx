import React from 'react';
import { Card, Space, Typography, Divider } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const StyledDivider = styled(Divider)`
  margin: 12px 0;
  border-color: #d9d9d9;
`;

const ShippingCostCard = styled(Card)`
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  margin-top: 24px;
  background: #fafafa;

  .shipping-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }
`;

const ShippingCostPanel = ({ costs }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <ShippingCostCard>
      <Space direction="vertical" style={{ width: '100%' }} size={0}>
        <div className="shipping-item">
          <Text>Subtotal</Text>
          <Text>{formatPrice(costs.subtotal)}</Text>
        </div>
        <div className="shipping-item">
          <Text>Shipping Fee</Text>
          <Text>{formatPrice(costs.shippingFee)}</Text>
        </div>
        {costs.discount !== 0 && (
          <div className="shipping-item">
            <Text>Discount</Text>
            <Text type="success">{formatPrice(costs.discount)}</Text>
          </div>
        )}
        <StyledDivider />
        <div className="shipping-item">
          <Text strong>Total</Text>
          <Text strong>{formatPrice(costs.total)}</Text>
        </div>
      </Space>
    </ShippingCostCard>
  );
};

export default ShippingCostPanel;