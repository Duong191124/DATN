import { Button, Input, Select } from "antd"

const ProductForm = () => {

    return (
        <>

            <div style={{
                display: "flex", gap: "20px", flexDirection: "column"
            }}>
                <h2 style={{ textAlign: "center" }}> CREATE PRODUCT</h2>
                <div>
                    <span>ID</span>
                    <Input />
                </div>

                <div>
                    <span>Code</span>
                    <Input />
                </div>

                <div>
                    <span>Price</span>
                    <Input />
                </div>

                <div>
                    <span>Collar</span> <br />
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a Collar"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '1',
                                label: '11',
                            },
                            {
                                value: '2',
                                label: '22',
                            },
                            {
                                value: '3',
                                label: '33',
                            },
                        ]}
                    />
                </div>


                <div>
                    <span>Sleeve</span> <br />
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a Sleeve    "
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '1',
                                label: '11',
                            },
                            {
                                value: '2',
                                label: '22',
                            },
                            {
                                value: '3',
                                label: '33',
                            },
                        ]}
                    />
                </div>


                <div>
                    <span>Category</span> <br />
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a Category    "
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '1',
                                label: '11',
                            },
                            {
                                value: '2',
                                label: '22',
                            },
                            {
                                value: '3',
                                label: '33',
                            },
                        ]}
                    />
                </div>

                <div>
                    <span>Brand</span> <br />
                    <Select
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Select a Brand    "
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '1',
                                label: '11',
                            },
                            {
                                value: '2',
                                label: '22',
                            },
                            {
                                value: '3',
                                label: '33',
                            },
                        ]}
                    />
                </div>


                <div>
                    <span>Description</span>
                    <Input />
                </div>

                <div>
                    <Button type="primary">Save</Button>
                </div>
            </div>


        </>



    )
}
export default ProductForm