// ProductList.jsx
import React, { useState, useEffect } from "react";
import { Input, Select, Row, Col, Typography, Slider, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import ProductCard from "./product.card";
import {
  fetchDataBrand,
  fetchDataCategory,
  fetchDataColor,
  fetchDataSize,
  fetchPageDataProductDetail,
  fetchProductsByProductDetails,
} from "../../service/api.service";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const Container = styled.div`
  padding: 32px;
  background: #ffffff;
  min-height: 100vh;
`;

const FilterContainer = styled.div`
  padding: 24px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;
const ProductList = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const navigate = useNavigate();
  const debouncedSearch = debounce((value) => {
    setSearchText(value);
    setCurrentPage(1);
  }, 300);

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // Implement cart logic here
  };
  const initSize = async () => {
    const res = await fetchDataSize();
    setSize(res.data.data);
  };

  const initColor = async () => {
    const res = await fetchDataColor();
    setColor(res.data.data);
  };
  const getBrand = async () => {
    const res = await fetchDataBrand();
    setBrands(res.data.data);
  };
  const getCategory = async () => {
    const res = await fetchDataCategory();
    setCategories(res.data.data);
  };
  useEffect(() => {
    initSize();
    initColor();
    getBrand();
    getCategory();
  }, []);
  const handleAddToWishlist = (product) => {
    console.log("Adding to wishlist:", product);
    // Implement wishlist logic here
  };

  const handleQuickView = (product) => {
    navigate(`/product/${product.products.id}`);
  };

  const filterProducts = () => {
    let filtered = [...productDetails];
    if (searchText) {
      filtered = filtered.filter((product) => {
        const nameMatch = product.products.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const descriptionMatch = product.products.description
          .toLowerCase()
          .includes(searchText.toLowerCase());

        return nameMatch || descriptionMatch;
      });
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) =>
          product?.products?.categoryName.toLowerCase() ===
            selectedCategory.toLowerCase() || selectedCategory === "All"
      );
    }
    if (selectedBrand !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.products.brandName.toLowerCase() ===
          selectedBrand.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.minPrice >= priceRange[0] && product.minPrice <= priceRange[1]
    );

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const aDate = moment(a.products.createdAt).isValid()
            ? moment(a.products.createdAt).toDate()
            : new Date(0);
          const bDate = moment(b.products.createdAt).isValid()
            ? moment(b.products.createdAt).toDate()
            : new Date(0);
          return bDate - aDate;
        });
        break;
      case "price-asc":
        filtered.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.minPrice - a.minPrice);
        break;
      default:
        break;
    }
    return filtered;
  };

  const fetchAllProductDetail = async () => {
    const response = await fetchProductsByProductDetails(
      currentPage - 1,
      pageSize
    );
    if (response?.data?.data) {
      setProductDetails(response.data.data.products);
      setTotal(response.data.data.totalElements);
    }
  };
  useEffect(() => {
    fetchAllProductDetail();
  }, [currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container>
      <Title level={2} style={{ marginBottom: 32, color: "#000" }}>
        Featured Products
      </Title>

      <FilterContainer>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Input
              size="large"
              prefix={<SearchOutlined />}
              placeholder="Search products..."
              onChange={(e) => debouncedSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Category"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value || "All")}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Brand"
              value={selectedBrand}
              onChange={(value) => setSelectedBrand(value || "All")}
              allowClear
            >
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.name}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Text>
              Price Range:{" "}
              {`${priceRange[0].toLocaleString()} đ - ${priceRange[1].toLocaleString()} đ`}
            </Text>
            <Slider
              range
              min={0}
              max={10000000}
              value={priceRange}
              onChange={setPriceRange}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Sort by"
              value={sortBy}
              onChange={setSortBy}
            >
              <Option value="newest">Newest First</Option>
              <Option value="price-asc">Price: Low to High</Option>
              <Option value="price-desc">Price: High to Low</Option>
            </Select>
          </Col>
        </Row>
      </FilterContainer>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row gutter={[24, 24]}>
          <AnimatePresence>
            {filterProducts().map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={handleQuickView}
                  size={size}
                  color={color}
                />
              </Col>
            ))}
          </AnimatePresence>
        </Row>
      </motion.div>

      <Row justify="center" style={{ marginTop: 48 }}>
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </Row>
    </Container>
  );
};

export default ProductList;
