import { Button, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { createProductAPI, fetchDataBrand, fetchDataCategory, fetchDataCollar, fetchDataSleeve } from "../../service/api.service";

const ProductForm = (props) => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [dataBrand, setDataBrand] = useState("");
    const [dataSleeve, setDataSleeve] = useState("");
    const [dataCategory, setDataCategory] = useState("");
    const [dataCollar, setDataCollar] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false)

    const { loadProduct } = props

    const handleSubmit = async () => {
        const res = await createProductAPI(code, name, description, price, dataSleeve?.name, dataCategory?.name, dataBrand?.name, dataCollar?.name);
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
        setDataBrand(res.data);
    };

    const loadDataSleeve = async () => {
        const res = await fetchDataSleeve();
        setDataSleeve(res.data);
    };

    const loadDataCategory = async () => {
        const res = await fetchDataCategory();
        setDataCategory(res.data);
    };

    const loadDataCollar = async () => {
        const res = await fetchDataCollar();
        setDataCollar(res.data);
    };


    const resetCloseModal = () => {
        setIsModalOpen(false)
        setCode("")
        setName("")
        setPrice("")
        setDescription("")
        setDataBrand("")
        setDataSleeve("")
        setDataCategory("")
        setDataCollar("")

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
                            options={dataCollar}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setDataCollar(dataCollar.find(c => c.id === value))}// Chỉ lấy đối tượng dataCollar đã chọn
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
                            options={dataSleeve}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setDataSleeve(dataSleeve.find(s => s.id === value))}
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
                            options={dataCategory}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setDataCategory(dataCategory.find(c => c.id === value))}
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
                            options={dataBrand}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setDataBrand(dataBrand.find(b => b.id === value))}
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
