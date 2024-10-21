
import { useEffect, useState } from "react";
import { fetchDataCollarAPI } from "../service/api.service";
import CollarForm from "../component/collar/collar.form";
import CollarTable from "../component/collar/collar.table";
import { Button } from "antd";
import { Link } from "react-router-dom";

const CollarPage = () => {

    const [dataCollar, setDataCollar] = useState("")
    const [listCollarName, setListCollarName] = useState([])
    const [listCollarCode, setListCollarCode] = useState([])


    const loadCollar = async () => {
        const res = await fetchDataCollarAPI()
        setDataCollar(res.data)
        setListCollarCode(res.data.map(collar => collar.code))
        setListCollarName(res.data.map(collar => collar.name))

    }

    useEffect(() => {
        loadCollar()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <CollarForm
                loadCollar={loadCollar}
                listCollarName={listCollarName}
                listCollarCode={listCollarCode}
            />
            <CollarTable
                loadCollar={loadCollar}
                dataCollar={dataCollar}
            />
            <Button type="primary"><Link to="/products">Go to product</Link></Button>
        </div>
    )
}
export default CollarPage