import React, { Suspense } from "react";

const StaffTable = React.lazy(() => import("../component/staff/staff.table"))

const StaffManagement = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <StaffTable />
            </Suspense>
        </>
    );
};

export default StaffManagement;
