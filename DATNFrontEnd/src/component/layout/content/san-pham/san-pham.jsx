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
import { Link, useNavigate } from "react-router-dom";
import {
    fetchDataCategory,
    fetchDataColor,
    fetchDataSize,
    fetchProductsByProductDetails,
} from "../../../../service/api.service";
import ProductCard from "../../../home/product.card";

const SanPham = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
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
    useEffect(() => {
        initSize();
        initColor();
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
        const { category, range } = values; // Get category and range from the form
        const fromPrice = range?.from || 0;
        const toPrice = range?.to || Infinity; // Set to Infinity if "to" is not defined

        // Filter products based on category and price range
        const filtered = listProduct.filter((product) => {
            const isInCategory = category
                ? category.includes(product.categoryId)
                : true; // Check if category matches
            const isInPriceRange =
                product.price >= fromPrice && product.price <= toPrice; // Check if price is within range
            return isInCategory && isInPriceRange;
        });

        setFilteredProduct(filtered); // Set the filtered products
    };
    const filterProducts = () => {
        let filtered = [...listProduct];
        return filtered;
    };
    const handleReset = () => {
        form.resetFields(); // Reset form fields
        setFilteredProduct(listProduct); // Reset to the original product list
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
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col
                                                        span={24}
                                                        key={`index-${index}`}
                                                        style={{ padding: "7px 0" }}
                                                    >
                                                        <Checkbox value={item.value}>{item.label}</Checkbox>
                                                    </Col>
                                                );
                                            })}
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
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    }
                                                    style={{ width: "100%" }}
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
                                                    min={0}
                                                    placeholder="đ ĐẾN"
                                                    formatter={(value) =>
                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    }
                                                    style={{ width: "100%" }}
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
                        <Row justify="center">
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
                            <Pagination style={{ marginTop: "30px" }}
                                current={currentPage}
                                total={total}
                                pageSize={pageSize}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                            />
                        </Row>
                    </Col>
<<<<<<< HEAD
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "to"]}>
                        <InputNumber
                          name="to"
                          max={10000000}
                          placeholder="đ ĐẾN"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
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
=======
                </Row>
>>>>>>> a359f2081a8eab6edcc1fa56b23640ab15b871d6
            </div>
        </div>
    );
};

export default SanPham;