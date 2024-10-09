
import { useEffect, useState } from "react";
import { fetchDataSleeveAPI } from "../service/api.service";
import SleeveForm from "../component/sleeve/sleeve.form";
import SleeveTable from "../component/sleeve/sleeve.table";


const SleevePage = () => {

    const [dataSleeve, setDataSleeve] = useState("")

    const loadSleeve = async () => {
        const res = await fetchDataSleeveAPI()
        setDataSleeve(res.data)

    }

    useEffect(() => {
        loadSleeve()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <SleeveForm
                loadSleeve={loadSleeve}
            />
            <SleeveTable
                loadSleeve={loadSleeve}
                dataSleeve={dataSleeve}
            />
        </div>
    )
}
export default SleevePage