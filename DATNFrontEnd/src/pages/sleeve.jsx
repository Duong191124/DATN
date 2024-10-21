
import { useEffect, useState } from "react";
import { fetchDataSleeveAPI } from "../service/api.service";
import SleeveForm from "../component/sleeve/sleeve.form";
import SleeveTable from "../component/sleeve/sleeve.table";
import { Button } from "antd";
import { Link } from "react-router-dom";


const SleevePage = () => {
    const [listSleeveName, setListSleeveName] = useState([])
    const [listSleeveCode, setListSleeveCode] = useState([])
    const [dataSleeve, setDataSleeve] = useState("")

    const loadSleeve = async () => {
        const res = await fetchDataSleeveAPI()
        setDataSleeve(res.data)
        setListSleeveCode(res.data.map(sleeve => sleeve.code))
        setListSleeveName(res.data.map(sleeve => sleeve.name))

    }

    useEffect(() => {
        loadSleeve()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <SleeveForm
                loadSleeve={loadSleeve}
                listSleeveName={listSleeveName}
                listSleeveCode={listSleeveCode}
            />
            <SleeveTable
                loadSleeve={loadSleeve}
                dataSleeve={dataSleeve}
            />
            <Button type="primary"><Link to="/admin/products">Go to product</Link></Button>
        </div>
    )
}
export default SleevePage