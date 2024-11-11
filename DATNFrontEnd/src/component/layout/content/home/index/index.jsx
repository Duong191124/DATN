import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Empty } from 'antd'; // Thêm Empty từ Ant Design
import { useEffect, useState } from 'react';
import './home.css';
import { fetchDataCategory, fetchDataProductAPI } from '../../../../../service/api.service';
import ChatBox from '../../chat/chat';
import { Link } from 'react-router-dom';

const Home = () => {
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([]);
    const [listProduct, setListProduct] = useState([]);

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
        const initProduct = async () => {
            const res = await fetchDataProductAPI();
            if (res.data && res.data.data) {
                const product = res.data.data.map(item => ({
                    title: item.name,
                    price: item.price,
                    image: item.image,
                    id: item.id
                }));
                setListProduct(product);
            }
        };
        initProduct();
    }, []);

    const onFinish = (values) => {
        // Xử lý form submission nếu cần
    };

    return (
        <div style={{ background: '#efefef', padding: "20px 0", marginTop: "70px" }}>
            <div className="homepage-container" style={{ maxWidth: 1600, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <span> <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
                            </div>
                            <Divider />
                            <Form
                                onFinish={onFinish}
                                form={form}
                            >
                                <Form.Item
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
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
                                            <Form.Item name={["range", 'from']} >
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
                                            <Form.Item name={["range", 'to']} >
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
                                        <Button onClick={() => { }}>Áp dụng</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col md={20} sm={24} xs={24}>
                        <div className="customize-row" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
                            {listProduct?.length === 0 ? (
                                <div className="empty-message-container">
                                    <Empty description="Không có sản phẩm" />
                                </div>
                            ) : (
                                listProduct?.map((product, index) => (
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
                        </div>
                    </Col>
                </Row>
            </div>
            <ChatBox />
        </div>
    );
};

export default Home;
