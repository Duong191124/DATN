import { useEffect, useState } from "react";
import {
    fetchDataBrand,
    fetchDataCategory,
    fetchDataCollar,
    fetchDataSleeve,
    updateProductAPI,
} from "../../service/api.service";
import { Input, Modal, notification, Select } from "antd";

const UpdateProduct = (props) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [dataBrand, setDataBrand] = useState([]);
    const [dataSleeve, setDataSleeve] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataCollar, setDataCollar] = useState([]);
    const [selectedValueCollar, setSelectedValueCollar] = useState(null); // id của Collar
    const [selectedValueBrand, setSelectedValueBrand] = useState(null);   // id của Brand
    const [selectedValueCategory, setSelectedValueCategory] = useState(null); // id của Category
    const [selectValueSleeve, setSelectValueSleeve] = useState(null);  // id của Sleeve
    const [id, setId] = useState("");

    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadProduct } = props;

    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate.id);
            setCode(dataUpdate.code);
            setName(dataUpdate.name);
            setPrice(dataUpdate.price);
            setDescription(dataUpdate.description);

            // Dùng tên để hiển thị
            const collar = dataCollar.find((item) => item.name === dataUpdate.collarName);
            const brand = dataBrand.find((item) => item.name === dataUpdate.brandName);
            const category = dataCategory.find((item) => item.name === dataUpdate.categoryName);
            const sleeve = dataSleeve.find((item) => item.name === dataUpdate.sleeveName);

            // Lưu id để submit
            setSelectedValueCollar(collar ? collar.id : null);
            setSelectedValueBrand(brand ? brand.id : null);
            setSelectedValueCategory(category ? category.id : null);
            setSelectValueSleeve(sleeve ? sleeve.id : null);
        }
    }, [dataUpdate, dataBrand, dataCollar, dataCategory, dataSleeve]);

    const handleSubmit = async () => {
        const res = await updateProductAPI(
            id,
            code,
            name,
            description,
            price,
            selectValueSleeve,
            selectedValueBrand,
            selectedValueCategory,
            selectedValueCollar
        );
        if (res.data) {
            notification.success({
                message: "Update product",
                description: "Update product success",
            });
            resetCloseModal();
            loadProduct()
        } else {
            notification.error({
                message: "Update product",
                description: JSON.stringify(res.message),
            });
        }
    };

    useEffect(() => {
        loadDataBrand();
        loadDataSleeve();
        loadDataCategory();
        loadDataCollar();
    }, []);

    const loadDataBrand = async () => {
        const res = await fetchDataBrand();
        if (res.data) {
            setDataBrand(res.data);
        }
    };

    const loadDataSleeve = async () => {
        const res = await fetchDataSleeve();
        if (res.data) {
            setDataSleeve(res.data);
        }
    };

    const loadDataCategory = async () => {
        const res = await fetchDataCategory();
        if (res.data) {
            setDataCategory(res.data);
        }
    };

    const loadDataCollar = async () => {
        const res = await fetchDataCollar();
        if (res.data) {
            setDataCollar(res.data);
        }
    };

    const resetCloseModal = () => {
        setIsModalUpdateOpen(false);
        setCode("");
        setName("");
        setPrice("");
        setDescription("");
        setDataBrand([]);
        setDataSleeve([]);
        setDataCategory([]);
        setDataCollar([]);
        setDataUpdate(null);
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
                    <span>Name</span>
                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div>
                    <span>Price</span>
                    <Input value={price} onChange={(event) => setPrice(event.target.value)} />
                </div>

                <div>
                    <span>Collar</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a collar"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataCollar}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectedValueCollar(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectedValueCollar}
                    />
                </div>

                <div>
                    <span>Sleeve</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a sleeve"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }

                        options={dataSleeve}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectValueSleeve(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectValueSleeve}
                    />
                </div>

                <div>
                    <span>Category</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a category"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }

                        options={dataCategory}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectedValueCategory(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectedValueCategory}
                    />
                </div>

                <div>
                    <span>Brand</span>
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a brand"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataBrand}
                        fieldNames={{ label: "name", value: "id" }}
                        onChange={(value) => setSelectedValueBrand(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                        value={selectedValueBrand}
                    />
                </div>

                <div>
                    <span>Description</span>
                    <Input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default UpdateProduct;
