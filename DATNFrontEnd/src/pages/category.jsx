
import { useEffect, useState } from "react";
import { fetchDataCategoryAPI } from "../service/api.service";
import CollarForm from "../component/collar/collar.form";
import CollarTable from "../component/collar/collar.table";
import CategoryForm from "../component/category/category.form";
import CategoryTable from "../component/category/category.table";

const CategoryPage = () => {

    const [dataCategory, setDataCategory] = useState("")

    const loadCategory = async () => {
        const res = await fetchDataCategoryAPI()
        setDataCategory(res.data)

    }

    useEffect(() => {
        loadCategory()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <CategoryForm
                loadCategory={loadCategory}
            />
            <CategoryTable
                loadCategory={loadCategory}
                dataCategory={dataCategory}
            />
        </div>
    )
}
export default CategoryPage