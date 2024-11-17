import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRef } from "react";

const ProductCarousel = () => {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5, // Hiển thị 5 item đầy đủ
            slidesToSlide: 1 // Chuyển 1 item mỗi lần
        }
    };

    // Ref để gọi hàm previous() và next()
    const carouselRef = useRef(null);

    // Định nghĩa các styles
    const styles = {
        container: {
            margin: "20px 40px", // Khoảng cách lề trên/dưới 20px, trái/phải 40px
            position: "relative"
        },
        title: {
            textAlign: "left",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px"
        },
        carouselWrapper: {
            position: "relative",
            width: "100%",
            overflow: "hidden"
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
            border: "none"
        },
        arrowLeft: {
            left: "10px"
        },
        arrowRight: {
            right: "10px"
        },
        itemContent: {
            height: "250px",
            width: "250px",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "20px",
            marginRight: "-20px"
        }
    };

    return (
        <div style={styles.container}>
            {/* Tiêu đề nhãn */}
            <div style={styles.title}>Sản phẩm nổi bật</div>

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
                    {Array.from({ length: 9 }, (_, i) => (
                        <div key={i} style={styles.itemContent}>
                            Item {i + 1}
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
