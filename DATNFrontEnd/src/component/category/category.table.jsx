import { notification, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ColorUpdate from "./category.update";
import { deleteCategoryAPI } from "../../service/api.service";


const CategoryTable = (props) => {
    const { dataCategory, loadCategory } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")

    const deleteCategory = async (id) => {
        const res = await deleteCategoryAPI(id);
        if (res.data) {
            notification.success({
                message: "delete collar",
                description: "delete collar successfully"
            })
            await loadCategory()
        }
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
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
                        <Popconfirm
                            title="Xoá sản phẩm"
                            description="bạn có chắc chắn muốn xoá sản phẩm này không ?"
                            onConfirm={() => { deleteCategory(record.id) }}
                            okText="yes"
                            cancelText="no"
                            placement="left"
                        >
                            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                        </Popconfirm>
                    </div>
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