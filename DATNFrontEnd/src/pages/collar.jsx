
import { useEffect, useState } from "react";
import { fetchDataCollarAPI } from "../service/api.service";
import CollarForm from "../component/collar/collar.form";
import CollarTable from "../component/collar/collar.table";

const CollarPage = () => {

    const [dataCollar, setDataCollar] = useState("")

    const loadCollar = async () => {
        const res = await fetchDataCollarAPI()
        setDataCollar(res.data)

    }

    useEffect(() => {
        loadCollar()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <CollarForm
                loadCollar={loadCollar}
            />
            <CollarTable
                loadCollar={loadCollar}
                dataCollar={dataCollar}
            />
        </div>
    )
}
export default CollarPage