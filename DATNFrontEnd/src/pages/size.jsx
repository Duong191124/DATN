
import { useEffect, useState } from "react";
import { fetchDataSizeAPI } from "../service/api.service";
import SizeForm from "../component/size/size.form";
import SizeTable from "../component/size/size.table";
import { Button } from "antd";
import { Link } from "react-router-dom";


const SizePage = () => {

    const [dataSize, setDataSize] = useState("")
    const [listSizeCode, setListSizeCode] = useState([])
    const [listSizeName, setListSizeName] = useState([])
    const loadSize = async () => {
        const res = await fetchDataSizeAPI()
        setDataSize(res.data)
        setListSizeCode(res.data.map(size => size.code))
        setListSizeName(res.data.map(size => size.name))

    }

    useEffect(() => {
        loadSize()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <SizeForm
                loadSize={loadSize}
                listSizeCode={listSizeCode}
                listSizeName={listSizeName}
            />
            <SizeTable
                loadSize={loadSize}
                dataSize={dataSize}
            />
            <Button type="primary"><Link to="/products">Go to product</Link></Button>
        </div>
    )
}
export default SizePage