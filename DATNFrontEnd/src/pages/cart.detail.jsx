import { useState } from "react"
import CartDetailForm from "../component/cart.detail/cart.detail.form"
import CartDetailTable from "../component/cart.detail/cart.detail.table"
import { fetchDataAPICartDetail } from "../service/api.service"
import { useEffect } from "react"

const CartDetailPage = () => {
    const [dataCartDetail, setDataCartDetail] = useState("")

    const loadDataCartDetail = async () => {
        const res = await fetchDataAPICartDetail();
        setDataCartDetail(res.data.data);
    }
    useEffect(() => {
        loadDataCartDetail()
    }, [])
    return (
        <>
            <CartDetailForm />
            <CartDetailTable
                dataCartDetail={dataCartDetail}
            />
        </>
    )
}
export default CartDetailPage