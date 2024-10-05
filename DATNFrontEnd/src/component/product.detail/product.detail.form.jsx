import { Button, Input, Modal, notification, Select } from "antd"
import { useEffect, useState } from "react"
import { createProductDetailAPi, fetchAllProduct, fetchDataColorAPI, fetchDataSize } from "../../service/api.service";

const ProDuctDetailForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [code, setCode] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [productId, setProductId] = useState("");
    const [sizeId, setSizeId] = useState("");
    const [colorId, setColorId] = useState("")

    const [selectedProduct, setSelectedProduct] = useState("")
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectColor] = useState("")

    const { loadProductDetail } = props
    const handleSubmit = async () => {
        const res = await createProductDetailAPi(
            code, quantity, price, selectedProduct, selectedSize, selectedColor
        )
        if (res.data) {
            notification.success({
                message: "Create ProductDetail",
                Descriptions: "Create ProductDetail Success"
            })
            await loadProductDetail()
        }


    }
    const loadDataProduct = async () => {
        const res = await fetchAllProduct()
        setProductId(res.data)
    }

    const loadDataColor = async () => {
        const res = await fetchDataColorAPI()
        setColorId(res.data)
    }

    const loadDataSize = async () => {
        const res = await fetchDataSize()
        setSizeId(res.data)
    }

    useEffect(() => {
        loadDataProduct()
        loadDataColor()
        loadDataSize()
    }, [])
    const resetCloseModal = () => {
        setCode("")
        setQuantity("")
        setProductId("")
        setSizeId("")
        setColorId("")
        setIsModalOpen(false)
    }
    console.log("check data", code, quantity, price, selectedProduct, selectedSize, selectedColor)
    return (
        <>
            <div>
                <Button onClick={() => setIsModalOpen(true)} type="primary">Create Product</Button>
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
                        <span>Quantity</span>
                        <Input
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)} />
                    </div>

                    <div>
                        <span>Price</span>
                        <Input
                            value={price}
                            onChange={(event) => setPrice(event.target.value)} />
                    </div>

                    <div>
                        <span>Product</span>
                        <Select

                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a product"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={productId}
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
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={colorId}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectColor(value)}
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
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={sizeId}
                            fieldNames={{ label: "name", value: "id" }}
                            onChange={(value) => setSelectedSize(value)}
                            value={selectedSize}
                        />
                    </div>




                </div>
            </Modal>
        </>
    )
}
export default ProDuctDetailForm