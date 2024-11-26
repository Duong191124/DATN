import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Empty,
  Pagination,
} from "antd"; // Thêm Empty từ Ant Design
import { useEffect, useState } from "react";
import "./san-pham.css";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  fetchDataBrand,
  fetchDataCategory,
  fetchDataColor,
  fetchDataSize,
  fetchProductsByProductDetails,
} from "../../../../service/api.service";
import ProductCard from "../../../home/product.card";
import { range, values } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const SanPham = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [listCategory, setListCategory] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const navigate = useNavigate();
  useEffect(() => {
    const initCategory = async () => {
      const res = await fetchDataCategory();
      if (res.data && res.data.data) {
        const categories = res.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setListCategory(categories);
      }
    };
    initCategory();
  }, []);
  const initSize = async () => {
    const res = await fetchDataSize();
    setSize(res.data.data);
  };
  const handleQuickView = (product) => {
    navigate(`/product/${product.products.id}`);
  };
  const initColor = async () => {
    const res = await fetchDataColor();
    setColor(res.data.data);
  };
  const getBrand = async () => {
    const res = await fetchDataBrand();
    if (res?.data?.data) {
      setBrands(res.data.data);
    }
  };
  const getCategory = async () => {
    const res = await fetchDataCategory();
    if (res?.data?.data) {
      setCategories(res.data.data);
    }
  };
  useEffect(() => {
    initSize();
    initColor();
    getBrand();
    getCategory();
  }, []);
  useEffect(() => {
    const initProduct = async () => {
      const response = await fetchProductsByProductDetails(
        currentPage - 1,
        pageSize
      );
      if (response?.data?.data) {
        setListProduct(response.data.data.products);
        setTotal(response.data.data.totalElements);
      }
    };
    initProduct();
  }, [currentPage]);
  const onFinish = (values) => {
    const range = values.range || {};
    let from = range.from || 0;
    let to = range.to || 10000000;
    if (from < 0) from = 0;
    if (to < 0) to = 0;
    if (to < from) {
      to = from;
    }
    setPriceRange([from, to]);
    filterProducts();
  };

  const filterProducts = () => {
    let filtered = [...listProduct];
    if (!selectedBrand.includes("All")) {
      filtered = filtered.filter((product) =>
        selectedBrand.some(
          (brand) =>
            product?.products?.brandName?.toLowerCase() === brand.toLowerCase()
        )
      );
    }

    if (!selectedColor.includes("All")) {
      filtered = filtered.filter((product) =>
        selectedColor.some((color) => {
          const colorName = product?.details?.some((productDetail) => {
            const colorName = productDetail?.color?.name?.toLowerCase();
            const selectedColorName = color?.toLowerCase();
            return (
              colorName === selectedColorName && productDetail?.quantity > 0
            );
          });
          return colorName;
        })
      );
    }
    if (!selectedSize.includes("All")) {
      filtered = filtered.filter((product) =>
        selectedSize.some((size) => {
          const sizeName = product?.details?.some((productDetail) => {
            const sizeName = productDetail?.size?.name?.toLowerCase();
            const selectedSizeName = size?.toLowerCase();
            return sizeName === selectedSizeName && productDetail?.quantity > 0;
          });
          return sizeName;
        })
      );
    }
    if (!selectedCategory.includes("All")) {
      filtered = filtered.filter((product) =>
        selectedCategory.some(
          (category) =>
            product?.products?.categoryName?.toLowerCase() ===
            category.toLowerCase()
        )
      );
    }
    filtered = filtered.filter(
      (product) =>
        product.minPrice >= priceRange[0] && product.minPrice <= priceRange[1]
    );

    return filtered;
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const brandFromQuery = queryParams.get("brand");
    const categoryFromQuery = queryParams.get("category");
    if (brandFromQuery) {
      setSelectedBrand([brandFromQuery]);
      setSelectedCategory([categoryFromQuery]);
    } else {
      setSelectedBrand(["All"]);
      setSelectedCategory(["All"]);
    }
  }, [location.search]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromQuery = queryParams.get("category");
    if (categoryFromQuery) {
      setSelectedCategory([categoryFromQuery]);
    } else {
      setSelectedCategory(["All"]);
    }
  }, [location.search]);
  const handleReset = () => {
    form.resetFields();
    setSelectedCategory(["All"]);
    setSelectedBrand(["All"]);
    setSelectedColor(["All"]);
    setSelectedSize(["All"]);
    setPriceRange([0, 10000000]);
    setFilteredProduct(listProduct);
  };
  return (
    <div
      style={{ background: "#efefef", padding: "20px 0", marginTop: "70px" }}
    >
      <div
        className="homepage-container"
        style={{ maxWidth: 1600, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={4} sm={0} xs={0}>
            <div
              style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <FilterTwoTone />
                  <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                </span>
                <ReloadOutlined title="Reset" onClick={handleReset} />
              </div>
              <Divider />
              <Form onFinish={onFinish} form={form}>
                <Form.Item
                  name="brand"
                  label={
                    <span style={{ fontWeight: "bold" }}>Thương hiệu</span>
                  }
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group
                    value={selectedBrand.length === 0 ? ["All"] : selectedBrand}
                    onChange={(selectedValues) => {
                      if (selectedValues.length === 0) {
                        setSelectedBrand(["All"]);
                      } else {
                        const filteredValues = selectedValues.filter(
                          (value) => value !== "All"
                        );
                        setSelectedBrand(filteredValues);
                      }
                    }}
                  >
                    <Row>
                      {brands?.map((item, index) => (
                        <Col
                          span={24}
                          key={`index-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox key={item.id} value={item.name}>
                            {item.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item
                  name="category"
                  label={
                    <span style={{ fontWeight: "bold" }}>
                      Danh mục sản phẩm
                    </span>
                  }
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group
                    value={
                      selectedCategory.length === 0 ? ["All"] : selectedCategory
                    }
                    onChange={(selectedValues) => {
                      if (selectedValues.length === 0) {
                        setSelectedCategory(["All"]);
                      } else {
                        const filteredValues = selectedValues.filter(
                          (value) => value !== "All"
                        );
                        setSelectedCategory(filteredValues);
                      }
                    }}
                  >
                    <Row>
                      {categories?.map((item, index) => (
                        <Col
                          span={24}
                          key={`index-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox
                            value={item.name}
                            checked={selectedCategory.includes(item.name)}
                          >
                            {item.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item
                  name="color"
                  label={<span style={{ fontWeight: "bold" }}>Màu</span>}
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group
                    value={selectedColor.length === 0 ? ["All"] : selectedColor}
                    onChange={(selectedValues) => {
                      if (selectedValues.length === 0) {
                        setSelectedColor(["All"]);
                      } else {
                        const filteredValues = selectedValues.filter(
                          (value) => value !== "All"
                        );
                        setSelectedColor(filteredValues);
                      }
                    }}
                  >
                    <Row>
                      {color?.map((item, index) => (
                        <Col
                          span={24}
                          key={`index-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox
                            value={item.name}
                            checked={selectedColor.includes(item.name)}
                          >
                            {item.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item
                  name="size"
                  label={<span style={{ fontWeight: "bold" }}>Kích thước</span>}
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group
                    value={selectedSize.length === 0 ? ["All"] : selectedSize}
                    onChange={(selectedValues) => {
                      if (selectedValues.length === 0) {
                        setSelectedSize(["All"]);
                      } else {
                        const filteredValues = selectedValues.filter(
                          (value) => value !== "All"
                        );
                        setSelectedSize(filteredValues);
                      }
                    }}
                  >
                    <Row>
                      {size?.map((item, index) => (
                        <Col
                          span={24}
                          key={`index-${index}`}
                          style={{ padding: "7px 0" }}
                        >
                          <Checkbox
                            value={item.name}
                            checked={selectedSize.includes(item.name)}
                          >
                            {item.name}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <Row gutter={[10, 10]} style={{ width: "100%" }}>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "from"]}>
                        <InputNumber
                          name="from"
                          min={0}
                          placeholder="đ TỪ"
                          formatter={(value) =>
                            value
                              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              : ""
                          }
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          onChange={values}
                          style={{ width: "100%" }}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) && // Cho phép chỉ nhập số
                              e.key !== "Backspace" && // Cho phép phím Backspace để xóa
                              e.key !== "ArrowLeft" && // Cho phép phím mũi tên trái
                              e.key !== "ArrowRight" && // Cho phép phím mũi tên phải
                              e.key !== "Tab" // Cho phép phím Tab
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={2} md={0}>
                      <div> - </div>
                    </Col>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "to"]}>
                        <InputNumber
                          name="to"
                          max={10000000}
                          placeholder="đ ĐẾN"
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                          onChange={values}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) && // Cho phép chỉ nhập số
                              e.key !== "Backspace" && // Cho phép phím Backspace để xóa
                              e.key !== "ArrowLeft" && // Cho phép phím mũi tên trái
                              e.key !== "ArrowRight" && // Cho phép phím mũi tên phải
                              e.key !== "Tab" // Cho phép phím Tab
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div>
                    <Button type="primary" htmlType="submit">
                      Áp dụng
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col md={20} sm={24} xs={24}>
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
                        size={size}
                        color={color}
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
                total={total}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SanPham;
