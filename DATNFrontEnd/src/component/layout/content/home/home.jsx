import { useEffect, useRef, useState } from "react";
import {
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import "./home.css";
import ChatBox from "../chat/chat";
import { fetchDataProduct } from "../../../../service/api.service";
import { useCart } from "../../../context/cart.context";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [product, setProduct] = useState([]);
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["green", "red", "black"];

  const language = localStorage.getItem("language") || "vi";

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const nextSlide = () => {
    if (slideRef.current) {
      const firstItem = slideRef.current.firstChild;
      slideRef.current.appendChild(firstItem);
    }
  };

  const prevSlide = () => {
    if (slideRef.current) {
      const items = slideRef.current.children;
      const lastItem = items[items.length - 1];
      slideRef.current.prepend(lastItem, items[0]);
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetchDataProduct();
      const products = response.data.data || [];
      setProduct(products);
      setProduct(products);
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  const renderProductCard = (product) => (
    <div className="card" key={product.id}>
      <div className="product-info">
        <div className="card-heart">
          <HeartOutlined />
        </div>
        {product.onSale && (
          <span className="sale-badge">{t("MES-013")} {product.salePercent}%</span>
        )}
        <div className="product-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div
          className="product-content"
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div className="product-title">{product.title}</div>
          <div className="product-price">{product.price} VNĐ</div>
          <div className="product-size">
            <h3>{t("MES-014")}:</h3>
            {sizes.map((size) => (
              <span
                key={size}
                className={`size-item ${activeSize === size ? "active" : ""}`}
                onClick={() => setActiveSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
          <div className="product-color">
            <h3>{t("MES-015")}:</h3>
            {colors.map((color) => (
              <span
                key={color}
                className={`product-color-${color} ${activeColor === color ? "active" : ""
                  }`}
                onClick={() => setActiveColor(color)}
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  margin: "0 5px",
                  cursor: "pointer",
                }}
              ></span>
            ))}
          </div>
          <div className="product-action">
            <button className="buy">{t("MES-016")}</button>
            <button className="cart" onClick={() => addToCart(product)}>
              <ShoppingCartOutlined />
              {t("MES-017")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="home-container">
        <div className="slide" ref={slideRef}>
          {Array.from({ length: 5 }, (_, i) => (
            <div className={`item slide${i + 1}`} key={i}>
              <div className="content">
                <div className="name">{t("MES-018")}</div>
                <div className="description">
                  {t("MES-019")}
                </div>
                <button>{t("MES-020")}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="button">
          <button id="prev" onClick={prevSlide}>
            <LeftOutlined />
          </button>
          <button id="next" onClick={nextSlide}>
            <RightOutlined />
          </button>
        </div>
      </div>
      <div className="product-container">
        <div className="product-card">
          <div className="product-header">
            <h1>{t("MES-021")}</h1>
          </div>
          <div className="product-body">
            {product.map(renderProductCard)}
            <div className="show-more">
              <NavLink to={"/"} className={"btn"}>
                {t("MES-020")}
              </NavLink>
            </div>
          </div>

          <div className="header-sale">
            <h1>SALE</h1>
          </div>
          <div className="product-sale">
            {product.map(renderProductCard)}
            <div className="show-more">
              <NavLink to={"/"} className={"btn"}>
                {t("MES-020")}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <ChatBox /> { }
    </>
  );
};

export default Home;
