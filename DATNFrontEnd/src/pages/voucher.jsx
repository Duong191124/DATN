import React, { useState } from 'react';
import { Row, Col } from 'antd';
import VoucherTable from '../component/voucher/voucher.table';
import VoucherForm from '../component/voucher/voucher.form';

const VoucherPage = () => {
    const [refreshData, setRefreshData] = useState(false);

    const handleCreateVoucher = async (formData) => {
        console.log('New Voucher Created: ', formData);
        const response = await createVoucher(formData);

        if (response && response.data) {
            setRefreshData(prev => !prev); // Đảo ngược để kích hoạt tải lại dữ liệu
        }
    };


    return (
        <>
           <VoucherForm loadData={() => setRefreshData(prev => !prev)} onCreate={handleCreateVoucher} />
            <VoucherTable refreshData={refreshData} /> {/* Truyền refreshData cho VoucherTable */}
        </>
    );
};

export default VoucherPage;
