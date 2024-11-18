import React, { useEffect, useState } from "react";
import { Button, message, Space, Typography } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useCart } from "../context/cart.context";

const { Text } = Typography;

const ProductCardWrapper = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);

    .product-actions {
      opacity: 1;
      transform: translateY(0);
    }

    .product-image::after {
      opacity: 0.3;
    }
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  padding-top: 100%;
  background: #f5f5f5;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ProductActions = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  z-index: 2;
`;

const ActionButton = styled(Button)`
  &.ant-btn-primary {
    background: #000;
    border-color: #000;

    &:hover {
      background: #333;
      border-color: #333;
    }
  }

  &.ant-btn-default {
    border-color: #000;
    color: #000;

    &:hover {
      border-color: #333;
      color: #333;
    }
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  line-height: 1.4;
`;

const ProductPrice = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

const StockBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  background: ${(props) => (props.inStock ? "#000" : "#ff4d4f")};
  color: white;
  border-radius: 2px;
  font-size: 12px;
  z-index: 1;
`;

const DiscountPrice = styled(Text)`
  color: red;
  font-size: 1.2em;
  margin-right: 8px;
`;

const OriginalPrice = styled(Text)`
  text-decoration: line-through;
  color: #999;
`;

const SaleIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: red;
  color: white;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  z-index: 2;
`;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const ProductDetailCard = ({ product, onAddToWishlist, onQuickView }) => {
  const {
    name,
    size,
    color,
    defaultPrice,
    discountPrice,
    productResponse,
    quantity,
    image,
    promotions, // Assuming promotions is an array of promotion details
  } = product;
  console.log("s", size);
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      size: size.code,
      color: color.name,
      quantity: 1,
    };
    addToCart(cartItem);
  };
  return (
    <ProductCardWrapper variants={itemVariants}>
      {promotions && promotions.length > 0 && <SaleIcon>Sale</SaleIcon>}

      <StockBadge inStock={quantity > 0}>
        {quantity > 0 ? `${quantity} in stock` : "Out of stock"}
      </StockBadge>

      <ProductImageContainer className="product-image">
        <ProductImage src={image} alt={name} />
      </ProductImageContainer>

      <ProductActions className="product-actions">
        <ActionButton
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => handleAddToCart()}
          disabled={quantity === 0}
        >
          Add to Cart
        </ActionButton>
        <ActionButton
          icon={<HeartOutlined />}
          onClick={() => onAddToWishlist(product)}
        />
        <ActionButton
          icon={<EyeOutlined />}
          onClick={() => onQuickView(product)}
        />
      </ProductActions>

      <ProductInfo>
        <ProductTitle>{name}</ProductTitle>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <ProductPrice>
            {discountPrice && discountPrice < defaultPrice ? (
              <div style={{ display: "flex" }}>
                <DiscountPrice>
                  {discountPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </DiscountPrice>
                <OriginalPrice>
                  {defaultPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </OriginalPrice>
              </div>
            ) : (
              defaultPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            )}
          </ProductPrice>
          <Text type="secondary">{productResponse.categoryName}</Text>
        </Space>
      </ProductInfo>
    </ProductCardWrapper>
  );
};

ProductDetailCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    brand: PropTypes.string,
    createdAt: PropTypes.string,
    promotions: PropTypes.array,
  }).isRequired,
  onAddToCart: PropTypes.func,
  onAddToWishlist: PropTypes.func,
  onQuickView: PropTypes.func,
};

ProductDetailCard.defaultProps = {
  onAddToCart: () => {},
  onAddToWishlist: () => {},
  onQuickView: () => {},
};

export default ProductDetailCard;
