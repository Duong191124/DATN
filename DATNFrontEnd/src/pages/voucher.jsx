import React, { useState } from 'react';
import VoucherTable from '../component/voucher/voucher.table';
import VoucherForm from '../component/voucher/voucher.form';

const VoucherPage = () => {
    const [refreshData, setRefreshData] = useState(false);

    const handleCreateVoucher = async (formData) => {
        setRefreshData(true); // Đặt trạng thái để tải lại dữ liệu
    };


    return (
        <>
            <div>
                <h1>Quản lý phiếu giảm giá</h1>
            </div>
            <VoucherForm loadData={() => setRefreshData(true)} onCreate={handleCreateVoucher} />
            <VoucherTable refreshData={refreshData} />
        </>
    );
};

export default VoucherPage;
