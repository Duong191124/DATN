import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Empty, Pagination } from 'antd'; // Thêm Pagination từ Ant Design
import { useEffect, useState } from 'react';
import './san-pham.css';
import { Link } from 'react-router-dom';
import { fetchDataCategory, fetchDataPageAndFilterProduct, fetchDataProductAPI } from '../../../../service/api.service';


const SanPham = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [filterCondition, setFilterCondition] = useState({});
    useEffect(() => {
        const initCategory = async () => {
            const res = await fetchDataCategory();
            if (res.data && res.data.data) {
                const categories = res.data.data.map(item => ({
                    label: item.name,
                    value: item.id
                }));
                setListCategory(categories);
            }
        };
        initCategory();
    }, []);

    useEffect(() => {

        initProduct();
    }, [filterCondition]);

    const initProduct = async () => {
        // filterCondition
        console.log(filterCondition)
        const res = await fetchDataPageAndFilterProduct(category_id);
        if (res.data && res.data.data) {
            const product = res.data.data;
            setListProduct(product);
            setFilteredProduct(product);
        }
    };
    const onFinish = (values) => {
        const { category, range } = values;
        const fromPrice = range?.from || 0;
        const toPrice = range?.to || Infinity;

        const filtered = listProduct.filter(product => {
            const isInCategory = category ? category.includes(product.categoryId) : true;
            const isInPriceRange = product.price >= fromPrice && product.price <= toPrice;
            return isInCategory && isInPriceRange;
        });

        setFilteredProduct(filtered);
        setCurrentPage(1);
    };

    const handleReset = () => {
        form.resetFields();
        setFilteredProduct(listProduct);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const paginatedProducts = filteredProduct.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const checkBoxCategory = () => {
        setFilterCondition(form.getFieldsValue())
    }
    return (
        <div style={{ background: '#efefef', padding: "20px 0", marginTop: "70px" }}>
            <div className="homepage-container" style={{ maxWidth: 1700, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <span>
                                    <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined title="Reset" onClick={handleReset} />
                            </div>
                            <Divider />
                            <Form
                                onFinish={onFinish}
                                onChange={checkBoxCategory}
                                form={form}
                            >
                                <Form.Item
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group value={listCategory} >
                                        <Row>
                                            {listCategory?.map((item) => {
                                                return (
                                                    <Col lg={24} span={24} key={item.value} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item.value}>
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Khoảng giá"
                                    labelCol={{ span: 24 }}
                                >
                                    <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'from']}>
                                                <InputNumber
                                                    name='from'
                                                    min={0}
                                                    placeholder="đ TỪ"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={2} md={0}>
                                            <div> - </div>
                                        </Col>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'to']}>
                                                <InputNumber
                                                    name='to'
                                                    min={0}
                                                    placeholder="đ ĐẾN"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button type="primary" htmlType="submit">Áp dụng</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col md={20} sm={24} xs={24}>
                        <div className="customize-row" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
                            {paginatedProducts?.length === 0 ? (
                                <div className="empty-message-container">
                                    <Empty description="Không có sản phẩm" />
                                </div>
                            ) : (
                                paginatedProducts?.map((product, index) => (
                                    <div className="column" key={index}>
                                        <div className="wrapper">
                                            <Link to={`/product/${product.id}`}>
                                                <img src={product.image} alt="product" />
                                            </Link>
                                            <div className="text">{product.title}</div>
                                            <div className="price">
                                                {product.price} đ
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <Row justify="center" style={{ marginTop: 350 }}>
                                <Pagination
                                    current={currentPage}
                                    total={filteredProduct.length}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                />
                            </Row>
                        </div>
                    </Col>
                </Row>


            </div>

        </div>
    );
};

export default SanPham;
