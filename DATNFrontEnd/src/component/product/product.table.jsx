import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Table } from "antd";
import UpdateProduct from "./update.product";
import { useState } from "react";



const ProductTable = (props) => {
    const { dataProduct } = props;


    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)

    const [dataUpdate, setDataUpdate] = useState("")

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Code',
            dataIndex: 'code'
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Price',
            dataIndex: 'price'
        },
        {
            title: 'Collar',
            dataIndex: 'collar_name'
        },
        {
            title: 'Sleeve',
            dataIndex: 'sleeveName'
        },
        {
            title: 'Category',
            dataIndex: 'categoryName'
        },
        {
            title: 'Brand',
            dataIndex: 'brandName'
        },
        {
            title: 'Description',
            dataIndex: 'description'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "20px" }}>
                        <EditOutlined
                            style={{ cursor: "pointer", color: "orange" }}
                            onClick={() => {
                                setIsModalUpdateOpen(true)
                                setDataUpdate(record)
                            }}
                        />
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </div>
                )
            }
        }
    ];
    return (
        <>
            < Table
                dataSource={dataProduct}
                columns={columns}
                rowKey={"id"} />
            <UpdateProduct
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}
export default ProductTable




