
import { useEffect, useState } from "react";
import { fetchDataSizeAPI } from "../service/api.service";
import SizeForm from "../component/size/size.form";
import SizeTable from "../component/size/size.table";


const SizePage = () => {

    const [dataSize, setDataSize] = useState("")

    const loadSize = async () => {
        const res = await fetchDataSizeAPI()
        setDataSize(res.data)

    }

    useEffect(() => {
        loadSize()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <SizeForm
                loadSize={loadSize}
            />
            <SizeTable
                loadSize={loadSize}
                dataSize={dataSize}
            />
        </div>
    )
}
export default SizePage