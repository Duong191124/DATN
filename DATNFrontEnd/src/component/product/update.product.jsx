import { useEffect, useState } from "react";
import { fetchDataBrand, fetchDataCategory, fetchDataCollar, fetchDataSleeve, updateProductAPI, } from "../../service/api.service";
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
    const [selectedValueCollar, setSelectedValueCollar] = useState();
    const [selectedValueBrand, setSelectedValueBrand] = useState();
    const [selectedValueCategory, setSelectedValueCategory] = useState();
    const [selectValueSleeve, setSelectValueSleeve] = useState();
    const [id, setId] = useState("")

    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props

    useEffect(() => {
        console.log(dataUpdate)
        if (dataUpdate) {
            setId(dataUpdate.id)
            setCode(dataUpdate.code)
            setName(dataUpdate.name)
            setPrice(dataUpdate.price)
            setDescription(dataUpdate.description)
            setSelectedValueCollar(dataUpdate.collar_name)
            setSelectedValueBrand(dataUpdate.brandName)
            setSelectedValueCategory(dataUpdate.categoryName)
            setSelectValueSleeve(dataUpdate.sleeveName)

        }
    }, [dataUpdate])


    const handleSubmit = async () => {
        const res = await updateProductAPI(id, code, name, description, price, dataSleeve?.name, dataCategory?.name, dataBrand?.name, dataCollar?.name);
        if (res.data) {
            notification.success({
                message: "Update product",
                description: "Update product success"
            });
            resetCloseModal();
            // await loadProduct();
        } else {
            notification.error({
                message: "Update product",
                description: JSON.stringify(res.message)
            });
        }


    };


    useEffect(() => {
        loadDataBrand();
        loadDataSleeve();
        loadDataCategory();
        loadDataCollar();
    }, [dataUpdate]);

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
        setIsModalUpdateOpen(false)
        setCode("")
        setName("")
        setPrice("")
        setDescription("")
        setDataBrand("")
        setDataSleeve("")
        setDataCategory("")
        setDataCollar("")
        setDataUpdate(null)
    }

    return (
        <Modal
            title="Update Product"
            open={isModalUpdateOpen}
            onOk={() => handleSubmit()}
            onCancel={() => resetCloseModal()}
            okText="SAVE"

        >

            <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                <div>
                    <span>ID</span>
                    <Input
                        value={id}
                        onChange={(event) => setId(event.target.value)}
                        disabled />

                </div>

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
                    <span>Collar </span>
                    <Select

                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a dataCollar"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataCollar}
                        fieldNames={{ label: "name", value: "name" }}
                        value={selectedValueCollar}
                        onChange={(value) => { setSelectedValueCollar(value) }}// Chỉ lấy đối tượng dataCollar đã chọn
                    />
                </div>

                <div>
                    <span>Sleeve</span>
                    <Select

                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a dataSleeve"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataSleeve}
                        fieldNames={{ label: "name", value: "id" }}
                        value={selectValueSleeve}
                        onChange={(value) => setSelectValueSleeve(value)}
                    />
                </div>

                <div>
                    <span>Category</span>
                    <Select

                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a dataCategory"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataCategory}
                        fieldNames={{ label: "name", value: "id" }}
                        value={selectedValueCategory}
                        onChange={(value) => setSelectedValueCategory(value)}
                    />
                </div>

                <div>
                    <span>Brand</span>
                    <Select

                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a dataBrand"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataBrand}
                        fieldNames={{ label: "name", value: "id" }}
                        value={selectedValueBrand}
                        onChange={(value) => setSelectedValueBrand(value)}
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
    )
}
export default UpdateProduct