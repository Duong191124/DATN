import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useEffect, useRef, useState } from "react";
import { fetchTopFeaturedProducts } from "../../service/api.service";
import ProductDetailCard from "./product.detail.card";
import { useNavigate } from "react-router-dom";

const ProductCarousel = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5, // Hiển thị 5 item đầy đủ
      slidesToSlide: 1, // Chuyển 1 item mỗi lần
    },
  };

  // Ref để gọi hàm previous() và next()
  const carouselRef = useRef(null);

  // Định nghĩa các styles
  const styles = {
    container: {
      margin: "20px 40px", // Khoảng cách lề trên/dưới 20px, trái/phải 40px
      position: "relative",
    },
    title: {
      textAlign: "left",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    carouselWrapper: {
      position: "relative",
      width: "100%",
      overflow: "hidden",
    },
    arrow: {
      display: "none",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: "50%",
      color: "white",
      width: "40px",
      height: "40px",
      zIndex: 10,
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "20px",
      border: "none",
    },
    arrowLeft: {
      left: "10px",
    },
    arrowRight: {
      right: "10px",
    },
    itemContent: {
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "20px",
      position: "relative",
    },
  };

  const [dataTopFeatureProductDetail, setDataTopFeatureProductDetail] =
    useState([]);
  const navigate = useNavigate();

  const handleQuickView = (product) => {
    navigate(`/product/${product.productResponse.id}`);
  };
  const getTopFeatureProductDetail = async () => {
    const response = await fetchTopFeaturedProducts();
    if (response?.data?.data) {
      setDataTopFeatureProductDetail(response.data.data);
    }
  };

  useEffect(() => {
    getTopFeatureProductDetail();
  }, []);
  return (
    <div style={styles.container}>
      <div style={styles.title}>Sản phẩm Sale</div>

      <div
        style={styles.carouselWrapper}
        onMouseEnter={(e) => {
          e.currentTarget.querySelectorAll(".custom-arrow").forEach((arrow) => {
            arrow.style.display = "flex";
          });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelectorAll(".custom-arrow").forEach((arrow) => {
            arrow.style.display = "none";
          });
        }}
      >
        <Carousel
          ref={carouselRef} // Gắn ref vào Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlay={false}
          keyBoardControl={true}
          customTransition="all 0.5s linear"
          transitionDuration={0} // Loại bỏ hiệu ứng căn chỉnh
          partialVisible={true} // Hiển thị một phần item
          containerClass="carousel-container"
          itemClass="carousel-item"
          renderButtonGroupOutside={true} // Để sử dụng custom arrow
          arrows={false} // Ẩn arrow mặc định
        >
          {dataTopFeatureProductDetail.map((product, index) => (
            <div key={index}>
              <ProductDetailCard
                product={product}
                style={styles.itemContent}
                onQuickView={handleQuickView}
              />
            </div>
          ))}
        </Carousel>

        {/* Custom Arrow */}
        <button
          className="custom-arrow"
          style={{ ...styles.arrow, ...styles.arrowLeft }}
          onClick={() => carouselRef.current.previous()} // Chuyển item trước
        >
          {"<"}
        </button>
        <button
          className="custom-arrow"
          style={{ ...styles.arrow, ...styles.arrowRight }}
          onClick={() => carouselRef.current.next()} // Chuyển item sau
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
