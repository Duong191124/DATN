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

const Home = () => {
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const [activeSize, setActiveSize] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const sizes = ["S", "M", "L", "XL"];
  const colors = ["green", "red", "black"];

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

  const renderProductCard = (product) => (
    <div className="card" key={product.id}>
      <div className="product-info">
        <div className="card-heart">
          <HeartOutlined />
        </div>
        {product.onSale && (
          <span className="sale-badge">SALE {product.salePercent}%</span>
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
            <h3>Size:</h3>
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
            <h3>Color:</h3>
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
            <button className="buy">Detail</button>
            <button className="cart">
              <ShoppingCartOutlined />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const newProducts = [
    {
      id: 1,
      title: "Áo Manchester United",
      price: "390.000 VNĐ",
      image:
        "https://www.sporter.vn/wp-content/uploads/2017/06/Vn-mu-do-2024-1-400x400.jpg",
      onSale: false,
    },
    {
      id: 2,
      title: "Áo Manchester United",
      price: "390.000 VNĐ",
      image:
        "https://www.sporter.vn/wp-content/uploads/2017/06/Vn-mu-do-2024-1-400x400.jpg",
      onSale: false,
    },
    {
      id: 3,
      title: "Áo Manchester United",
      price: "390.000 VNĐ",
      image:
        "https://www.sporter.vn/wp-content/uploads/2017/06/Vn-mu-do-2024-1-400x400.jpg",
      onSale: false,
    },
    {
      id: 4,
      title: "Áo Manchester United",
      price: "390.000 VNĐ",
      image:
        "https://www.sporter.vn/wp-content/uploads/2017/06/Vn-mu-do-2024-1-400x400.jpg",
      onSale: false,
    },
    // Thêm sản phẩm mới khác
  ];

  const saleProducts = [
    {
      id: 1,
      title: "Áo Manchester United Mua gia 2023",
      price: "390.000 VNĐ",
      image:
        "https://cdn.yousport.vn/Media/Products/280224114618543/lvplm0002_wh_large.jpg?width=284&height=213&quality=99&scale=downscaleonly",
      onSale: true,
      salePercent: 20,
    },
    {
      id: 2,
      title: "Áo Manchester United Mua gia 2023",
      price: "390.000 VNĐ",
      image:
        "https://cdn.yousport.vn/Media/Products/280224114618543/lvplm0002_wh_large.jpg?width=284&height=213&quality=99&scale=downscaleonly",
      onSale: true,
      salePercent: 20,
    },
    {
      id: 3,
      title: "Áo Manchester United Mua gia 2023",
      price: "390.000 VNĐ",
      image:
        "https://cdn.yousport.vn/Media/Products/280224114618543/lvplm0002_wh_large.jpg?width=284&height=213&quality=99&scale=downscaleonly",
      onSale: true,
      salePercent: 20,
    },
    {
      id: 4,
      title: "Áo Manchester United Mua gia 2023",
      price: "390.000 VNĐ",
      image:
        "https://cdn.yousport.vn/Media/Products/280224114618543/lvplm0002_wh_large.jpg?width=284&height=213&quality=99&scale=downscaleonly",
      onSale: true,
      salePercent: 20,
    },
    // Thêm sản phẩm giảm giá khác
  ];

  return (
    <>
      <div className="home-container">
        <div className="slide" ref={slideRef}>
          {Array.from({ length: 5 }, (_, i) => (
            <div className={`item slide${i + 1}`} key={i}>
              <div className="content">
                <div className="name">THỂ THAO</div>
                <div className="description">
                  Sản phẩm mạng đên trải nghiệm tốt nhất dành cho người dùng,
                  sport chúng tôi luôn hỗ trợ bạn mọi lúc. hahahhahaha
                </div>
                <button>Xem nhiều hơn</button>
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
            <h1>Sản phẩm mới nhất</h1>
          </div>
          <div className="product-body">
            {newProducts.map(renderProductCard)}
            <div className="show-more">
              <NavLink to={"/"} className={"btn"}>
                Xem thêm
              </NavLink>
            </div>
          </div>

          <div className="header-sale">
            <h1>SALE</h1>
          </div>
          <div className="product-sale">
            {saleProducts.map(renderProductCard)}
            <div className="show-more">
              <NavLink to={"/"} className={"btn"}>
                Xem thêm
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
