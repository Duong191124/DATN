import { useEffect, useState } from "react";
import { fetchDataCategoryAPI } from "../service/api.service";
import CategoryForm from "../component/category/category.form";
import CategoryTable from "../component/category/category.table";

const CategoryPage = () => {
  const [listName, setListName] = useState([]);

  const [dataCategory, setDataCategory] = useState("");

  const loadCategory = async () => {
    const res = await fetchDataCategoryAPI();
    setDataCategory(res.data.data);
    setListName(res.data.map((category) => category.name));
  };

  useEffect(() => {
    loadCategory();
  }, []);
  return (
    <div style={{ margin: "20px" }}>
      <CategoryForm loadCategory={loadCategory} listName={listName} />
      <CategoryTable loadCategory={loadCategory} dataCategory={dataCategory} />
    </div>
  );
};
export default CategoryPage;
