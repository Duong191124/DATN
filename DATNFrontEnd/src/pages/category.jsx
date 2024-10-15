
import { useEffect, useState } from "react";
import { fetchDataCategoryAPI } from "../service/api.service";
import CategoryForm from "../component/category/category.form";
import CategoryTable from "../component/category/category.table";
import { Button } from "antd";
import { Link } from "react-router-dom";

const CategoryPage = () => {
    const [listName, setListName] = useState([])

    const [dataCategory, setDataCategory] = useState("")

    const loadCategory = async () => {
        const res = await fetchDataCategoryAPI()
        setDataCategory(res.data)
        setListName(res.data.map(category => category.name))

    }

    useEffect(() => {
        loadCategory()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <CategoryForm
                loadCategory={loadCategory}
                listName={listName}
            />
            <CategoryTable
                loadCategory={loadCategory}
                dataCategory={dataCategory}
            />
            <Button type="primary"><Link to="/products">Go to product</Link></Button>
        </div>
    )
}
export default CategoryPage