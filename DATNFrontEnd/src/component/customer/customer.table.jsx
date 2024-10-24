import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Table, Space } from "antd"
import { useEffect } from "react";
import { softDelete } from "../../service/api.service";

const CustomerTable = ({ dataTable, loadData, setPage, setSize, page, size, total, setIsModalOpen, setDataDetail, setIsModalOpenU })=>{
    
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_, __, index) => {
                return <p>{(index + 1) + (size * (page - 1))}</p>;  // Hiển thị thứ tự dựa trên chỉ mục
            },
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'User name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <p>{record.status == 1? "Activate": "Inactivate"}</p>
            )
        },
        {
            title: 'Date of birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Note',
            dataIndex: 'notes',
            key: 'notes',
        },
        ,
        {
            title: 'Gender',
            key: 'gender',
            render: (_, record) => (
                <p>{handleGender(record.gender)}</p>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => {
                            handleUpdate(record);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure to disable this task?"
                        onConfirm={() => {
                            hanleSoftDelete(record.id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('check data onChange ', pagination)
        if (+page != +pagination.pageSize || +size != pagination.current) {
            setPage(pagination.current)
            setSize(pagination.pageSize)
            console.log("check page: ", page);
            console.log("check sixe: ", size);
        }
    };

    const hanleSoftDelete = async (id)=>{
        await softDelete(id);
        await loadData();
    }

    const handleUpdate = (record)=>{
        setDataDetail(record)
        setIsModalOpenU(true)
    }

    const handleGender = (gender)=>{
        if(gender === 1){
            return "Male"
        }else if(gender === 2){
            return "Female"
        }else{
            return 'Other'
        }
    }
    
    useEffect(() => {
        loadData();
    }, [page, size])

    return(
        <>
         <Table
                style={{
                    marginTop: 30,
                }}
                columns={columns}
                dataSource={dataTable}
                rowKey={'id'}
                pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '30', "50"],
                    current: page,
                    pageSize: size,
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) },
                    total: total
                }}
                onChange={onChange}
            />
        </>
    )
}
export default CustomerTable