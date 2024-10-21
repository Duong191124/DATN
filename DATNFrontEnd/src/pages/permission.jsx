import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { getAllPermissionPagination } from '../service/api.service'
import PermissionTable from '../component/permission/permission.table';
import PermissionModal from '../component/permission/permission.modal';



const PermissionPage = () => {
    const [dataTable, setDataTable] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);

    const loadData = async () => {
        try {
            const data = await getAllPermissionPagination(page, size);
            setDataTable(data.data.data.content);
            setTotal(data.data.data.totalElements)
        } catch (error) {
            console.error(error)
        }
    }

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <div style={{
                margin: "20px 50px",
            }}>
                <Button
                    onClick={handleOpenModal}
                    type='primary'>
                    Create
                </Button>
                <PermissionTable
                    dataTable={dataTable}
                    loadData={loadData}
                    setPage={setPage}
                    setSize={setSize}
                    page={page}
                    size={size}
                    total={total}
                />
                <PermissionModal
                    loadData={loadData}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            </div>
        </>
    )
}

export default PermissionPage