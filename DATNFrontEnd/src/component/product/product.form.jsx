import { Button, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { createProductAPI, fetchDataBrand, fetchDataCategory, fetchDataCollar, fetchDataSleeve } from "../../service/api.service";

const ProductForm = (props) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    const [sleeves, setSleeves] = useState([]);
    const [selectedSleeve, setSelectedSleeve] = useState(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [collars, setCollars] = useState([]);
    const [selectedCollar, setSelectedCollar] = useState(null);


    const [isModalOpen, setIsModalOpen] = useState(false)

    const { loadProduct } = props

    const handleSubmit = async () => {
        console.log(selectedCollar)
        const res = await createProductAPI(
            code,
            name,
            description,
            price,
            selectedSleeve,
            selectedCategory,
            selectedBrand,
            selectedCollar
        );
        if (res.data) {
            notification.success({
                message: "Create product",
                description: "Create product success"
            });
            resetCloseModal();
            await loadProduct();
        } else {
            notification.error({
                message: "Create product",
                description: JSON.stringify(res.message)
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
        setBrands(res.data);
    };

    const loadDataSleeve = async () => {
        const res = await fetchDataSleeve();
        setSleeves(res.data);
    };

    const loadDataCategory = async () => {
        const res = await fetchDataCategory();
        setCategories(res.data);
    };

    const loadDataCollar = async () => {
        const res = await fetchDataCollar();
        setCollars(res.data);
    };


    const resetCloseModal = () => {
        setIsModalOpen(false)
        setCode("")
        setName("")
        setPrice("")
        setDescription("")
        setBrands("")
        setSleeves("")
        setCategories("")
        setCollars("")

    }

    return (
        <>


            <div>
                <Button onClick={() => setIsModalOpen(true)} type="primary">Create User</Button>
            </div>

            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={() => handleSubmit()}
                onCancel={() => resetCloseModal()}
                okText="Create"

            >

                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                    <h2 style={{ textAlign: "center" }}>CREATE PRODUCT</h2>

                    <div>
                        <span>Code</span>
                        <Input
                            value={code}
                            onChange={(event) => setCode(event.target.value)} />
                    </div>

                    <div>
                        <span>Name</span>
                        <Input
                            value={name}
                            onChange={(event) => setName(event.target.value)} />
                    </div>

                    <div>
                        <span>Price</span>
                        <Input
                            value={price}
                            onChange={(event) => setPrice(event.target.value)} />
                    </div>

                    <div>
                        <span>dataCollar</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a dataCollar"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={collars}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectedCollar(value)}// Chỉ lấy đối tượng dataCollar đã chọn
                            value={selectedCollar}
                        />
                    </div>

                    <div>
                        <span>dataSleeve</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a dataSleeve"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={sleeves}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectedSleeve(value)}
                            value={selectedSleeve}
                        />
                    </div>

                    <div>
                        <span>dataCategory</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a dataCategory"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={categories}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectedCategory(value)}
                            value={selectedCategory}
                        />
                    </div>

                    <div>
                        <span>dataBrand</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a dataBrand"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={brands}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectedBrand(value)}
                            value={selectedBrand}
                        />
                    </div>

                    <div>
                        <span>Description</span>
                        <Input
                            value={description}
                            onChange={(event) => setDescription(event.target.value)} />
                    </div>


                </div>
            </Modal>
        </>
    );
};

export default ProductForm;
