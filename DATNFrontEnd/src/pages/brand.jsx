import { useEffect, useState } from "react";
import { fetchDataBrandAPI } from "../service/api.service";
import BrandForm from "../component/brand/brand.form";
import BrandTable from "../component/brand/brand.table";

const BrandPage = () => {

    const [dataBrand, setDataBrand] = useState("")
    const [listCode, setListCode] = useState("")
    const [listName, setListName] = useState("")

    const loadBrand = async () => {
        const res = await fetchDataBrandAPI()
        setDataBrand(res.data)
        setListCode(res.data.map(brand => brand.code))
        setListName(res.data.map(brand => brand.name))

    }

    useEffect(() => {
        loadBrand()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <BrandForm
                loadBrand={loadBrand}
                listCode={listCode}
                listName={listName}
            />
            <BrandTable
                loadBrand={loadBrand}
                dataBrand={dataBrand}
            />
        </div>
    )
}
export default BrandPage