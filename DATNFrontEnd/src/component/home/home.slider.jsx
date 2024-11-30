import React, { useState } from "react";
import { Carousel } from "antd";
import { motion } from "framer-motion";
import { ArrowRightOutlined } from "@ant-design/icons";
import styled from "styled-components";

const DEFAULT_IMAGE = "https://picsum.photos/1600/900"; // Ảnh mặc định từ Picsum

const SliderContainer = styled.div`
  margin: 0 32px;
  position: relative;
  overflow: hidden;
  height: 600px; // Chiều cao cố định
  border-radius: 12px; // Bo góc nhẹ để trông hiện đại hơn
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const SlideContent = styled(motion.div)`
  position: absolute;
  bottom: 48px;
  left: 48px;
  z-index: 2;
  max-width: 600px;
  @media (max-width: 768px) {
    bottom: 32px;
    left: 32px;
    max-width: calc(100% - 64px);
  }
`;

const Title = styled(motion.h2)`
  color: white;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Description = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(16px, 2vw, 18px);
  margin-bottom: 24px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const LearnMoreButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    color: white;
  }

  .icon {
    transition: transform 0.3s ease;
  }

  &:hover .icon {
    transform: translateX(4px);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 1;
`;

const SlideImage = styled.div`
  width: 100%;
  height: 600px;
  background-size: cover;
  background-position: center;
  transition: transform 6s ease;
  background-image: url(${(props) => props.src || DEFAULT_IMAGE});

  &::before {
    content: "";
    display: block;
    padding-top: 56.25%; // 16:9 aspect ratio
  }
`;

const HomeSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slideData = [
    {
      imageUrl: "/image/bannernew.png",
      title: "Khám phá Sport Shirt",
      description:
        "Khám phá những sản phẩm mới, phóng cách hiện đại, mang theo xu hướng đổi mới, phát triển để phù hợp với khác hàng!",
      link: "/product",
    },
    {
      imageUrl:
        "https://bizweb.dktcdn.net/100/340/361/themes/913887/assets/slider_2.jpg?1732774238254",
      title: "Khám phá các thương hiệu",
      description:
        "Sự liên kết với các thương hiệu lớn, mang lại sản phẩm chất lượng cao, uy tín để mang đến cho khách hàng!",
      link: "/product",
    },
    {
      imageUrl: "/image/bannersale.png",
      title: "Chương trình ưu đãi",
      description: "Giảm giá các sản phẩm, với nhiều ưu đãi khác nhau!",
      link: "/product",
    },
  ];

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <SliderContainer>
      <Carousel
        autoplay
        effect="fade"
        afterChange={setActiveIndex}
        dots={{ className: "custom-dots" }}
        style={{ height: "100%" }}
      >
        {slideData.map((slide, index) => (
          <div key={index} style={{ position: "relative", height: "600px" }}>
            <SlideImage
              src={slide.imageUrl}
              style={{
                transform: activeIndex === index ? "scale(1.1)" : "scale(1)",
              }}
            />
            <Overlay />
            <SlideContent
              initial="hidden"
              animate={activeIndex === index ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Title variants={contentVariants}>{slide.title}</Title>
              <Description variants={contentVariants}>
                {slide.description}
              </Description>
              <LearnMoreButton href={slide.link} variants={contentVariants}>
                MUA NGAY
                <ArrowRightOutlined className="icon" />
              </LearnMoreButton>
            </SlideContent>
          </div>
        ))}
      </Carousel>

      <style>{`
        .ant-carousel .slick-dots {
          bottom: 24px;
        }
        .ant-carousel .slick-dots li {
          width: 24px;
        }
        .ant-carousel .slick-dots li button {
          background: rgba(255, 255, 255, 0.5);
          height: 4px;
          border-radius: 2px;
        }
        .ant-carousel .slick-dots li.slick-active button {
          background: white;
        }
      `}</style>
    </SliderContainer>
  );
};

export default HomeSlider;
