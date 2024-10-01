import { Button, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { createProductAPI, fetchDataBrand, fetchDataCategory, fetchDataCollar, fetchDataSleeve } from "../../service/api.service";

const ProductForm = (props) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [brand, setSelectedBrand] = useState("");
    const [sleeve, setSleeve] = useState("");
    const [category, setCategory] = useState("");
    const [collar, setCollar] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false)

    const { loadProduct } = props

    const handleSubmit = async () => {
        const res = await createProductAPI(code, name, description, price, sleeve?.name, category?.name, brand?.name, collar?.name);
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
        loadBrand();
        loadSleeve();
        loadCategory();
        loadCollar();
    }, []);

    const loadBrand = async () => {
        const res = await fetchDataBrand();
        setSelectedBrand(res.data);
    };

    const loadSleeve = async () => {
        const res = await fetchDataSleeve();
        setSleeve(res.data);
    };

    const loadCategory = async () => {
        const res = await fetchDataCategory();
        setCategory(res.data);
    };

    const loadCollar = async () => {
        const res = await fetchDataCollar();
        setCollar(res.data);
    };


    const resetCloseModal = () => {
        setIsModalOpen(false)
        setCode("")
        setName("")
        setPrice("")
        setDescription("")
        setSelectedBrand("")
        setSleeve("")
        setCategory("")
        setCollar("")

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
                        <span>Collar</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a Collar"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={collar}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setCollar(collar.find(c => c.id === value))}// Chỉ lấy đối tượng collar đã chọn
                        />
                    </div>

                    <div>
                        <span>Sleeve</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a Sleeve"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={sleeve}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSleeve(sleeve.find(s => s.id === value))}
                        />
                    </div>

                    <div>
                        <span>Category</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a Category"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={category}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setCategory(category.find(c => c.id === value))}
                        />
                    </div>

                    <div>
                        <span>Brand</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a Brand"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={brand}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectedBrand(brand.find(b => b.id === value))}
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
