// ProductCard.jsx
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Space, Typography } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useCart } from "../context/cart.context";
import { findByProductId } from "../../service/api.service";
const { Text } = Typography;
import "../layout/content/san-pham/product.detail.page.css";
import { data } from "framer-motion/client";

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
const priceStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#000",
  padding: "8px 12px",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  display: "inline-block",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
};

const priceRangeStyle = {
  fontSize: "1rem",
  color: "#333",
  display: "inline-block",
  fontStyle: "italic",
};
const ProductInfoStyle = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  background-color: #fff;
  padding: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProductImageStyle = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductCard = ({
  product,
  onAddToWishlist,
  onQuickView,
  size,
  color,
}) => {
  const { details, maxPrice, minPrice, products, totalQuantity } = product;
  const [productNew, setProductNew] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [colorError, setColorError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addToCart } = useCart();
  const [availableQuantity, setAvailableQuantity] = useState(0);

  const min = (minPrice || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const handleColorChange = (colorName) => {
    const newColor = selectedColor === colorName ? null : colorName;
    setSelectedColor(newColor);
    if (newColor) {
      setColorError(false);
      const sizesForColor = details
        .filter((item) => item.color.name === colorName)
        .map((item) => item.size.name);
      setAvailableSizes(sizesForColor);
      const selectedProduct = details.find(
        (item) => item.color.name === newColor
      );
      setProductNew(selectedProduct || {});
      if (selectedSize) {
        const quantityForSelectedSize =
          selectedProduct?.size?.name === selectedSize
            ? selectedProduct?.quantity
            : 0;
        setAvailableQuantity(quantityForSelectedSize);
      }
      if (
        !sizesForColor.includes(selectedSize) ||
        selectedColor === undefined
      ) {
        setSelectedSize(""); // Reset size
      }
    } else {
      // Khi bỏ chọn size, hiển thị tất cả các màu có sẵn
      const allSize = details.map((item) => item.size.name);
      setAvailableSizes([...new Set(allSize)]); // Cập nhật lại danh sách tất cả các màu có sẵn
    }
  };

  const handleSizeChange = (sizeName) => {
    const newSize = selectedSize === sizeName ? null : sizeName;
    setSelectedSize(newSize);

    if (newSize) {
      setSizeError(false);
      // Khi chọn size, chỉ lọc các màu có sẵn cho size này
      const colorsForSize = details
        .filter((item) => item.size.name === sizeName)
        .map((item) => item.color.name);
      setAvailableColors(colorsForSize);

      // Nếu màu đã chọn không có trong danh sách màu cho size này, reset màu đã chọn
      if (!colorsForSize.includes(selectedColor)) {
        setSelectedColor(""); // Reset màu
      }
      if (selectedColor) {
        const selectedProduct = details.find(
          (item) =>
            item.color.name === selectedColor && item.size.name === sizeName
        );
        setAvailableQuantity(selectedProduct?.quantity || 0);
      }
    } else {
      // Khi bỏ chọn size, hiển thị tất cả các màu có sẵn
      const allColors = details.map((item) => item.color.name);
      setAvailableColors([...new Set(allColors)]); // Cập nhật lại danh sách tất cả các màu có sẵn
    }
  };

  const handleAddToCart = () => {
    let hasError = false;
    if (!selectedColor) {
      setColorError(true);
      hasError = true;
    } else {
      setColorError(false);
    }
    if (!selectedSize) {
      setSizeError(true);
      hasError = true;
    } else {
      setSizeError(false);
    }
    if (hasError) {
      return;
    }

    const cartItem = {
      ...productNew,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };
    addToCart(cartItem);
    setIsModalVisible(false);
  };
  const fetchProductFindById = async (product) => {
    const res = await findByProductId(product.id);
    const productDetails = res.data.data.details;
    const colorsAvailable = productDetails.map((detail) => detail.color.name);
    const sizesAvailable = productDetails.map((detail) => detail.size.name);
    setAvailableColors(colorsAvailable);
    setAvailableSizes(sizesAvailable);
    const selectedProduct =
      productDetails.find((detail) => detail.color.name === selectedColor) ||
      productDetails[0];
    setProductNew(selectedProduct);
  };
  const addToCartShow = () => {
    setIsModalVisible(true);
    fetchProductFindById(products);
  };

  return (
    <ProductCardWrapper variants={itemVariants}>
      <StockBadge inStock={totalQuantity > 0}>
        {totalQuantity > 0 ? `${totalQuantity} in stock` : "Out of stock"}
      </StockBadge>

      <ProductImageContainer className="product-image">
        <ProductImage
          src={products.image || "https://via.placeholder.com/150"}
          alt={products.name}
        />
      </ProductImageContainer>

      <ProductActions className="product-actions">
        <ActionButton
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={totalQuantity === 0}
          onClick={() => addToCartShow()}
        >
          Add to Cart
        </ActionButton>
        <Modal
          title="Select Size and Color"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)} // Đóng modal khi nhấn nút Cancel
          width={800}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>,
          ]}
        >
          <div className="product-detail-page">
            <Row justify={"space-between"}>
              <Col xs={24} md={8}>
                <ProductInfoStyle>
                  <ProductImageStyle
                    src={productNew?.image || "https://via.placeholder.com/150"}
                    alt={productNew?.productResponse?.name}
                  />
                </ProductInfoStyle>
              </Col>
              <Col xs={24} md={14}>
                <div style={priceStyle}>
                  Price:{" "}
                  <span style={priceRangeStyle}>
                    {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ
                  </span>
                </div>
                <div className="select-size" style={{ flexWrap: "wrap" }}>
                  <label>Size:</label>
                  <div className="size-options" style={{ flexWrap: "wrap" }}>
                    {size
                      .filter((size) => size.status === 1)
                      .map((size) => (
                        <button
                          key={size.id}
                          className={`size-button ${
                            selectedSize === size.name ? "selected" : ""
                          } ${
                            !availableSizes.includes(size.name)
                              ? "disabled-size"
                              : ""
                          }`}
                          onClick={() => handleSizeChange(size.name)}
                          disabled={!availableSizes.includes(size.name)}
                        >
                          {size.name}
                        </button>
                      ))}
                  </div>
                </div>
                {sizeError && (
                  <p style={{ color: "red", marginTop: "8px" }}>
                    Vui lòng chọn size!
                  </p>
                )}
                <div className="select-color" style={{ flexWrap: "wrap" }}>
                  <label>Color:</label>
                  <div className="color-options" style={{ flexWrap: "wrap" }}>
                    {color
                      .filter((color) => color.status === 1)
                      .map((color) => (
                        <button
                          key={color.id}
                          className={`color-button ${
                            selectedColor === color.name ? "selected" : ""
                          } ${
                            !availableColors.includes(color.name)
                              ? "disabled-color"
                              : ""
                          }`}
                          onClick={() => handleColorChange(color.name)}
                          disabled={!availableColors.includes(color.name)}
                        >
                          {color.name}
                        </button>
                      ))}
                  </div>
                </div>
                {colorError && (
                  <p style={{ color: "red", marginTop: "8px" }}>
                    Vui lòng chọn màu!
                  </p>
                )}
                {selectedColor && selectedSize && availableQuantity >= 0 && (
                  <div style={{ margin: "10px 0" }}>
                    <p>Số lượng có sẵn: {availableQuantity}</p>
                  </div>
                )}
                <div className="quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  >
                    -
                  </button>
                  <input type="text" value={quantity} readOnly />
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </Modal>
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
        <ProductTitle>{products.name}</ProductTitle>
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <ProductPrice>{min}</ProductPrice>
          <Text type="secondary">{products.categoryName}</Text>
        </Space>
      </ProductInfo>
    </ProductCardWrapper>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productResponse: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    defaultPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    brand: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
  onAddToWishlist: PropTypes.func,
  onQuickView: PropTypes.func,
};

ProductCard.defaultProps = {
  onAddToCart: () => {},
  onAddToWishlist: () => {},
  onQuickView: () => {},
};

export default ProductCard;
