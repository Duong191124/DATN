import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Typography } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useCart } from "../context/cart.context";
import { useTranslation } from "react-i18next";
import { findByProductDetailId } from "../../service/api.service";
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
  background: rgba(255, 255, 255, 0.5);
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
    promotions,
  } = product;
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const [quantityDetail, setQuantityDetail] = useState();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // Đảm bảo ngôn ngữ được thay đổi khi khởi tạo
    } else {
      const defaultLang = i18n.language || "vi"; // Ngôn ngữ mặc định
      i18n.changeLanguage(defaultLang);
    }
  }, [i18n.language]);
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      size: size.code,
      color: color.name,
      quantity: 1,
    };
    fetchData(product?.id);
    if (cartItem.quantity > quantityDetail) {
      message.warning(t('MES-111'))
      return;
    }
    addToCart(cartItem);
  };
  const fetchData = async () => {
    try {
      const res = await findByProductDetailId(product?.id)
      setQuantityDetail(res.data.data.quantity);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  return (
    <ProductCardWrapper variants={itemVariants}>
      {promotions && promotions.length > 0 && discountPrice > 0 && (
        <SaleIcon>
          {promotions[0].discountPercent != null
            ? `Sale ${promotions[0].discountPercent}%`
            : `Giảm ${promotions[0].discountAmount.toLocaleString("vi-VN")}đ`}
        </SaleIcon>
      )}
      <StockBadge inStock={quantity > 0}>
        {quantity > 0 ? t("MES-058", { quantity: quantity }) : t("MES-059")}
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
          {t("MES-060")}
        </ActionButton>
      </ProductActions>
      <ProductInfo>
        <ProductTitle>{productResponse.name}</ProductTitle>
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Text
              type="secondary"
              style={{
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "5px" }}>Color:</div>
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: color.name,
                  borderRadius: "50%",
                  boxShadow: "rgba(0, 0, 0, 0.88) 0px 0px 3px",
                }}
              ></div>
            </Text>
            <Text type="secondary">Size: {size.name}</Text>
          </div>
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
  onAddToCart: () => { },
  onAddToWishlist: () => { },
  onQuickView: () => { },
};

export default ProductDetailCard;
