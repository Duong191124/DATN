// import React from "react";
// import {Suspense, useState, useEffect } from "react";
// import { getAllStaff } from "../service/api.service";

// const StaffTable = React.lazy(() => import("../component/staff/staff.table"))

// const StaffManagement = () => {
//     const [dataStaff, setDataStaff] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize] = useState(10);

//     useEffect(() => {
//         loadStaff(currentPage, pageSize);
//     }, [currentPage]);

//     const loadStaff = async (page, pageSize) => {
//         try {
//             const res = await getAllStaff(page, pageSize);
//             console.log(res);
//             if (res.data) {
//                 setDataStaff(res.data);
//             }
//         } catch (error) {
//             console.error("Failed to load users:", error);
//         }
//     };

//     return (
//         <div style={{ padding: "20px" }}>

//             <Suspense fallback={<div>Loading...</div>}>
//                 <StaffTable dataStaff={dataStaff} />
//             </Suspense>
//         </div>
//     );
// };

// export default StaffManagement;
