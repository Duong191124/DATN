import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { getAllPermission } from '../service/api.service'
import PermissionTable from '../component/permission/permission.table';
import PermissionModal from '../component/permission/permission.modal';
import PermissionUpdate from '../component/permission/permission.update';



const PermissionPage = () => {
    const [dataTable, setDataTable] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const loadData = async () => {
        try {
            const data = await getAllPermission();
            setDataTable(data.data.content);
        } catch (error) {
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