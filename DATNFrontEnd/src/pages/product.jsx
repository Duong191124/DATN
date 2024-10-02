import ProductForm from "../component/product/product.form"
import ProductTable from "../component/product/product.table"
import { fetchAllProduct } from "../service/api.service";
import { useEffect, useState } from "react";
const ProductPage = () => {

    const [dataProduct, setDataProduct] = useState([

    ])

    useEffect(() => {
        loadProduct()
    }, []);

    const loadProduct = async () => {
        const res = await fetchAllProduct()
        setDataProduct(res.data)
    }

    return (
        <>
            <div style={{ margin: "20px" }}>
                <ProductForm loadProduct={loadProduct} />
                <ProductTable loadProduct={loadProduct} dataProduct={dataProduct} />
            </div>
        </>
    )
}
export default ProductPage