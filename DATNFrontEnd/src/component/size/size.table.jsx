import { notification, Popconfirm, Table } from "antd";
import { deleteSizeAPI } from "../../service/api.service";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

import SizeUpdate from "./size.update";
import { render } from "react-dom";


const SizeTable = (props) => {
    const { dataSize, loadSize } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")

    const deleteSize = async (id) => {
        const res = await deleteSizeAPI(id);
        if (res.data) {
            notification.success({
                message: "create size",
                description: "create size successfully"
            })
            await loadSize()
        }
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Code',
            dataIndex: 'code',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                return status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'
            }

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
                            onConfirm={() => { deleteSize(record.id) }}
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
            <Table dataSource={dataSize} columns={columns} />
            <SizeUpdate
                idModalUpdateOpen={idModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadSize={loadSize}
            />
        </>
    )
}
export default SizeTable