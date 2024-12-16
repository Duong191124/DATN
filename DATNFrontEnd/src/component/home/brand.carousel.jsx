import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, Typography, Badge } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { LeftOutlined, RightOutlined, StarOutlined } from "@ant-design/icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { fetchDataBrand } from "../../service/api.service";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;

const StyledContainer = styled.div`
  padding: 40px 80px;
  max-width: 1400px;
  margin: 0 auto;
  background: #ffffff;
`;

const CarouselContainer = styled.div`
  position: relative;
  padding: 20px 40px;

  .react-multi-carousel-track {
    gap: 30px;
    padding: 20px 0;
  }

  /* Đảm bảo container giữ nguyên chiều cao */
  .react-multi-carousel-list {
    position: unset;
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 50px;
  text-align: center;
  color: #000000;
  position: relative;

  &:after {
    content: "";
    display: block;
    margin: 15px auto;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #000000, #404040);
    border-radius: 2px;
  }
`;

const StyledCard = styled(motion(Card))`
  margin: 10px;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  border-radius: 0;
  overflow: visible;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #000000;
    box-shadow: 15px 15px 0 rgba(0, 0, 0, 0.9);
    transform: translate(-8px, -8px);

    .brand-logo {
      transform: scale(1.1);
      background: #000000;
    }

    .brand-badge {
      opacity: 1;
      transform: translateY(0);
    }

    .brand-name {
      color: #000000;
    }
  }

  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    width: 100%;
  }
`;

const BrandLogo = styled.div.attrs({ className: "brand-logo" })`
  width: 80px;
  height: 80px;
  background: #333333;
  padding: 10px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 26px;
  margin-bottom: 20px;
  transition: all 0.4s ease;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
`;

const BrandBadge = styled(motion.div).attrs({ className: "brand-badge" })`
  position: absolute;
  top: -10px;
  right: -10px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
`;

const BrandName = styled(Title).attrs({ className: "brand-name" })`
  font-size: 22px !important;
  text-align: center;
  margin: 16px 0 12px !important;
  transition: color 0.4s ease;
  color: #333333;
  font-weight: 600 !important;

  &:hover {
    color: #000000;
  }
`;

const BrandDescription = styled(Text)`
  text-align: center;
  color: #666666;
  font-size: 15px;
  line-height: 1.6;
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: calc(50% - 25px); /* Căn giữa chính xác */
  width: 50px;
  height: 50px;
  background: white;
  border: 1px solid #000000;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #000000;

    .anticon {
      color: white;
    }
  }

  &.prev {
    left: 0;
  }

  &.next {
    right: 0;
  }

  .anticon {
    font-size: 20px;
    color: #000000;
    transition: color 0.3s ease;
  }
`;

const ButtonGroup = styled.div`
  position: absolute;
  width: 100%;
  height: 0;
  top: 50%;
  left: 0;
  z-index: 2;
`;

const BrandCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [brand, setBrand] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = localStorage.getItem("i18nextLng") || "vi";
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);
  const getBrands = async () => {
    const response = await fetchDataBrand();
    if (response?.data?.data) {
      const updatedBrands = response.data.data.map((brand) => {
        let logo, description;
        switch (brand.name) {
          case "Nike":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo-700x394.png"; // Nike logo
            description = `${t("MES-061")}`;
            break;
          case "Adidas":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo-700x394.png"; // Adidas logo
            description = `${t("MES-062")}`;
            break;
          case "Puma":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo-700x394.png"; // Puma logo
            description = `${t("MES-063")}`;
            break;
          case "Reebok":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo-700x394.png"; // Reebok logo
            description = `${t("MES-064")}`;
            break;
          case "Under Armour":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/04/Under-Armour-Logo-700x394.png"; // Under Armour logo
            description = `${t("MES-065")}`;
            break;
          case "New Balance":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/09/New-Balance-Logo-700x394.png"; // New Balance logo
            description = `${t("MES-066")}`;
            break;
          case "Converse":
            logo =
              "https://logos-world.net/wp-content/uploads/2020/06/Converse-Logo-700x394.png"; // Converse logo
            description = `${t("MES-067")}`;
            break;
          default:
            logo =
              "https://tse3.mm.bing.net/th?id=OIP.GzuYVC7BRiRpCnYboqeAkQAAAA&pid=Api&P=0&h=220";
            description = `${t("MES-068")}`;
            break;
        }
        return {
          ...brand,
          logo,
          description,
        };
      });
      setBrand(updatedBrands);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 40,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 20,
    },
  };

  const cardVariants = {
    hover: {
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  const CustomButtonGroup = ({ next, previous }) => (
    <ButtonGroup>
      <NavigationButton
        className="prev"
        onClick={previous}
        whileTap={{ scale: 0.95 }}
      >
        <LeftOutlined />
      </NavigationButton>
      <NavigationButton
        className="next"
        onClick={next}
        whileTap={{ scale: 0.95 }}
      >
        <RightOutlined />
      </NavigationButton>
    </ButtonGroup>
  );

  return (
    <StyledContainer>
      <StyledTitle level={3}>{t("MES-069")}</StyledTitle>
      <CarouselContainer
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Carousel
          responsive={responsive}
          infinite
          autoPlay={!isHovered}
          autoPlaySpeed={4000}
          customTransition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          containerClass="carousel-container"
          renderButtonGroupOutside
          customButtonGroup={<CustomButtonGroup />}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          partialVisible
          arrows={false}
        >
          {brand.map((brand) => (
            <StyledCard
              key={brand.id}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => {
                navigate(`/product?brand=${brand.name}`);
              }}
            >
              <BrandBadge>
                <Badge
                  count={<StarOutlined style={{ color: "#000000" }} />}
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    border: "1px solid #000000",
                  }}
                />
              </BrandBadge>
              <BrandLogo>
                <img
                  src={brand.logo}
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </BrandLogo>
              <BrandName level={4}>{brand.name}</BrandName>
              <BrandDescription>{brand.description}</BrandDescription>
            </StyledCard>
          ))}
        </Carousel>
      </CarouselContainer>
    </StyledContainer>
  );
};

export default BrandCarousel;
