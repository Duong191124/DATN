import { useEffect, useState } from "react";
import { fetchAllProduct, fetchDataColorAPI, fetchDataSize, updateProductDetailAPi } from "../../service/api.service";
import { Input, Modal, notification, Select } from "antd";

const ProductDetailUpdate = (props) => {
    const [id, setId] = useState("");
    const [code, setCode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [dataProduct, setDataProduct] = useState([]);
    const [dataSize, setDataSize] = useState([]);
    const [dataColor, setDataColor] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectColor] = useState(null);

    const { loadProductDetail, isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props;

    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate.id);
            setCode(dataUpdate.code);
            setPrice(dataUpdate.price);
            setQuantity(dataUpdate.quantity);


            // Dùng tên để hiển thị
            const product = dataProduct.find((item) => item.name === dataUpdate.dataProduct);
            const color = dataColor.find((item) => item.name === dataUpdate.dataColor);
            const size = dataSize.find((item) => item.name === dataUpdate.dataSize);

            // Lưu id để submit
            setSelectedProduct(product ? product.id : null);
            setSelectedSize(size ? size.id : null);
            setSelectColor(color ? color.id : null);
        }
    }, [dataUpdate, dataProduct, dataSize, dataColor]);

    const handleSubmit = async () => {
        const res = await updateProductDetailAPi(
            id, code, quantity, price, selectedProduct, selectedSize, selectedColor
        );
        if (res.data) {
            notification.success({
                message: "Update product",
                description: "Update product success",
            });
            resetCloseModal();
            loadProductDetail()
        } else {
            notification.error({
                message: "Update product",
                description: JSON.stringify(res.message),
            });
        }
    };

    useEffect(() => {
        loadDataBrandProduct();
        loadDataColor();
        loadDataSize();
    }, []);

    const loadDataBrandProduct = async () => {
        const res = await fetchAllProduct();
        if (res.data) {
            setDataProduct(res.data);
        }
    };

    const loadDataColor = async () => {
        const res = await fetchDataColorAPI();
        if (res.data) {
            setDataColor(res.data);
        }
    };

    const loadDataSize = async () => {
        const res = await fetchDataSize();
        if (res.data) {
            setDataSize(res.data);
        }
    };



    const resetCloseModal = () => {
        setCode("")
        setQuantity("")
        setDataProduct("")
        setDataSize("")
        setDataColor("")
        setIsModalUpdateOpen(false)
        setDataUpdate(null)
    };

    return (
        <Modal
            title="Update Product"
            open={isModalUpdateOpen}
            onOk={handleSubmit}
            onCancel={resetCloseModal}
            okText="SAVE"
        >
            <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                <div>
                    <span>ID</span>
                    <Input value={id} onChange={(event) => setId(event.target.value)} disabled />
                </div>

                <div>
                    <span>Code</span>
                    <Input value={code} onChange={(event) => setCode(event.target.value)} />
                </div>

                <div>
                    <span>Quantity</span>
                    <Input value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                </div>

                <div>
                    <span>Price</span>
                    <Input value={price} onChange={(event) => setPrice(event.target.value)} />
                </div>

                <div>
                    <span>Product</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a product"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataProduct}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectedProduct(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectedProduct}
                    />
                </div>

                <div>
                    <span>Color</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a color"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }

                        options={dataColor}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectColor(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectedColor}
                    />
                </div>

                <div>
                    <span>Size</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a size"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }

                        options={dataSize}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectedSize(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectedSize}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailUpdate;
