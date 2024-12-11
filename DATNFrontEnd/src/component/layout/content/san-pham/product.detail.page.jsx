import { useParams } from "react-router-dom";
import "./product.detail.page.css";
import React, { useEffect, useState } from "react";
import {
  fetchDataColor,
  fetchDataSize,
  findByProductId,
  getDataProductDetailByProductId,
} from "../../../../service/api.service";
import { useCart } from "../../../context/cart.context";
import ProductCarousel from "../../../home/product.carousel";
import { Collapse, Input, message, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useTranslation } from "react-i18next";
const styles = {
  productDescription: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    padding: "5px 40px 30px 40px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  antTabs: {
    margin: "0 20px",
  },
  antTabsNav: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  antTabsTab: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    padding: "10px 30px",
    margin: "0 15px",
    textTransform: "uppercase",
    color: "#333",
    border: "none",
    transition: "color 0.3s, border-bottom 0.3s",
  },
  antTabsTabHover: {
    color: "#1890ff",
    cursor: "pointer",
    borderBottom: "2px solid #1890ff",
  },
  antTabsTabActive: {
    color: "#1890ff",
    fontWeight: "bold",
    borderBottom: "2px solid #1890ff",
  },
  antTabsTabPane: {
    padding: "20px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1.6",
  },
  ul: {
    marginLeft: "28px",
  },
  h3: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#1890ff",
  },
  strong: {
    fontWeight: "bold",
    color: "#333",
  },
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState([]);
  const [productOld, setProductOld] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [colorError, setColorError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      const defaultLang = i18n.language || "vi";
      i18n.changeLanguage(defaultLang);
    }
  }, [i18n.language]);
  const initSize = async () => {
    const res = await fetchDataSize();
    setSize(res.data.data);
  };
  const initColor = async () => {
    const res = await fetchDataColor();
    setColor(res.data.data);
  };
  const handleColorChange = (colorName) => {
    const newColor = selectedColor === colorName ? null : colorName;
    setSelectedColor(newColor);
    if (newColor) {
      setColorError(false);
      const sizesForColor = productOld
        .filter((item) => item.color.name === colorName)
        .map((item) => item.size.name);
      setAvailableSizes(sizesForColor);
      const selectedProduct = productOld.find(
        (item) => item.color.name === newColor
      );
      setProduct(selectedProduct || {});
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
        setSelectedSize("");
      }
    } else {
      // Khi bỏ chọn màu, hiển thị tất cả các kích thước có sẵn
      const allSize = productOld.map((item) => item.size.name);
      setAvailableSizes([...new Set(allSize)]); // Cập nhật lại danh sách tất cả các size có sẵn
    }
  };

  const handleSizeChange = (sizeName) => {
    const newSize = selectedSize === sizeName ? null : sizeName;
    setSelectedSize(newSize);
    if (newSize) {
      setSizeError(false);
      // Đảm bảo product là mảng và lọc các sản phẩm theo size
      const colorsForSize = productOld
        .filter((item) => item.size.name === sizeName)
        .map((item) => item.color.name);
      setAvailableColors(colorsForSize);
      // Nếu màu đã chọn không có trong danh sách màu cho size này, reset màu đã chọn
      if (!colorsForSize.includes(selectedColor)) {
        setSelectedColor(""); // Reset màu
      }
      if (selectedColor) {
        const selectedProduct = productOld.find(
          (item) =>
            item.color.name === selectedColor && item.size.name === sizeName
        );
        setAvailableQuantity(selectedProduct?.quantity || 0);
      }
    } else {
      const allColors = productOld.map((item) => item.color.name);
      setAvailableColors([...new Set(allColors)]);
    }
  };

  useEffect(() => {
    const initProduct = async () => {
      const res = await getDataProductDetailByProductId(id);
      const productDetails = res.data.data.details;
      const colorsAvailable = productDetails.map((detail) => detail.color.name);
      const sizesAvailable = productDetails.map((detail) => detail.size.code);
      setAvailableColors(colorsAvailable);
      setAvailableSizes(sizesAvailable);
      const selectedProduct =
        productDetails.find((detail) => detail.color.name === selectedColor) ||
        productDetails[0];
      setProduct(selectedProduct);
      setProductOld(productDetails);
    };
    initProduct();
  }, [id]);
  useEffect(() => {
    initSize();
    initColor();
  }, []);

  const handleAddToCart = () => {
    let hasError = false;

    // Kiểm tra màu sắc
    if (!selectedColor) {
      setColorError(true);
      hasError = true;
    } else {
      setColorError(false);
    }
    // Kiểm tra kích thước
    if (!selectedSize) {
      setSizeError(true);
      hasError = true;
    } else {
      setSizeError(false);
    }
    if (hasError) {
      return;
    }
    // Kiểm tra số lượng trong kho
    if (availableQuantity === 0) {
      message.info(t("MES-109"));
      return;
    }
    if (!quantity || parseInt(quantity, 10) === 0) {
      message.warning(t("MES-110"));
      return;
    }
    // Kiểm tra số lượng yêu cầu
    const numericQuantity = parseInt(quantity, 10); // Chuyển quantity thành số nguyên
    if (numericQuantity > availableQuantity) {
      message.info(t("MES-111"));
      return;
    }

    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: numericQuantity, // Đảm bảo quantity là số
    };

    addToCart(cartItem);
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="product-info">
          <div className="product-info-image">
            <img
              src={product?.image || "https://via.placeholder.com/150"}
              alt={product?.productResponse?.name}
            />
          </div>
          <div className="product-details">
            <h1>
              {product?.productResponse?.name} - {product?.code}
            </h1>
            <p className="price">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {product.discountPrice > 0 &&
                  product.discountPrice !== undefined && (
                    <span
                      style={{
                        color: "#e63946", // Màu đỏ cho giá sau khi giảm
                        fontWeight: "bold",
                        fontSize: "22px",
                      }}
                    >
                      {product.discountPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  )}
                {product.defaultPrice !== undefined && (
                  <span
                    style={{
                      textDecoration:
                        product.discountPrice > 0 ? "line-through" : "none", // Gạch bỏ giá gốc nếu có giá giảm
                      color: product.discountPrice > 0 ? "#999" : "#333", // Màu xám cho giá gốc
                      fontSize: product.discountPrice > 0 ? "14px" : "22px", // Giảm font-size cho giá gốc
                    }}
                  >
                    {product.defaultPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                )}
                {product.discountPrice > 0 &&
                  product.defaultPrice !== undefined && (
                    <span
                      style={{
                        backgroundColor: "#e63946",
                        color: "#fff",
                        borderRadius: "20px",
                        padding: "4px 10px",
                        fontSize: "11px",
                      }}
                    >
                      -
                      {(
                        ((product.defaultPrice - product.discountPrice) /
                          product.defaultPrice) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  )}
              </div>
              {product.discountPrice > 0 &&
                product.defaultPrice !== undefined && (
                  <span style={{ fontSize: "14px", color: "#999" }}>
                    (Tiết kiệm{" "}
                    {(
                      product.defaultPrice - product.discountPrice
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                    )
                  </span>
                )}
            </p>
            <div className="select-size" style={{ flexWrap: "wrap" }}>
              <label>{t("MES-014")}:</label>
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
              <p style={{ color: "red", marginTop: "8px" }}>{t("MES-0116")}</p>
            )}
            <div className="select-color" style={{ flexWrap: "wrap" }}>
              <label>{t("MES-015")}:</label>
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
              <p style={{ color: "red", marginTop: "8px" }}>{t("MES-117")}</p>
            )}
            {selectedColor && selectedSize && availableQuantity >= 0 && (
              <div style={{ margin: "10px 0" }}>
                {availableQuantity === 0 ? (
                  <p style={{ color: "red" }}>{t("MES-118")}</p>
                ) : (
                  <p>
                    {t("MES-119")}: {availableQuantity}
                  </p>
                )}
              </div>
            )}
            <div className="quantity">
              <button
                className="quantity-btn"
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  } else {
                    message.info(t("MES-120"));
                  }
                }}
              >
                -
              </button>
              <Input
                type="number"
                min={1}
                max={999}
                className="quantity-input"
                value={quantity}
                onKeyDown={(e) => {
                  if (
                    e.key === "." || // Dấu chấm
                    e.key === "," || // Dấu phẩy
                    e.key === "e" || // Số mũ
                    e.key === "-" || // Dấu trừ
                    e.key === "+" // Dấu cộng
                  ) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số nguyên
                  if (!value) {
                    setQuantity(""); // Cho phép xóa toàn bộ để về rỗng
                    return;
                  }
                  const numericValue = parseInt(value, 10);
                  if (availableQuantity === 0) {
                    message.info(t("MES-121"));
                  } else if (numericValue < 1) {
                    message.info(t("MES-120"));
                  } else if (numericValue > availableQuantity) {
                    message.info(t("MES-111"));
                  } else {
                    setQuantity(numericValue); // Đặt giá trị hợp lệ
                  }
                }}
              />
              <button
                className="quantity-btn"
                onClick={() => {
                  if (availableQuantity === 0) {
                    message.info(t("MES-121"));
                  } else {
                    const newQuantity = Number(quantity);
                    if (newQuantity < availableQuantity) {
                      setQuantity(newQuantity + 1);
                    } else {
                      message.info(t("MES-111"));
                    }
                  }
                }}
              >
                +
              </button>
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>
              {t("MES-017")}
            </button>
          </div>
        </div>
      </div>
      <div style={styles.productDescription}>
        <Tabs defaultActiveKey="1" tabPosition="top" size="large" centered>
          <TabPane tab={t("MES-210")} key="1">
            <p>
              <strong style={styles.strong}>{t("MES-211")}:</strong>{" "}
              {product?.code || "Không có mã sản phẩm"}
            </p>
            <h3 style={styles.h3}>
              {t("MES-131")}:{" "}
              {product?.productResponse?.name || "Không có tên sản phẩm"}
            </h3>
            <p>
              {t("MES-212")}:{" "}
              {product?.productResponse?.description || "Không có mô tả"}
            </p>
            <div>
              <strong style={styles.strong}>{t("MES-213")}:</strong>
              <ul style={styles.ul}>
                <li>
                  {t("MES-014")}: {product?.size?.name || "Không có kích thước"}
                </li>
                <li>
                  {t("MES-015")}: {product?.color?.name || "Không có màu"}
                </li>
                <li>{t("MES-214")}</li>
              </ul>
            </div>
            <p>
              <strong style={styles.strong}>{t("MES-215")}:</strong>
            </p>
            <p style={styles.brandInfo}>
              <i style={{ fontSize: "16px" }}>
                {product?.productResponse?.brandName || "Không có thương hiệu"}
              </i>
              , {t("MES-216")}
            </p>
          </TabPane>

          <TabPane tab={t("MES-217")} key="2">
            <h3 style={styles.h3}>1. {t("MES-218")}:</h3>
            <p>{t("MES-219")}</p>
            <h3 style={styles.h3}>2. {t("MES-220")}:</h3>
            <ul style={styles.ul}>
              <li>{t("MES-221")}</li>
              <li>{t("MES-222")}</li>
              <li>{t("MES-223")}</li>
              <li>{t("MES-224")}</li>
            </ul>
            <p>{t("MES-225")}</p>

            <h3 style={styles.h3}>3. {t("MES-226")}</h3>
            <p>{t("MES-227")}</p>

            <h3 style={styles.h3}>4. {t("MES-228")}:</h3>
            <p>{t("MES-229")}</p>

            <h3 style={styles.h3}>5. {t("MES-230")}</h3>
            <p>{t("MES-231")}</p>
          </TabPane>
        </Tabs>
      </div>
      <ProductCarousel />
    </div>
  );
};

export default ProductDetailPage;
