import { useParams } from "react-router-dom";
import "./product.detail.page.css";
import React, { useEffect, useState } from "react";
import {
  fetchDataColor,
  fetchDataSize,
  findByProductId,
} from "../../../../service/api.service";
import { useCart } from "../../../context/cart.context";
import ProductCarousel from "../../../home/product.carousel";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState({});
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]); // Danh sách màu có sẵn cho sản phẩm
  const [availableSizes, setAvailableSizes] = useState([]); // Danh sách kích thước có sẵn cho sản phẩm

  const initSize = async () => {
    const res = await fetchDataSize();
    setSize(res.data.data);
  };

  const initColor = async () => {
    const res = await fetchDataColor();
    setColor(res.data.data);
  };

  useEffect(() => {
    const initProduct = async () => {
      const res = await findByProductId(id);
      const productDetails = res.data.data.details;

      // Lấy danh sách màu và kích thước có sẵn từ product_detail
      const colorsAvailable = productDetails.map((detail) => detail.color.name);
      const sizesAvailable = productDetails.map((detail) => detail.size.code);
      setAvailableColors(colorsAvailable);
      setAvailableSizes(sizesAvailable);

      // Lọc chi tiết sản phẩm theo màu đã chọn
      const selectedProduct =
        productDetails.find((detail) => detail.color.name === selectedColor) ||
        productDetails[0];
      setProduct(selectedProduct);
    };

    initProduct();
  }, [id, selectedColor]);

  useEffect(() => {
    initSize();
    initColor();
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
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

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="product-info">
          <img src={product.image} alt={product.productResponse?.name} />
          <div className="product-details">
            <h1>{product.productResponse?.name}</h1>
            <p className="price">
              <span className="current-price">{product.defaultPrice}</span>
              {product.discountPrice && (
                <span className="discount-price">{product.discountPrice}</span>
              )}
            </p>
            <p>{product.productResponse?.description}</p>

            <div className="select-size">
              <label>Size:</label>
              <div className="size-options">
                {size
                  .filter((size) => size.status === 1)
                  .map((size) => (
                    <button
                      key={size.id}
                      className={`size-button ${selectedSize === size.code ? "selected" : ""
                        } ${!availableSizes.includes(size.code)
                          ? "disabled-size"
                          : ""
                        }`}
                      onClick={() => setSelectedSize(size.code)}
                      disabled={!availableSizes.includes(size.code)} // Disable nếu kích thước không có trong product_detail
                    >
                      {size.code}
                    </button>
                  ))}
              </div>
            </div>

            <div className="select-color">
              <label>Color:</label>
              <div className="color-options">
                {color
                  .filter((color) => color.status === 1)
                  .map((color) => (
                    <button
                      key={color.id}
                      className={`color-button ${selectedColor === color.name ? "selected" : ""
                        } ${!availableColors.includes(color.name)
                          ? "disabled-color"
                          : ""
                        }`}
                      onClick={() => setSelectedColor(color.name)}
                      disabled={!availableColors.includes(color.name)} // Disable nếu màu không có trong product_detail
                    >
                      {color.name}
                    </button>
                  ))}
              </div>
            </div>

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

            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ProductCarousel />
    </div>
  );
};

export default ProductDetailPage;
