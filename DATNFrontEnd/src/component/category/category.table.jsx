import { Button, notification, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ColorUpdate from "./category.update";
import { deleteCategoryAPI } from "../../service/api.service";


const CategoryTable = (props) => {
    const { dataCategory, loadCategory } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => {
                return (
                    <Button
                        icon={<EditOutlined />}
                        style={{ cursor: "pointer", color: "orange" }}
                        onClick={() => {
                            setIsModalUpdateOpen(true)
                            setDataUpdate(record)
                        }}
                    >Edit</Button>
                )
            }
        }
    ];
    return (
        <>
            <Table dataSource={dataCategory} columns={columns} />
            <ColorUpdate
                idModalUpdateOpen={idModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadCategory={loadCategory}
            />
        </>
    )
}
export default CategoryTable