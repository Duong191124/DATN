import ColorForm from "../component/collor/collor.form"
import ColorTable from "../component/collor/color.table"
import { useEffect, useState } from "react";
import { fetchDataColor } from "../service/api.service";

const ColorPage = () => {

    const [dataColor, setDataColor] = useState("")

    const loadColor = async () => {
        const res = await fetchDataColor()
        setDataColor(res.data)

    }

    useEffect(() => {
        loadColor()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <ColorForm
                loadColor={loadColor}
            />
            <ColorTable
                loadColor={loadColor}
                dataColor={dataColor}
            />
        </div>
    )
}
export default ColorPage