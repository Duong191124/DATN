import ProductForm from "../component/product/product.form"
import ProductTable from "../component/product/product.table"

const ProductPage = () => {
    return (
        <>
            <div style={{ margin: "20px" }}>
                <ProductForm />
                <ProductTable />
            </div>
        </>
    )
}
export default ProductPage