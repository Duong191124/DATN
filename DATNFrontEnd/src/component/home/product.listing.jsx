// ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Input, Select, Row, Col, Typography, Slider, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import ProductCard from './product.card';

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

// Mock data
const mockProducts = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Premium Product ${index + 1}`,
    price: Math.floor(Math.random() * 1000) + 99,
    category: ['Electronics', 'Fashion', 'Home', 'Books'][Math.floor(Math.random() * 4)],
    stock: Math.floor(Math.random() * 20),
    image: `https://picsum.photos/400?random=${index}`,
    description: 'High-quality premium product with excellent features',
    brand: ['Brand A', 'Brand B', 'Brand C', 'Brand D'][Math.floor(Math.random() * 4)],
    createdAt: moment().subtract(Math.floor(Math.random() * 30), 'days').format(),
}));

const ProductList = () => {
    const [products, setProducts] = useState(mockProducts);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const debouncedSearch = debounce((value) => {
        setSearchText(value);
        setCurrentPage(1);
    }, 300);

    const handleAddToCart = (product) => {
        console.log('Adding to cart:', product);
        // Implement cart logic here
    };

    const handleAddToWishlist = (product) => {
        console.log('Adding to wishlist:', product);
        // Implement wishlist logic here
    };

    const handleQuickView = (product) => {
        console.log('Quick view:', product);
        // Implement quick view logic here
    };

    const filterProducts = () => {
        let filtered = [...mockProducts];

        if (searchText) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (selectedBrand !== 'All') {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }

        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
                break;
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        return filtered;
    };

    const paginatedProducts = filterProducts().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const categories = ['All', ...new Set(mockProducts.map(p => p.category))];
    const brands = ['All', ...new Set(mockProducts.map(p => p.brand))];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <Container>
            <Title level={2} style={{ marginBottom: 32, color: '#000' }}>Featured Products</Title>

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
                            style={{ width: '100%' }}
                            placeholder="Category"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                        >
                            {categories.map(category => (
                                <Option key={category} value={category}>{category}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} md={4}>
                        <Select
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="Brand"
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                        >
                            {brands.map(brand => (
                                <Option key={brand} value={brand}>{brand}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} md={6}>
                        <Text>Price Range: ${priceRange[0]} - ${priceRange[1]}</Text>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            value={priceRange}
                            onChange={setPriceRange}
                        />
                    </Col>
                    <Col xs={12} md={4}>
                        <Select
                            size="large"
                            style={{ width: '100%' }}
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
                        {paginatedProducts.map(product => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                <ProductCard
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onAddToWishlist={handleAddToWishlist}
                                    onQuickView={handleQuickView}
                                />
                            </Col>
                        ))}
                    </AnimatePresence>
                </Row>
            </motion.div>

            <Row justify="center" style={{ marginTop: 48 }}>
                <Pagination
                    current={currentPage}
                    total={filterProducts().length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                />
            </Row>
        </Container>
    );
};

export default ProductList;