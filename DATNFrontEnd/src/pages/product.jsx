import ProductForm from "../component/product/product.form"
import ProductTable from "../component/product/product.table"
import { fetchAllProduct } from "../service/api.service";
import { useEffect, useState } from "react";
const ProductPage = () => {

    const [dataProduct, setDataProduct] = useState([

    ])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadProduct();
    }, [page, pageSize]);

    const loadProduct = async () => {
        const res = await fetchAllProduct(page, pageSize)
        if (res.data) {
            setDataProduct(res.data.productResponseList)
            setPage(res.data.page)
            setPageSize(res.data.pageSize)
            setTotal(res.data.totalElement)

        }
    }


    return (
        <>
            <div style={{ margin: "20px" }}>
                <ProductForm loadProduct={loadProduct} />
                <ProductTable
                    loadProduct={loadProduct}
                    dataProduct={dataProduct}
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />
            </div>
        </>
    )
}
export default ProductPage