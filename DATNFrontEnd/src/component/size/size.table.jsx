import { Button, notification, Popconfirm, Table } from "antd";
import { deleteSizeAPI } from "../../service/api.service";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

import SizeUpdate from "./size.update";
import { render } from "react-dom";


const SizeTable = (props) => {
    const { dataSize, loadSize } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")


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

                        <Button
                            icon={<EditOutlined />}
                            style={{ cursor: "pointer", color: "orange" }}
                            onClick={() => {
                                setIsModalUpdateOpen(true)
                                setDataUpdate(record)
                            }}
                        >
                            Edit
                        </Button>
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