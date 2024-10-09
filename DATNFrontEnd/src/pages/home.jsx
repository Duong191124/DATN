import { useEffect, useState } from "react";
import { getAllPermission } from "../service/api.service";
import PermissionTable from "../component/permission/permission.table";

const HomePage = () => {
    const [dataPermission, setDataPermission] = useState([]);

    useEffect(() => {
        loadPermission();
    }, [])

    const loadPermission = async() => {
        const res = await getAllPermission();
        if(res.data){
            setDataPermission(res.data.result);
        }
    }

    return (
        <div>
            <PermissionTable
                dataPermission={dataPermission}
                loadPermission={loadPermission}
            />
        </div>
    )
};

export default HomePage;
