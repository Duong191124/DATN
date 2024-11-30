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
import { Collapse, message, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
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
    if (availableQuantity === 0) {
      message.info("Hàng hết, vui lòng mua sản phẩm khác!");
      return;
    }

    if (quantity > availableQuantity) {
      message.info("Số lượng trong kho không đủ!");
      return;
    }
    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };
    addToCart(cartItem);
  };
  console.log("prodo", product);
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
                {availableQuantity === 0 ? (
                  <p style={{ color: "red" }}>Hết hàng</p>
                ) : (
                  <p>Số lượng có sẵn: {availableQuantity}</p>
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
                    message.info("Số lượng phải lớn hơn hoặc bằng 1!");
                  }
                }}
              >
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // loại bỏ ký tự không phải số
                  if (availableQuantity === 0) {
                    message.info("Vui lòng chọn size và màu sắc.");
                  } else {
                    if (value > availableQuantity) {
                      message.info("Số lượng tồn kho không đủ!");
                    } else if (value < 1) {
                      message.info("Số lượng phải lớn hơn hoặc bằng 1!");
                    } else {
                      setQuantity(value);
                    }
                  }
                }}
              />
              <button
                className="quantity-btn"
                onClick={() => {
                  if (availableQuantity === 0) {
                    message.info("Vui lòng chọn size và màu sắc.");
                  } else {
                    const newQuantity = Number(quantity);
                    if (newQuantity < availableQuantity) {
                      setQuantity(newQuantity + 1);
                    } else {
                      message.info("Số lượng trong kho không đủ!");
                    }
                  }
                }}
              >
                +
              </button>
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div style={styles.productDescription}>
        <Tabs defaultActiveKey="1" tabPosition="top" size="large" centered>
          <TabPane tab="Mô tả sản phẩm" key="1">
            <p>
              <strong style={styles.strong}>Mã sản phẩm:</strong>{" "}
              {product?.code || "Không có mã sản phẩm"}
            </p>
            <h3 style={styles.h3}>
              Sản phẩm:{" "}
              {product?.productResponse?.name || "Không có tên sản phẩm"}
            </h3>
            <p>
              Mô tả: {product?.productResponse?.description || "Không có mô tả"}
            </p>
            <div>
              <strong style={styles.strong}>Công nghệ & Chất liệu:</strong>
              <ul style={styles.ul}>
                <li>
                  Kích thước: {product?.size?.name || "Không có kích thước"}
                </li>
                <li>Màu: {product?.color?.name || "Không có màu"}</li>
                <li>
                  Thiết kế thời thượng, vẻ đẹp hoàn mĩ trong các sản phẩm, mang
                  đến cho người dùng sản phẩm tốt nhất!
                </li>
              </ul>
            </div>
            <p>
              <strong style={styles.strong}>Thông tin thương hiệu:</strong>
            </p>
            <p style={styles.brandInfo}>
              <i style={{ fontSize: "16px" }}>
                {product?.productResponse?.brandName || "Không có thương hiệu"}
              </i>
              , là một trong các thương hiệu nổi tiếng hàng đầu trên thế giới.
            </p>
          </TabPane>

          <TabPane tab="Chính sách giao hàng" key="2">
            <h3 style={styles.h3}>1. CƯỚC PHÍ VẬN CHUYỂN:</h3>
            <p>
              Tất cả các đơn hàng áp dụng biểu phí giao hàng theo từng khu vực
              được quy định bởi bên thứ 3...
            </p>
            <h3 style={styles.h3}>2. THỜI GIAN VẬN CHUYỂN:</h3>
            <ul style={styles.ul}>
              <li>
                Tuyến nội thành Hà Nội: giao hàng trong vòng 3-5 ngày kể từ khi
                hệ thống xác nhận qua tin nhắn (SMS)/điện thoại.
              </li>
              <li>
                Tuyến ngoại thành Hà Nội: giao hàng trong vòng 3-7 ngày kể từ
                khi hệ thống xác nhận qua tin nhắn (SMS)/điện thoại.
              </li>
              <li>
                Tuyến Đà Nẵng, TP.HCM: giao hàng trong vòng 3-7 ngày kể từ khi
                hệ thống xác nhận qua tin nhắn (SMS)/điện thoại.
              </li>
              <li>
                Tất cả thành phố khác: giao hàng trong vòng từ 3-7 ngày kể từ
                khi hệ thống xác nhận qua tin nhắn (SMS)/điện thoại.
              </li>
            </ul>
            <p>
              Thời gian giao hàng không tính thứ bảy, chủ nhật hay các ngày lễ
              tết.
            </p>

            <h3 style={styles.h3}>3. ĐƠN HÀNG ĐƯỢC GIAO TỐI ĐA MẤY LẦN?</h3>
            <p>
              Đơn hàng được giao tối đa 2 lần. Nếu lần 1 đơn hàng giao không
              thành công, nhân viên vận chuyển sẽ liên hệ lại bạn lần 2 sau 1-2
              ngày làm việc kế tiếp. Như vậy sau 2 lần giao dịch không thành
              công đơn hàng sẽ hủy.
            </p>

            <h3 style={styles.h3}>4. KIỂM TRA TÌNH TRẠNG ĐƠN HÀNG:</h3>
            <p>
              Để kiểm tra thông tin hoặc tình trạng đơn hàng bạn vui lòng sử
              dụng MÃ ĐƠN HÀNG đã được gửi trong email xác nhận hoặc tin nhắn
              xác nhận để thông báo tới bộ phận Chăm sóc khách hàng...
            </p>

            <h3 style={styles.h3}>
              5. KHI NHẬN ĐƠN HÀNG CÓ ĐƯỢC XEM SẢN PHẨM TRƯỚC KHI THANH TOÁN?
            </h3>
            <p>
              Bạn hoàn toàn có thể mở gói hàng kiểm tra sản phẩm trước khi thanh
              toán hoặc trước khi vận chuyển rời đi. Trong trường hợp bạn gặp
              vấn đề phát sinh bạn liên hệ ngay đến chúng tôi...
            </p>
          </TabPane>
        </Tabs>
      </div>

      <ProductCarousel />
    </div>
  );
};

export default ProductDetailPage;
